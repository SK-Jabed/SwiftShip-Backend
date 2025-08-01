import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken"
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found , please register first"
    );
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password not matched, please check your password"
    );
  }

       const jwtPayload = {
         userId: isUserExist._id,
         email: isUserExist.email,
         role: isUserExist.role,
       };
       const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//   const userToken = createUserToken(isUserExist);
//   const { password: pass, ...rest } = isUserExist.toObject();

  return {
    // accessToken: userToken.accessToken,
    accessToken
    // refreshToken: userToken.refreshToken,
    // user: rest,
    // email: isUserExist.email
  };
};

// const getNewAuthToken = async (refreshToken: string) => {
//   const newAccessToken = await createNewAccessTokenAndRefreshToken(
//     refreshToken
//   );

//   return {
//     accessToken: newAccessToken,
//   };
// };

// const resetPassword = async (
//   oldPassword: string,
//   newPassword: string,
//   decodedToken: JwtPayload
// ) => {
//   const user = await User.findById(decodedToken.userId);

//   const isOldPasswordMatched = await bcryptjs.compare(
//     oldPassword,
//     user!.password as string
//   );
//   if (!isOldPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Old password doesn't matched");
//   }

//   user!.password = await bcryptjs.hash(
//     newPassword,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );

//   user!.save();
// };

export const AuthServices = {
  credentialsLogin,
//   getNewAuthToken,
//   resetPassword,
};
