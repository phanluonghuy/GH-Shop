import express, { Application } from "express";
import mongoose from "mongoose";
import exampleRouter from "./routes/exampleRoute";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/GHShop";

app.use(express.json());
app.use("/api", exampleRouter);

mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => { 
    res.send("Hello World");
});