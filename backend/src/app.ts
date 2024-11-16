import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import error from "./middleware/errorMiddleware";

// routers
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import brandRouter from "./routes/brandRoute";
import categoryRouter from "./routes/categoryRoute";
import storeRouter from "./routes/storeRoute";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/GHShop";
const SERVER_URL = process.env.SERVER_URL || "http://localhost";


app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    methods: "GET, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use(error);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/store", storeRouter);


mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend running on ${SERVER_URL}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => { 
    res.send("Hello World");
});
