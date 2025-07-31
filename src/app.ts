import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

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

export default app;