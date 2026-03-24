import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

/**
 * On-demand cache revalidation endpoint for VDP (and other cached data).
 *
 * Usage examples:
 *   POST /api/revalidate { "tag": "vin-1G1AF1F57A7192174", "secret": "..." }
 *     → Invalidates cache for a single VIN
 *
 *   POST /api/revalidate { "tag": "vdp", "secret": "..." }
 *     → Invalidates ALL VDP caches
 *
 * Next.js 16 notes:
 *   - `revalidateTag(tag, "max")` uses stale-while-revalidate semantics:
 *     the stale entry is served immediately while a fresh one is generated
 *     in the background. This is the recommended default for webhooks.
 *   - For Server Actions that need read-your-writes consistency,
 *     use `updateTag(tag)` instead (not applicable in Route Handlers).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, secret } = body as { tag?: string; secret?: string };

    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag || typeof tag !== "string") {
      return Response.json({ error: "Missing or invalid 'tag' field" }, { status: 400 });
    }

    revalidateTag(tag, "max");

    return Response.json({ revalidated: true, tag, now: Date.now() });
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
