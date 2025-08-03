import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequest";
import {
  blockParcelSchema,
  cancelParcelSchema,
  confirmDeliverySchema,
  parcelUpdateZodSchema,
  parcelZodSchema,
  updateStatusSchema,
} from "./parcel.validation";
// import { blockZodSchema } from "../user/user.validation";

const router = Router();

router.post(
  "/create-parcel",
  validateRequest(parcelZodSchema),
  checkAuth(Role.SENDER),
  ParcelController.createParcel
);

router.get(
  "/all-parcel",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.getAllParcel
);

router.get(
  "/status",
  checkAuth(...Object.values(Role)),
  ParcelController.getSingleParcelStatus
);

router.patch(
  "/cancel/:parcelId",
  validateRequest(cancelParcelSchema),
  checkAuth(Role.SENDER),
  ParcelController.cancelParcel
);

router.get(
  "/all-parcel/:id",
  checkAuth(...Object.values(Role)),
  ParcelController.getAllParcelById
);

router.patch(
  "/update/:parcelId",
  validateRequest(parcelUpdateZodSchema),
  checkAuth(Role.SENDER),
  ParcelController.updateParcel
);

router.get(
  "/my-parcels",
  checkAuth(Role.SENDER),
  ParcelController.getMyParcels
);

router.get(
  "/incoming-parcels",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncomingParcels
);

router.get(
  "/incoming-parcels",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncomingParcels
);

router.patch(
  "/confirm-delivery/:parcelId",
  checkAuth(Role.RECEIVER),
  validateRequest(confirmDeliverySchema),
  ParcelController.confirmParcelDelivery
);

router.get(
  "/delivery-history",
  checkAuth(Role.RECEIVER),
  ParcelController.getDeliveryHistory
);

router.patch(
  "/block/:parcelId",
  checkAuth(Role.ADMIN),
  validateRequest(blockParcelSchema),
  ParcelController.blockParcel
);

router.patch(
  "/unblock/:parcelId",
  checkAuth(Role.ADMIN),
  ParcelController.unblockParcel
);

router.patch(
  "/status/:parcelId",
  checkAuth(Role.ADMIN),
  validateRequest(updateStatusSchema),
  ParcelController.updateStatus
);

export const ParcelRoutes = router;