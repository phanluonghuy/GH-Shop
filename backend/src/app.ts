import express, {Application} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import error from "./middleware/errorMiddleware";
import os from 'os';

// routers
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import brandRouter from "./routes/brandRoute";
import categoryRouter from "./routes/categoryRoute";
import storeRouter from "./routes/storeRoute";
import cartRouter from "./routes/cartRoute";
import favoriteRouter from "./routes/favoriteRoute";
import paymentRouter from "./routes/paymentRoute";
import purchaseRouter from "./routes/purchaseRoute";
import reviewRouter from "./routes/reviewRoute";
import couponRouter from "./routes/couponRoute";
import passport from "passport";
import './googleAuthConfig';
import dashboardRouter from "./routes/dashboardRouter";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/GHShop";
const SERVER_URL = process.env.SERVER_URL || "http://localhost";
const SESSION_SECRET = process.env.TOKEN_SECRET || "150131091ad22d4e4acecd1340fef3d6cef0477a3745520756e19c9f2021f37f18bb45aa135049ee36d4ad7439dc8cad72d928c95332c6b8da59c56521d85a56"


app.use(
    cors({
        origin: [process.env.ORIGIN_URL as string, "http://localhost"],
        methods: "GET, PATCH, POST, DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
app.use(express.json());
app.use(error);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/store", storeRouter);
app.use("/api/cart", cartRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/review", reviewRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/dashboard", dashboardRouter);


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

app.get("/api/test", (req, res) => {
    const serverId = os.hostname();
    const serverIp = req.ip;
    const networkInterfaces = os.networkInterfaces();
    res.status(200).json({
        acknowledgement: true,
        message: "Success",
        description: `Hello World from server ${serverId} with IP ${serverIp} \n and network interfaces ${JSON.stringify(networkInterfaces)}`,
    });
});
