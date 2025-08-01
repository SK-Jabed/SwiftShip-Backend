/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
        success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    // const token = req.headers.authorization

    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    // console.log(token, verifiedToken)
    const verifiedToken = req.user;
    const payload = req.body;
    const updatedUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
        success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  }
);

// export const getAllUsersController = catchAsync(async (req, res) => {
//   const { data, meta } = await getAllUsersService();
//   sendResponse(res, {
//     statusCode: sCode.OK,
//     message: "All users retrieved successfully",
//     data,
//     meta,
//   });
// });

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const role = req.query.role || "";
    // const users = await userServices.getAllUser(role as string);
  const result = await UserServices.getAllUsers();

    sendResponse(res, {
        success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);



export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
}; 