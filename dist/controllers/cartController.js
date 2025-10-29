"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const cartModel_1 = require("../models/cartModel");
const productModel_1 = require("../models/productModel");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId, qty = 1 } = req.body;
    const userId = req.user._id.toString();
    if (!productId) {
        throw new apiError_1.ApiError(400, "Product ID is required");
    }
    // Check if product exists
    const product = await productModel_1.Product.findById(productId);
    if (!product) {
        throw new apiError_1.ApiError(404, "Product not found");
    }
    // Check stock
    if (product.stock < qty) {
        throw new apiError_1.ApiError(400, "Insufficient stock");
    }
    // Find or create cart for user
    let cart = await cartModel_1.Cart.findOne({ userId });
    if (!cart) {
        cart = new cartModel_1.Cart({ userId, items: [] });
    }
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += qty;
    }
    else {
        // Add new item
        cart.items.push({ product: productId, quantity: qty });
    }
    await cart.save();
    // Populate cart with product details
    const populatedCart = await cartModel_1.Cart.findById(cart._id).populate('items.product');
    return res.status(200).json(new apiResponse_1.ApiResponse(200, populatedCart, "Item added to cart successfully"));
});
exports.removeFromCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const cart = await cartModel_1.Cart.findOne({ userId });
    if (!cart) {
        throw new apiError_1.ApiError(404, "Cart not found");
    }
    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== id);
    await cart.save();
    // Populate cart with product details
    const populatedCart = await cartModel_1.Cart.findById(cart._id).populate('items.product');
    return res.status(200).json(new apiResponse_1.ApiResponse(200, populatedCart, "Item removed from cart successfully"));
});
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id.toString();
    const cart = await cartModel_1.Cart.findOne({ userId }).populate('items.product');
    if (!cart) {
        return res.status(200).json(new apiResponse_1.ApiResponse(200, { items: [], total: 0 }, "Cart is empty"));
    }
    // Calculate total
    const total = cart.items.reduce((sum, item) => {
        const product = item.product;
        return sum + (product.price * item.quantity);
    }, 0);
    const cartWithTotal = {
        ...cart.toObject(),
        total: parseFloat(total.toFixed(2))
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, cartWithTotal, "Cart fetched successfully"));
});
exports.checkout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user._id.toString();
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new apiError_1.ApiError(400, "Cart items are required");
    }
    // Calculate total and validate items
    let total = 0;
    const processedItems = [];
    for (const item of cartItems) {
        const product = await productModel_1.Product.findById(item.productId);
        if (!product) {
            throw new apiError_1.ApiError(404, `Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
            throw new apiError_1.ApiError(400, `Insufficient stock for ${product.name}`);
        }
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        processedItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            itemTotal: parseFloat(itemTotal.toFixed(2))
        });
        // Update stock
        product.stock -= item.quantity;
        await product.save();
    }
    // Clear user's cart after successful checkout
    await cartModel_1.Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    // Create mock receipt
    const receipt = {
        receiptId: `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        items: processedItems,
        total: parseFloat(total.toFixed(2)),
        timestamp: new Date().toISOString(),
        status: "completed"
    };
    return res.status(200).json(new apiResponse_1.ApiResponse(200, receipt, "Checkout completed successfully"));
});
//# sourceMappingURL=cartController.js.map