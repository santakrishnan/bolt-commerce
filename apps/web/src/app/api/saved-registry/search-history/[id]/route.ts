/**
 * Single Search Entry API — Proxy Route
 *
 * DELETE /api/saved-registry/search-history/:id → Remove a search entry
 */

import { type NextRequest, NextResponse } from "next/server";
import { extractArrowIds } from "~/lib/arrow/server-api";
import * as searchHistoryService from "~/lib/saved-registry/search-history.service";

function resolveVisitorId(req: NextRequest): string {
  const { fingerprintId } = extractArrowIds(req);
  return fingerprintId ?? "anonymous";
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const visitorId = resolveVisitorId(req);
    const data = await searchHistoryService.remove(visitorId, id);

    // BED: const ids = extractArrowIds(req);
    //      const { data } = await bedClient.delete(`/search-history/${id}`, {
    //        ids,
    //        headers: extractForwardHeaders(req),
    //      });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[SearchHistoryAPI] DELETE /:id error:", error);
    return NextResponse.json({ data: [], error: "Failed to remove search entry" }, { status: 500 });
  }
}
