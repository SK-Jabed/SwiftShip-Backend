import cors from "cors";
import express, { Application, Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

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