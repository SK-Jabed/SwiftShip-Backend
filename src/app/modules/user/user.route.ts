import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router()

router.post(
  "/register",
//   validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  //   validateRequest(createUserZodSchema),
  UserControllers.getAllUsers
);

export const UserRoutes = router;