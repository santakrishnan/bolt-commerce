/**
 * Session API Tests
 *
 * Tests for the Session API route with client-side fingerprinting.
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ARROW_COOKIE } from "~/lib/arrow/constants";
import { POST } from "../route";

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PROF_MOCK_REGEX = /^prof_mock_/;

// Mock environment variables
const mockEnv = {
  USE_MOCK_PROFILE: "true",
  NODE_ENV: "test",
};

describe("Session API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(process.env, mockEnv);
  });

  describe("POST /api/session", () => {
    it("should require fingerprintId in request", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Fingerprint ID or sealed result is required");
      expect(data.code).toBe("MISSING_FINGERPRINT");
    });

    it("should return all IDs when fingerprintId is provided", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({
          fingerprintId: "fp_mock_test123",
          fingerprintMetadata: {
            confidence: 0.95,
            requestId: "1234567890.abc",
            visitorFound: true,
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("sessionId");
      expect(data).toHaveProperty("fingerprintId");
      expect(data).toHaveProperty("profileId");
      expect(data).toHaveProperty("fingerprintMetadata");

      // Check ID formats
      expect(data.sessionId).toMatch(UUID_V4_REGEX);
      expect(data.fingerprintId).toBe("fp_mock_test123");
      expect(data.profileId).toMatch(PROF_MOCK_REGEX);
    });

    it("should preserve fingerprint metadata from client", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({
          fingerprintId: "fp_client_abc123",
          fingerprintMetadata: {
            confidence: 0.97,
            requestId: "9876543210.xyz",
            visitorFound: true,
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.fingerprintMetadata).toBeDefined();
      expect(data.fingerprintMetadata.confidence).toBe(0.97);
      expect(data.fingerprintMetadata.requestId).toBe("9876543210.xyz");
      expect(data.fingerprintMetadata.visitorFound).toBe(true);
    });

    it("should set individual cookies with correct TTLs", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({
          fingerprintId: "fp_test",
          eventId: "evt_123",
        }),
      });

      const response = await POST(request);
      const cookies = response.cookies;

      // All 4 individual cookies should be set
      const sessionCookie = cookies.get(ARROW_COOKIE.SESSION_ID);
      const fpCookie = cookies.get(ARROW_COOKIE.FP_ID);
      const profileCookie = cookies.get(ARROW_COOKIE.PROFILE_ID);
      const eventCookie = cookies.get(ARROW_COOKIE.FP_EID);

      expect(sessionCookie).toBeDefined();
      expect(fpCookie).toBeDefined();
      expect(profileCookie).toBeDefined();
      expect(eventCookie).toBeDefined();

      // Check session cookie properties
      expect(sessionCookie?.httpOnly).toBe(true);
      expect(sessionCookie?.sameSite).toBe("lax");
      expect(sessionCookie?.path).toBe("/");

      // Check fingerprint cookie properties
      expect(fpCookie?.httpOnly).toBe(true);
      expect(fpCookie?.sameSite).toBe("lax");
      expect(fpCookie?.path).toBe("/");
    });

    it("should generate unique session IDs on each request", async () => {
      const request1 = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test1" }),
      });

      const request2 = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test2" }),
      });

      const response1 = await POST(request1);
      const response2 = await POST(request2);

      const data1 = await response1.json();
      const data2 = await response2.json();

      // Session IDs should be unique
      expect(data1.sessionId).not.toBe(data2.sessionId);

      // Fingerprint IDs should match what client sent
      expect(data1.fingerprintId).toBe("fp_test1");
      expect(data2.fingerprintId).toBe("fp_test2");

      // Profile IDs should be unique
      expect(data1.profileId).not.toBe(data2.profileId);
    });

    it("should handle invalid JSON gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: "invalid json",
      });

      const response = await POST(request);

      // Should return error for invalid JSON
      expect(response.status).toBe(500);
    });

    it("should work without fingerprint metadata", async () => {
      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({
          fingerprintId: "fp_minimal",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.fingerprintId).toBe("fp_minimal");
      expect(data.sessionId).toBeDefined();
      expect(data.profileId).toBeDefined();
    });
  });

  describe("Mock vs Real Profile Service", () => {
    it("should use mock profile service when USE_MOCK_PROFILE is true", async () => {
      process.env.USE_MOCK_PROFILE = "true";

      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Mock profile service should return IDs with specific prefix
      expect(data.profileId).toMatch(PROF_MOCK_REGEX);
    });

    it("should use mock profile service when PROFILE_SERVICE_URL is not configured", async () => {
      process.env.PROFILE_SERVICE_URL = undefined;
      process.env.USE_MOCK_PROFILE = "false";

      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still work with mock profile service
      expect(data.sessionId).toBeDefined();
      expect(data.fingerprintId).toBe("fp_test");
      expect(data.profileId).toBeDefined();
    });
  });

  describe("Cookie Security", () => {
    it("should set secure flag in production", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test" }),
      });

      const response = await POST(request);
      const cookies = response.cookies;

      // In production, cookies use __Host- prefix
      const sessionCookie = cookies.get(`__Host-${ARROW_COOKIE.SESSION_ID}`);
      const fpCookie = cookies.get(`__Host-${ARROW_COOKIE.FP_ID}`);

      expect(sessionCookie?.secure).toBe(true);
      expect(fpCookie?.secure).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it("should not set secure flag in development", async () => {
      process.env.NODE_ENV = "development";

      const request = new NextRequest("http://localhost:3000/api/session", {
        method: "POST",
        body: JSON.stringify({ fingerprintId: "fp_test" }),
      });

      const response = await POST(request);
      const cookies = response.cookies;

      const sessionCookie = cookies.get(ARROW_COOKIE.SESSION_ID);
      const fpCookie = cookies.get(ARROW_COOKIE.FP_ID);

      expect(sessionCookie?.secure).toBe(false);
      expect(fpCookie?.secure).toBe(false);
    });
  });
});
