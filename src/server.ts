import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URI);

    console.log("✅ Database Connected Successfully!");

    server = app.listen(envVars.PORT, () => {
      console.log(`✅ Server is running on port: ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();


// ----- Unhandled Rejection Error -----
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection detected, Shutting Down the server...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("I forgot to catch this promise..."));

// ----- Uncaught Exception Error -----
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected, Shutting Down the server...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// throw new Error("I forgot to handle this local error...");

// ----- Signal Terminate (SIGTERM) -----
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received, Shutting Down the server...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// ----- Signal Interrupt (SIGINT) -----
process.on("SIGINT", () => {
  console.log("SIGINT signal received, Shutting Down the server...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});