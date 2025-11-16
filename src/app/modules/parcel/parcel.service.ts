/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { parcelSearchTable } from "./parcel.constant";
import httpStatus from "http-status-codes";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import mongoose from "mongoose";

const createParcel = async (payload: IParcel, senderId: string) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);

    if (!sender) {
      throw new AppError(httpStatus.NOT_FOUND, "Sender not found");
    }

    if (sender.isActive === IsActive.BLOCKED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Blocked users cannot create parcels"
      );
    }

    const trackingId = generateTrackingId();

    const initialStatusLog = {
      status: "REQUESTED",
      updatedAt: new Date(),
      updatedBy: senderId,
      note: "Parcel created by sender",
    };

    const [parcel] = await Parcel.create(
      [
        {
          ...payload,
          trackingId,
          senderId,
          status: "REQUESTED",
          statusLogs: [initialStatusLog],
          isBlocked: false,
          isCancelled: false,
          isDelivered: false,
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      senderId,
      { $push: { parcelsSent: parcel._id } },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    const createdParcel = await Parcel.findById(parcel._id)
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone");

    return createdParcel;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllParcel = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find({}), query);

  const allParcel = await queryBuilder
    .search(parcelSearchTable)
    .filter()
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    allParcel.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleParcelStatus = async (trackingId: string) => {
  if (!trackingId) {
    throw new AppError(400, "Invalid tracking ID provided");
  }

  const selectedParcelStatus = await Parcel.findOne({ trackingId: trackingId });

  if (!selectedParcelStatus) {
    throw new AppError(404, "Parcel not found with the provided tracking ID");
  }

  return selectedParcelStatus.statusLogs;
};

const updateParcel = async (parcelId: string, payload: Partial<IParcel>) => {
  if (!parcelId) {
    throw new AppError(400, "Parcel ID is required");
  }

  const existingParcel = await Parcel.findById(parcelId);
  if (!existingParcel) {
    throw new AppError(404, "Parcel not found");
  }

  if (existingParcel.status == ParcelStatus.BLOCKED) {
    throw new AppError(404, "Blocked Parcel can not be Edited");
  }

  // Add audit information
  const updateData = {
    ...payload,
    updatedAt: new Date(),
  };

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    updateData,
    { new: true, runValidators: true }
  ).populate("senderId", "email phone name");

  return updatedParcel;
};

const cancelParcel = async (
  parcelId: string,
  userId: string,
  cancellationReason: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);

    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.senderId.toString() !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only cancel your own parcels"
      );
    }

    if (parcel.status !== "REQUESTED" && parcel.status !== "APPROVED") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Parcel can only be cancelled before dispatch"
      );
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        status: "CANCELLED",
        isCancelled: true,
        cancellationReason,
        cancelledBy: userId,
        $push: {
          statusLogs: {
            status: "CANCELLED",
            updatedAt: new Date(),
            updatedBy: userId,
            note: `Cancelled by sender: ${cancellationReason}`,
          },
        },
      },
      { new: true, session }
    ).populate("senderId receiverId", "name email phone");

    if (!updatedParcel) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to cancel parcel"
      );
    }

    await session.commitTransaction();
    return updatedParcel;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllParcelById = async (id: string, user: any) => {
  if (id !== user.userId) {
    throw new AppError(
      403,
      "Access denied: You can only view your own parcels"
    );
  }

  let query: any = {};

  if (user.role == Role.DELIVERY_PERSON) {
    query = { assignedDeliveryPartner: id };
  }
  if (user.role == Role.SENDER) {
    query = { senderId: id };
  }
  if (user.isActive == IsActive.BLOCKED) {
    throw new AppError(403, "Access denied: You can cant view parcels");
  }

  // const parcel = await Parcel.findById(parcelId)

  const updatedData = await Parcel.find(query);

  return updatedData;
};

const getIncomingParcels = async (receiverPhone: string) => {
  if (!receiverPhone) {
    throw new AppError(400, "Receiver phone number is required");
  }

  const incomingParcels = await Parcel.find({
    "receiverInfo.phone": receiverPhone,
  });

  return {
    parcels: incomingParcels,
    total: incomingParcels.length,
    receiverInfo: {
      phone: receiverPhone,
      name: incomingParcels[0]?.receiverInfo?.name || "Unknown",
    },
  };
};

const getSenderParcels = async (
  userId: string,
  filters: {
    status?: ParcelStatus;
    startDate?: Date;
    endDate?: Date;
  } = {}
) => {
  const query: any = { senderId: userId, isDeleted: { $ne: true } };

  if (filters.status) query.status = filters.status;

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = filters.startDate;
    if (filters.endDate) query.createdAt.$lte = filters.endDate;
  }

  return await Parcel.find(query)
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updatedBy", "name role")
    .sort({ createdAt: -1 });
};

