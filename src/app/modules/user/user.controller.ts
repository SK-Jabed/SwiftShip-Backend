/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

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
      message: "All User Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);



export const UserControllers = {
  createUser,
  getAllUsers,
//   updateUser,
}; 