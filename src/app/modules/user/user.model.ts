import { model, Schema } from "mongoose";
import {
  IAuthProvider,
  IsActive,
  IUser,
  IUserAddress,
  Role,
} from "./user.interface";

const UserAddressSchema = new Schema<IUserAddress>(
  {
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    roadNo: { type: String, trim: true },
    houseNo: { type: String, trim: true },
  },
  { _id: false, versionKey: false }
);

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      //   required: [true, "Password is required"],
      minlength: [8, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      //   required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    picture: { type: String, trim: true },
    address: {
      type: UserAddressSchema,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      //   required: [true, "Role is required"],
      default: Role.SENDER,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    auths: {
      type: [AuthProviderSchema],
      required: true,
      default: [],
    },
    parcelsSent: [
      {
        type: Schema.Types.ObjectId,
        ref: "Parcel",
      },
    ],
    parcelsReceived: [
      {
        type: Schema.Types.ObjectId,
        ref: "Parcel",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);