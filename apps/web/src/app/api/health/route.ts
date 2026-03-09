import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection(); // Opt into dynamic rendering (replaces force-dynamic)
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
