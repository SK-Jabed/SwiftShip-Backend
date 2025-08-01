import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";

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


// const getAllUsers = async (role: string) => {
//   const query = role ? { role } : {};

//   const users = await User.find(query);

//   const total = await User.countDocuments();
//   return {
//     users,
//     total,
//   };
// };

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

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser
};
