import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { formulaSheets } from "@/lib/formula-sheet-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { hasPlusAccess } from "@/lib/supabase/entitlements";
import { getServerIdentity } from "@/lib/supabase/server-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const sheet = formulaSheets.find((item) => `${item.slug}.pdf` === filename);
  if (!sheet) return new NextResponse("Not found", { status: 404 });

  const identity = isSupabaseConfigured ? await getServerIdentity() : null;
  if (!identity?.role)
    return new NextResponse("Authentication required", { status: 401 });
  if (identity.role !== "admin" && !(await hasPlusAccess())) {
    return new NextResponse("Plus subscription required", { status: 403 });
  }

  const filePath = path.join(process.cwd(), "private", "formula-sheets", filename);
  const pdf = await readFile(filePath);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
