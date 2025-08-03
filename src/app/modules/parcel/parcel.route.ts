import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequest";
import {
//   assignDeliverySchema,
//   parcelUpdateZodSchema,
  parcelZodSchema,
//   returnParcelZodSchema,
//   trackingEventZodSchema,
} from "./parcel.validation";
// import { blockZodSchema } from "../user/user.validation";

const router = Router();

router.post(
  "/create-parcel",
  validateRequest(parcelZodSchema),
  checkAuth(Role.SENDER),
  ParcelController.createParcel
);
// router.get(
//   "/all-parcel",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   ParcelController.getAllParcel
// );
// router.get(
//   "/status",
//   checkAuth(...Object.values(Role)),
//   ParcelController.getSingleParcelStatus
// );
// router.patch(
//   "/assign-delivery",
//   validateRequest(assignDeliverySchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   ParcelController.assignParcelToDeliveryPerson
// );
// router.get(
//   "/all-parcel/:id",
//   checkAuth(...Object.values(Role)),
//   ParcelController.getAllParcelById
// );
// router.post(
//   "/update/:parcelId",
//   validateRequest(parcelUpdateZodSchema),
//   checkAuth(Role.SENDER),
//   ParcelController.updateParcel
// );
// router.patch(
//   "/:id/update-status",
//   validateRequest(trackingEventZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_PERSON, Role.SENDER),
//   ParcelController.updateParcelStatus
// );
// router.get(
//   "/receiver-incoming-parcel",
//   checkAuth(Role.RECEIVER),
//   ParcelController.getIncomingParcels
// );
// router.patch(
//   "/confirm-delivery",
//   checkAuth(Role.RECEIVER),
//   ParcelController.confirmDelivery
// );
// // router.patch(
// //   "/collect-cod",
// //   checkAuth(Role.DELIVERY_PERSON),
// //   ParcelController.collectCODPayment
// // );
// router.patch(
//   "/:id/block-parcel",
//   validateRequest(blockZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   ParcelController.blockParcel
// );
// router.patch(
//   "/:id/unblock-parcel",
//   validateRequest(blockZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   ParcelController.unblockParcel
// );
// router.post(
//   "/:id/return-parcel",
//   validateRequest(returnParcelZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER),
//   ParcelController.returnParcel
// );
// router.get(
//   "/track-public-status",
//   ParcelController.trackParcelByTrackingIdPublic
// );

export const ParcelRoutes = router;