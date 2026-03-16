import { z } from "zod";
import { getDB } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { desc, isNull } from "drizzle-orm";
import { verifyCaptchaToken } from "@/lib/captcha";

// Validation schema
const contactSubmissionSchema = z.object({
	fullName: z.string().min(1, "Full name is required").max(255),
	email: z.string().email("Invalid email").max(255),
	phoneNumber: z.string().max(20).optional(),
	country: z.string().max(100).optional(),
	subject: z.string().min(1, "Subject is required").max(255),
	message: z.string().min(1, "Message is required"),
	recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validate input
		const validatedData = contactSubmissionSchema.parse(body);

		// Verify reCAPTCHA token
		const captchaResult = await verifyCaptchaToken(
			validatedData.recaptchaToken,
		);

		if (!captchaResult.success) {
			console.warn(
				"reCAPTCHA verification failed:",
				captchaResult.error,
				"Score:",
				captchaResult.score,
			);
			return Response.json(
				{ error: "reCAPTCHA verification failed. Please try again." },
				{ status: 400 },
			);
		}

		// Save to database
		const db = getDB(process.env);
		await db.insert(contactSubmissions).values({
			fullName: validatedData.fullName,
			email: validatedData.email,
			phoneNumber: validatedData.phoneNumber || null,
			country: validatedData.country || null,
			subject: validatedData.subject,
			message: validatedData.message,
			status: "new",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return Response.json(
			{
				success: true,
				message: "Submission received successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{
					error: "Validation failed",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		console.error("Error saving contact submission:", error);
		return Response.json(
			{ error: "Failed to save submission" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const db = getDB(process.env);
		const submissions = await db
			.select()
			.from(contactSubmissions)
			.orderBy(desc(contactSubmissions.createdAt));

		return Response.json(submissions);
	} catch (error) {
		console.error("Error fetching contact submissions:", error);
		return Response.json(
			{ error: "Failed to fetch submissions" },
			{ status: 500 },
		);
	}
}
