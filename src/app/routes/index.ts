import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
//   {
//     path: "/parcel",
//     route: ParcelRoutes,
//   },
//   {
//     path: "/payment",
//     route: PaymentRoutes,
//   },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
