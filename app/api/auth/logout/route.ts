import { clearSessionCookie } from "@/lib/session";

// Use nodejs runtime for consistency with login route
export const dynamic = "force-dynamic";

export async function POST() {
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
