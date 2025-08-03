import { z } from "zod";
import {
  CancelReason,
  ParcelStatus,
  ParcelType,
  PaymentMethod,
  PaymentStatus,
} from "./parcel.interface";

// Address validation schema
const addressZodSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
  division: z.string().min(1, "Division is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  detailAddress: z
    .string()
    .min(1, "Detail address is required")
    .max(500, "Address too long"),
});

const parcelFeeZodSchema = z.object({
  baseRate: z.number().min(0, "Base rate cannot be negative"),
  weightCharge: z.number().min(0, "Weight charge cannot be negative"),
  distanceCharge: z.number().min(0, "Distance charge cannot be negative"),
  totalFee: z.number().min(0, "Total fee cannot be negative"),
});

export const trackingEventZodSchema = z.object({
  updaterId: z.string().optional(),
  status: z.enum(ParcelStatus),
  location: z.string().optional(),
  note: z.string().optional(),
});

// Main parcel validation schema
export const parcelZodSchema = z.object({
  _id: z.string().optional(),
  trackingId: z.string().optional(),

  senderId: z.string().min(1, "Sender ID is required"),
  receiverId: z.string().optional(),

  parcelType: z.enum(ParcelType),
  weight: z
    .number()
    .min(0.1, "Weight must be at least 0.1 kg")
    .max(50, "Weight cannot exceed 50 kg"),
  description: z.string().max(500, "Description too long").optional(),

  senderInfo: addressZodSchema,
  receiverInfo: addressZodSchema,

  actualPickupDate: z.date().optional(),
  actualDeliveryDate: z.date().optional(),

  status: z.enum(ParcelStatus).optional(),
  trackingEvents: z.array(trackingEventZodSchema).default([]),

  assignedDeliveryPartner: z.string().optional(),

  parcelFee: parcelFeeZodSchema,
  paymentMethod: z.enum(PaymentMethod),
  paymentStatus: z.enum(PaymentStatus).optional(),
  codAmount: z.number().min(0, "COD amount cannot be negative").optional(),

  cancellationReason: z
    .string()
    .max(200, "Cancellation reason too long")
    .optional(),
  cancelledBy: z.string().optional(),

  // blockReason: z.string().max(200, "Block reason too long").optional(),
  // blockedBy: z.string().optional(),
});

export const assignDeliverySchema = z.object({
  updaterId: z.string().length(24, { message: "Invalid updaterId format" }),
  parcelId: z.string().length(24, { message: "Invalid parcelId format" }),
  deliveryPersonId: z
    .string()
    .length(24, { message: "Invalid deliveryPersonId format" }),
});

export const trackingEventSchema = z.object({
  updaterId: z.string().length(24, { message: "Invalid updaterId format" }),
  status: ParcelStatus,
  location: z.string().optional(),
  note: z.string().optional(),
});

export const parcelUpdateZodSchema = z.object({
  //   _id: z.string().optional(),
  //   trackingId: z.string().optional(),

  //   senderId: z.string().optional(),
  //   receiverId: z.string().optional(),

  parcelType: z.enum(ParcelType).optional(),
  weight: z
    .number()
    .min(0.1, "Weight must be at least 0.1 kg")
    .max(50, "Weight cannot exceed 50 kg")
    .optional(),

  description: z.string().max(500, "Description too long").optional(),

  senderInfo: addressZodSchema.optional(),
  receiverInfo: addressZodSchema.optional(),

  //   actualPickupDate: z.date().optional(),
  //   actualDeliveryDate: z.date().optional(),

  //   status: z.enum(Parcel_Status).optional(),
  //   trackingEvents: z.array(trackingEventZodSchema).optional(),

  //   assignedDeliveryPartner: z.string().optional(),

  //   parcelFee: parcelFeeZodSchema.optional(),
  paymentMethod: z.enum(PaymentMethod).optional(),
  //   paymentStatus: z.enum(Payment_Status).optional(),
  //   codAmount: z.number().min(0, "COD amount cannot be negative").optional(),

  //   cancellationReason: z.string().max(200, "Cancellation reason too long").optional(),
  //   cancelledBy: z.string().optional(),

  // blockReason: z.string().max(200, "Block reason too long").optional(),
  // blockedBy: z.string().optional(),
});

export const returnParcelZodSchema = z.object({
  returnReason: z.string().min(1, "Return reason is required"),
  returnType: z.enum(CancelReason),
  requestedBy: z.string().min(1, "Requested by is required"),
  returnLocation: z.string().optional(),
});
