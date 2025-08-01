/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";


const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    // setAuthCookie(res, loginInfo);

    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);

// const getNewAuthToken = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     //  console.log("req.body", req.body)
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       throw new AppError(httpStatus.BAD_REQUEST, " No refresh token found....");
//     }
//     const tokenInfo = await AuthServices.getNewAuthToken(
//       refreshToken as string
//     );

//     // res.cookie("accessToken", result.accessToken,{
//     //     httpOnly: true,
//     //     secure: false
//     // })

//     setAuthCookie(res, tokenInfo);

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "New Access Token Retrieved Successsfully",
//       data: tokenInfo,
//     });
//   }
// );

// const logout = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     res.clearCookie("accessToken", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "User Logged Out Successsfully",
//       data: null,
//     });
//   }
// );

// const resetPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const decodedToken = req.user as JwtPayload;

//     const newPassword = req.body.newPassword;
//     const oldPassword = req.body.oldPassword;
//     await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Password changed  Successsfully",
//       data: null,
//     });
//   }
// );

export const AuthControllers = {
  credentialsLogin,
//   getNewAuthToken,
//   logout,
//   resetPassword,
};