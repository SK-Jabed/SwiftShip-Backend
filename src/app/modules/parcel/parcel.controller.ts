/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ParcelServices } from "./parcel.service";
import { validateRequest } from "../../utils/validateRequest";
import { parcelZodSchema } from "./parcel.validation";
import AppError from "../../errorHelpers/AppError";
import { ParcelStatus } from "./parcel.interface";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  validateRequest(parcelZodSchema)(req, res, async () => {
    const payload = req.body;
    const senderId = (req.user as { userId: string })?.userId;

    if (!senderId) {
      throw new Error("Sender ID not found in request");
    }

    const parcel = await ParcelServices.createParcel(payload, senderId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel created successfully",
      data: parcel,
    });
  });
});

const getAllParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const allParcel = await ParcelServices.getAllParcel(
      query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcels retrieved successfully",
      data: allParcel,
    });
  }
);

const getSingleParcelStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trackingId = req.query.trackingId;

    const singleParcelTrackingEvent =
      await ParcelServices.getSingleParcelStatus(trackingId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel retrieved successfully",
      data: singleParcelTrackingEvent,
    });
  }
);

const updateParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.parcelId;
    const updateData = req.body;

    const updatedParcel = await ParcelServices.updateParcel(
      parcelId as string,
      updateData
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel updated successfully",
      data: updatedParcel,
    });
  }
);

const cancelParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId } = req.params;
    const { cancellationReason } = req.body;
    const userId = (req.user as { userId: string })?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const cancelledParcel = await ParcelServices.cancelParcel(
      parcelId,
      userId,
      cancellationReason
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel cancelled successfully",
      data: cancelledParcel,
    });
  }
);

const getMyParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as { userId: string })?.userId;
    const { status, startDate, endDate } = req.query;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const parcels = await ParcelServices.getSenderParcels(userId, {
      status: status as ParcelStatus | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcels retrieved successfully",
      data: parcels,
    });
  }
);

const getAllParcelById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = req.user;

    const updatedParcel = await ParcelServices.getAllParcelById(id, user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel retrieved  successfully",
      data: updatedParcel,
    });
  }
);

const getIncomingParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const receiverId = (req.user as { userId: string })?.userId;
    const { status, fromDate, toDate } = req.query;

    if (!receiverId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const parcels = await ParcelServices.getReceiverParcels(receiverId, {
      status: status as ParcelStatus | undefined,
      fromDate: fromDate ? new Date(fromDate as string) : undefined,
      toDate: toDate ? new Date(toDate as string) : undefined,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Incoming parcels retrieved successfully",
      data: parcels,
    });
  }
);

const confirmParcelDelivery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId } = req.params;
    const receiverId = (req.user as { userId: string })?.userId;

    if (!receiverId) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You must be logged in to confirm delivery"
      );
    }

    const { deliveryProof } = req.body;

    const confirmedParcel = await ParcelServices.confirmDelivery(
      parcelId,
      receiverId,
      deliveryProof
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delivery confirmed successfully",
      data: confirmedParcel,
    });
  }
);
                             
const getDeliveryHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const receiverId = (req.user as { userId: string })?.userId;
    const { year, month, status } = req.query;

    if (!receiverId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const history = await ParcelServices.getDeliveryHistory(receiverId, {
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      status: status as ParcelStatus | undefined,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delivery history retrieved successfully",
      data: history,
    });
  }
);

const blockParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId } = req.params;
    const adminId = (req.user as { userId: string })?.userId;
    const { blockReason } = req.body;

    if (!adminId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const result = await ParcelServices.blockParcel(
      parcelId,
      adminId,
      blockReason
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel blocked successfully",
      data: result,
    });
  }
);

const unblockParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId } = req.params;
    const adminId = (req.user as { userId: string })?.userId;

    if (!adminId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const result = await ParcelServices.unblockParcel(parcelId, adminId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel unblocked successfully",
      data: result,
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId } = req.params;
    const adminId = (req.user as { userId: string })?.userId;
    const { status, note } = req.body;

    if (!adminId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const result = await ParcelServices.updateDeliveryStatus(
      parcelId,
      adminId,
      status,
      note
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel status updated successfully",
      data: result,
    });
  }
);

// const assignPersonnel = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { parcelId } = req.params;
//     const adminId = req.user?.userId;
//     const { personnelId } = req.body;

//     if (!adminId) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
//     }

//     const result = await ParcelServices.assignDeliveryPersonnel(
//       parcelId,
//       adminId,
//       personnelId
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Delivery personnel assigned successfully",
//       data: result,
//     });
//   }
// );

export const ParcelController = {
  createParcel,
  getAllParcel,
  getSingleParcelStatus,
  updateParcel,
  cancelParcel,
  getMyParcels,
  confirmParcelDelivery,
  getDeliveryHistory,
  blockParcel,
  unblockParcel,
  getAllParcelById,
  getIncomingParcels,
  updateStatus,
};