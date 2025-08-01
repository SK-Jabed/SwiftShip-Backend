import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
// router.post("/refresh-token", AuthController.getNewAuthToken);
// router.post("/logout", AuthController.logout);
// router.post(
//   "/reset-password",
//   checkAuth(...Object.values(Role)),
//   AuthController.resetPassword
// );

export const AuthRoutes = router;
