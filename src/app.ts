import cors from "cors";
import express, { Application, Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";

const app: Application = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "✅ Parcel Delivery System Server is Running...",
    });
  } catch (error) {
    res.json({
      message: "❌ Something Went Wrong!",
      error: error,
    });
  }
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Route Handler
app.use(notFound);

export default app;