const getReceiverParcels = async (
  receiverId: string,
  filters: {
    status?: ParcelStatus;
    fromDate?: Date;
    toDate?: Date;
  } = {}
) => {
  const query: any = {
    receiverId,
    isDeleted: { $ne: true },
    isBlocked: { $ne: true },
  };

  if (filters.status) query.status = filters.status;
  if (filters.fromDate || filters.toDate) {
    query.createdAt = {};
    if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
    if (filters.toDate) query.createdAt.$lte = filters.toDate;
  }

  return await Parcel.find(query)
    .populate("senderId", "name email phone")
    .populate("statusLogs.updatedBy", "name role")
    .sort({ createdAt: -1 });
};

const confirmDelivery = async (
  parcelId: string,
  receiverId: string,
  deliveryProof?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);
    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (!parcel.receiverId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Parcel has no assigned receiver"
      );
    }

    if (parcel.receiverId.toString() !== receiverId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only confirm delivery of your own parcels"
      );
    }

    if (parcel.receiverId.toString() !== receiverId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only confirm delivery of your own parcels"
      );
    }

    if (parcel.status !== "IN_TRANSIT") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Delivery can only be confirmed for parcels in transit"
      );
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        status: "DELIVERED",
        isDelivered: true,
        actualDeliveryDate: new Date(),
        deliveryProof,
        $push: {
          statusLogs: {
            status: "DELIVERED",
            updatedAt: new Date(),
            updatedBy: receiverId,
            note: "Delivery confirmed by receiver",
          },
        },
      },
      { new: true, session }
    )
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone");

    await User.findByIdAndUpdate(
      parcel.senderId,
      { $push: { parcelsDelivered: parcelId } },
      { session }
    );

    await session.commitTransaction();
    return updatedParcel;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getDeliveryHistory = async (
  receiverId: string,
  filters: {
    year?: number;
    month?: number;
    status?: ParcelStatus;
  } = {}
) => {
  const query: any = {
    receiverId,
    status: "DELIVERED",
    isDeleted: { $ne: true },
  };

  if (filters.year || filters.month) {
    query.actualDeliveryDate = {};

    if (filters.year) {
      query.actualDeliveryDate.$gte = new Date(filters.year, 0, 1);
      query.actualDeliveryDate.$lte = new Date(filters.year + 1, 0, 1);
    }
    if (filters.month) {
      query.actualDeliveryDate.$gte = new Date(
        filters.year || new Date().getFullYear(),
        filters.month - 1,
        1
      );
      query.actualDeliveryDate.$lte = new Date(
        filters.year || new Date().getFullYear(),
        filters.month,
        1
      );
    }
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return await Parcel.find(query)
    .populate("senderId", "name email phone")
    .populate({
      path: "statusLogs.updatedBy",
      select: "name role",
      model: "User",
    })
    .sort({ actualDeliveryDate: -1 })
    .lean();
};

const blockParcel = async (
  parcelId: string,
  adminId: string,
  blockReason: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);
    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.isBlocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Parcel is already blocked");
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        isBlocked: true,
        blockReason,
        blockedBy: adminId,
        $push: {
          statusLogs: {
            status: "BLOCKED",
            updatedAt: new Date(),
            updatedBy: adminId,
            note: `Blocked by admin: ${blockReason}`,
          },
        },
      },
      { new: true, session }
    ).populate("senderId receiverId", "name email");

    await session.commitTransaction();
    return updatedParcel;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const unblockParcel = async (parcelId: string, adminId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);
    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (!parcel.isBlocked) {
      throw new AppError(httpStatus.BAD_REQUEST, "Parcel is not blocked");
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        isBlocked: false,
        blockReason: null,
        blockedBy: null,
        $push: {
          statusLogs: {
            status: "UNBLOCKED",
            updatedAt: new Date(),
            updatedBy: adminId,
            note: "Unblocked by admin",
          },
        },
      },
      { new: true, session }
    ).populate("senderId receiverId", "name email");

    await session.commitTransaction();
    return updatedParcel;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateDeliveryStatus = async (
  parcelId: string,
  adminId: string,
  newStatus: ParcelStatus,
  note?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);
    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    // Validate status transition
    // const validTransitions: Record<ParcelStatus, ParcelStatus[]> = {
    //   REQUESTED: [],
    //   APPROVED: [],
    //   PICKED_UP: [],
    //   IN_TRANSIT: [],
    //   DELIVERED: [],
    //   RETURNED: [],
    //   CANCELLED: [],
    // };

    // if (!validTransitions[parcel.status].includes(newStatus)) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     `Invalid status transition from ${parcel.status} to ${newStatus}`
    //   );
    // }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        status: newStatus,
        $push: {
          statusLogs: {
            status: newStatus,
            updatedAt: new Date(),
            updatedBy: adminId,
            note: note || `Status updated by admin to ${newStatus}`,
          },
        },
      },
      { new: true, session }
    ).populate("senderId receiverId", "name email phone");
    await session.commitTransaction();
    return updatedParcel;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// const assignDeliveryPersonnel = async (
