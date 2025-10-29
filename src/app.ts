import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiError } from "./utils/apiError";

const app = express();

app.use(cors(
    {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
        exposedHeaders: ["Set-Cookie"],
        optionsSuccessStatus: 200
    }
))

app.use(cookieParser())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))

import userRoutes from "../src/routes/userRoutes"
import productRoutes from "../src/routes/productRoutes"
import cartRoutes from "../src/routes/cartRoutes"

app.use("/v1/api/users", userRoutes)
app.use("/v1/api/products", productRoutes)
app.use("/v1/api/cart", cartRoutes)

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    // Handle other errors
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

export { app };