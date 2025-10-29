"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const productModel_1 = require("../models/productModel");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getProducts = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const products = await productModel_1.Product.find();
    return res.status(200).json(new apiResponse_1.ApiResponse(200, products, "Products fetched successfully"));
});
//# sourceMappingURL=productController.js.map