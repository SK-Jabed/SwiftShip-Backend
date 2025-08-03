import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../utils/validateRequest";
import {
  blockZodSchema,
  createUserZodSchema,
  updateUserZodSchema,
} from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
router.patch(
  "/block/:id",
  validateRequest(blockZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.blockUser
);
router.patch(
  "/unblock/:id",
  validateRequest(blockZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.unblockUser
);

export const UserRoutes = router;
