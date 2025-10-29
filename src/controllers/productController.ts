import { Product } from "../models/productModel";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find();

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});
