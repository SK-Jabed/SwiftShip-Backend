import { Types } from "mongoose";

export interface IUserAddress {
  district?: string;
  city?: string;
  area?: string;
  roadNo?: string;
  houseNo?: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  DELIVERY_PERSON = "DELIVERY_PERSON",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: IUserAddress;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  role: UserRole;
  auths: IAuthProvider[];
  parcelsSent?: Types.ObjectId[];
  parcelsReceived?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}