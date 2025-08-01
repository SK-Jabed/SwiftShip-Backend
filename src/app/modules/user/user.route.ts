import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../utils/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()

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
// router.patch(
//   "/:id/block",
//   validateRequest(blockZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   userController.blockUser
// );
// router.patch(
//   "/:id/unblock",
//   validateRequest(blockZodSchema),
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   userController.unblockUser
// );

export const UserRoutes = router;