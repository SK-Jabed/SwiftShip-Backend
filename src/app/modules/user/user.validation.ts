import z from "zod";
import { IsActive, Role } from "./user.interface";

const AddressSchema = z.object({
  district: z.string().min(1, { message: "Division is required" }).optional(),
  city: z.string().min(1, { message: "City is required" }).optional(),
  area: z.string().min(1, { message: "Area is required" }).optional(),
  roadNo: z.string().optional(),
  houseNo: z.string().optional(),
});

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ message: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number",
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message: "Password must include at least one special character",
    }),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  picture: z.string().optional(),
  address: AddressSchema.optional(),
  isVerified: z.boolean().optional().default(false),
  isDeleted: z.boolean().optional().default(false),
  isActive: z.enum(Object.values(IsActive)).optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number",
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message: "Password must include at least one special character",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  picture: z.string().optional(),
  address: AddressSchema.optional(),
  role: z.enum(Object.values(Role)).optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),
});