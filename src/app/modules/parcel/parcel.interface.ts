import { Types } from "mongoose";
import { IUser, Role } from "../user/user.interface";

export enum CancelReason {
  DELIVERY_FAILED = "DELIVERY_FAILED",
  ADDRESS_ISSUE = "ADDRESS_ISSUE",
  RECEIVER_REJECTED = "RECEIVER_REJECTED",
  SENDER_REQUESTED = "SENDER_REQUESTED",
  BUSINESS_POLICY = "BUSINESS_POLICY",
}

export interface ReturnParcelPayload {
  returnReason: string;
  returnType: CancelReason;
  requestedBy: string;
  returnLocation?: string;
}

export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  BLOCKED = "BLOCKED",
  RETURNED = "RETURNED",
  RESCHEDULED = "RESCHEDULED",
}

export interface IStatusLog {
  status: ParcelStatus;
  timestamp: Date;
  updatedAt: Date;
  updatedBy: Types.ObjectId | Role;
  location?: string;
  note?: string;
}

export enum ParcelType {
  ELECTRONICS = "ELECTRONICS",
  DOCUMENT = "DOCUMENT",
  PACKAGE = "PACKAGE",
  FRAGILE = "FRAGILE",
  LIQUID = "LIQUID",
  FOOD = "FOOD",
  OTHER = "OTHER",
}

export interface ParcelAddress {
  name: string;
  phone: string;
  division: string;
  city: string;
  area: string;
  detailAddress: string;
}

export interface ParcelFee {
  baseRate: number;
  weightCharge: number;
  distanceCharge: number;
  totalFee: number;
}

export enum PaymentMethod {
  COD = "COD",
  PREPAID = "PREPAID",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface IParcel {
  _id?: Types.ObjectId;
  trackingId: string;
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  parcelType: ParcelType;
  weight: number;
  parcelFee: ParcelFee;
  description?: string;
  senderInfo: ParcelAddress;
  receiverInfo: ParcelAddress;
  actualPickupDate?: Date;
  actualDeliveryDate?: Date;
  status: ParcelStatus;
  statusLogs: IStatusLog[];
  assignedDeliveryPartner?: Types.ObjectId;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentId?: Types.ObjectId;
  codAmount?: number;
  cancellationReason?: string;
  cancelledBy?: Types.ObjectId;
  blockReason?: string;
  blockedBy?: Types.ObjectId;
  isBlocked?: boolean;
  isCancelled?: boolean;
  isDelivered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}