//   parcelId: string,
//   adminId: string,
//   personnelId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Validate personnel exists and has delivery role
//     const personnel = await User.findById(personnelId).session(session);
//     if (!personnel || personnel.role !== "DELIVERY_PERSON") {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery personnel");
//     }

//     const parcel = await Parcel.findByIdAndUpdate(
//       parcelId,
//       {
//         assignedDeliveryPersonnel: personnelId,
//         $push: {
//           statusLogs: {
//             status: "ASSIGNED",
//             updatedAt: new Date(),
//             updatedBy: adminId,
//             note: `Assigned to delivery personnel ${personnel.name}`,
//           },
//         },
//       },
//       { new: true, session }
//     )
//       .populate("senderId receiverId", "name email phone")
//       .populate("assignedDeliveryPersonnel", "name phone vehicle");

//     await session.commitTransaction();

//     return parcel;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// const assignDeliveryPersonnel = async (
//   parcelId: string,
//   adminId: string,
//   personnelId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Validate personnel exists and has delivery role
//     const personnel = await User.findById(personnelId).session(session);
//     if (!personnel || personnel.role !== "DELIVERY_PERSON") {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery personnel");
//     }

//     const parcel = await Parcel.findByIdAndUpdate(
//       parcelId,
//       {
//         assignedDeliveryPersonnel: personnelId,
//         $push: {
//           statusLogs: {
//             status: "ASSIGNED",
//             updatedAt: new Date(),
//             updatedBy: adminId,
//             note: `Assigned to delivery personnel ${personnel.name}`,
//           },
//         },
//       },
//       { new: true, session }
//     )
//       .populate("senderId receiverId", "name email phone")
//       .populate("assignedDeliveryPersonnel", "name phone vehicle");

//     await session.commitTransaction();

//     return parcel;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };
// const assignDeliveryPersonnel = async (
//   parcelId: string,
//   adminId: string,
//   personnelId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Validate personnel exists and has delivery role
//     const personnel = await User.findById(personnelId).session(session);
//     if (!personnel || personnel.role !== "DELIVERY_PERSON") {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery personnel");
//     }

//     const parcel = await Parcel.findByIdAndUpdate(
//       parcelId,
//       {
//         assignedDeliveryPersonnel: personnelId,
//         $push: {
//           statusLogs: {
//             status: "ASSIGNED",
//             updatedAt: new Date(),
//             updatedBy: adminId,
//             note: `Assigned to delivery personnel ${personnel.name}`,
//           },
//         },
//       },
//       { new: true, session }
//     )
//       .populate("senderId receiverId", "name email phone")
//       .populate("assignedDeliveryPersonnel", "name phone vehicle");

//     await session.commitTransaction();

//     return parcel;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };




// const assignDeliveryPersonnel = async (
//   parcelId: string,
//   adminId: string,
//   personnelId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Validate personnel exists and has delivery role
//     const personnel = await User.findById(personnelId).session(session);
//     if (!personnel || personnel.role !== "DELIVERY_PERSON") {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery personnel");
//     }

//     const parcel = await Parcel.findByIdAndUpdate(
//       parcelId,
//       {
//         assignedDeliveryPersonnel: personnelId,
//         $push: {
//           statusLogs: {
//             status: "ASSIGNED",
//             updatedAt: new Date(),
//             updatedBy: adminId,
//             note: `Assigned to delivery personnel ${personnel.name}`,
//           },
//         },
//       },
//       { new: true, session }
//     )
//       .populate("senderId receiverId", "name email phone")
//       .populate("assignedDeliveryPersonnel", "name phone vehicle");

//     await session.commitTransaction();

//     return parcel;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// const assignDeliveryPersonnel = async (
//   parcelId: string,
//   adminId: string,
//   personnelId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Validate personnel exists and has delivery role
//     const personnel = await User.findById(personnelId).session(session);
//     if (!personnel || personnel.role !== "DELIVERY_PERSON") {
//       throw new AppError(httpStatus.BAD_REQUEST, "Invalid delivery personnel");
//     }

//     const parcel = await Parcel.findByIdAndUpdate(
//       parcelId,
//       {
//         assignedDeliveryPersonnel: personnelId,
//         $push: {
//           statusLogs: {
//             status: "ASSIGNED",
//             updatedAt: new Date(),
//             updatedBy: adminId,
//             note: `Assigned to delivery personnel ${personnel.name}`,
//           },
//         },
//       },
//       { new: true, session }
//     )
//       .populate("senderId receiverId", "name email phone")
//       .populate("assignedDeliveryPersonnel", "name phone vehicle");

//     await session.commitTransaction();

//     return parcel;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

export const ParcelServices = {
  createParcel,
  getAllParcel,
  getSingleParcelStatus,
  updateParcel,
  cancelParcel,
  getSenderParcels,
  getReceiverParcels,
  getAllParcelById,
  getDeliveryHistory,
  blockParcel,
  unblockParcel,
  getIncomingParcels,
  confirmDelivery,
  updateDeliveryStatus,
};