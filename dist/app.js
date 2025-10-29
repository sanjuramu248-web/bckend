"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const apiError_1 = require("./utils/apiError");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
const userRoutes_1 = __importDefault(require("../src/routes/userRoutes"));
const productRoutes_1 = __importDefault(require("../src/routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("../src/routes/cartRoutes"));
app.use("/v1/api/users", userRoutes_1.default);
app.use("/v1/api/products", productRoutes_1.default);
app.use("/v1/api/cart", cartRoutes_1.default);
// Global error handler
app.use((err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
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
//# sourceMappingURL=app.js.map