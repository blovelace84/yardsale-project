import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description is too long"),
  price: z.coerce
    .number()
    .finite("Price must be a valid number")
    .min(0, "Price must be greater than or equal to 0"),
  imageUrl: z
    .union([z.string().trim().url("Image URL must be a valid URL"), z.literal(""), z.null()])
    .optional(),
});

export const createMessageSchema = z.object({
  content: z.string().trim().min(1, "Message content is required").max(2000, "Message is too long"),
  receiverId: z.string().trim().min(1, "Receiver ID is required"),
  listingId: z.string().trim().min(1, "Listing ID is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().max(100, "Name is too long").optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export function getZodErrorMessage(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? "Invalid request data";
}

type ValidationSuccess<TSchema extends z.ZodTypeAny> = {
  success: true;
  data: z.infer<TSchema>;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export async function validateRequestBody<TSchema extends z.ZodTypeAny>(
  req: Request,
  schema: TSchema
): Promise<ValidationSuccess<TSchema> | ValidationFailure> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: getZodErrorMessage(result.error),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      error: "Invalid JSON body",
    };
  }
}
