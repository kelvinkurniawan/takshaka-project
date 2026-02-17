import { clearSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await clearSessionCookie();

    return Response.json(
      { success: true, message: "Logout berhasil" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Gagal melakukan logout" }, { status: 500 });
  }
}
