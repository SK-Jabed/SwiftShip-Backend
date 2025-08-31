import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // const isPasswordMatched = await bcryptjs.compare(
  //   password as string,
  //   hashedPassword
  // );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.SENDER ||
      decodedToken.role == Role.RECEIVER ||
      decodedToken.role == Role.DELIVERY_PERSON
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "Unauthorize access");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role == Role.ADMIN) {
      throw new AppError(httpStatus.BAD_REQUEST, "Unauthorize access");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === Role.SENDER ||
      decodedToken.role == Role.RECEIVER ||
      decodedToken.role == Role.DELIVERY_PERSON
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "Unauthorize access");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find();
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const blockUser = async (userId: string, adminId: string) => {
  if (!userId || !adminId) {
    throw new AppError(400, "User ID, reason, and admin ID are required");
  }

  const admin = await User.findById(adminId);

  if (
    !admin ||
    (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)
  ) {
    throw new AppError(403, "Only admins can block users");
  }

  const userToBlock = await User.findById(userId);

  if (!userToBlock) {
    throw new AppError(404, "User not found");
  }

  if (
    (userToBlock.role === Role.ADMIN ||
      userToBlock.role === Role.SUPER_ADMIN) &&
    admin.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(403, "Cannot block admin users");
  }

  if (userId === adminId) {
    throw new AppError(400, "Cannot block yourself");
  }

  if (userToBlock.isActive === IsActive.BLOCKED) {
    throw new AppError(400, "User is already blocked");
  }

  const session = await User.startSession();
  session.startTransaction();

  try {
    const blockedUser = await User.findByIdAndUpdate(
      userId,
      {
        isActive: IsActive.BLOCKED,
      },
      { new: true, session }
    );


    await session.commitTransaction();

    return {
      blockedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const unblockUser = async (userId: string, adminId: string) => {
  if (!userId || !adminId) {
    throw new AppError(400, "User ID, reason, and admin ID are required");
  }

  // Verify admin permissions
  const admin = await User.findById(adminId);
  
  if (
    !admin ||
    (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN)
  ) {
    throw new AppError(403, "Only admins can block users");
  }

  // Get user to block
  const userToUnBlock = await User.findById(userId);
  if (!userToUnBlock) {
    throw new AppError(404, "User not found");
  }

  // Prevent blocking other admins (unless super admin)
  if (
    (userToUnBlock.role === Role.ADMIN ||
      userToUnBlock.role === Role.SUPER_ADMIN) &&
    admin.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(403, "Cannot unblock admin users");
  }

  // Prevent self-blocking
  if (userId === adminId) {
    throw new AppError(400, "Cannot unblock yourself");
  }

  // Check if already blocked
  if (userToUnBlock.isActive === IsActive.ACTIVE) {
    throw new AppError(400, "User is already active");
  }

  const session = await User.startSession();
  session.startTransaction();

  try {
    // Block the user
    const unblockedUser = await User.findByIdAndUpdate(
      userId,
      {
        isActive: IsActive.ACTIVE,
      },
      { new: true, session }
    );

    // Create block log entry (optional - for audit trail)
    // You might want to create a separate BlockLog model for this

    await session.commitTransaction();

    return {
      unblockedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  blockUser,
  unblockUser,
};