import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, IUserAddress, UserRole } from "./user.interface";

const UserAddressSchema = new Schema<IUserAddress>(
  {
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    roadNo: { type: String, trim: true },
    houseNo: { type: String, trim: true }
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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: UserAddressSchema,
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SENDER,
      required: true,
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

    // parcelsSent: [{ type: Schema.Types.ObjectId, ref: "Parcel" }],
    // parcelsReceived: [{ type: Schema.Types.ObjectId, ref: "Parcel" }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
