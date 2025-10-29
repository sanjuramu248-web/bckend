import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, qty = 1 } = req.body;
    const userId = req.user._id.toString();

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check stock
    if (product.stock! < qty) {
        throw new ApiError(400, "Insufficient stock");
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += qty;
    } else {
        // Add new item
        cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    // Populate cart with product details
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    return res.status(200).json(
        new ApiResponse(200, populatedCart, "Item added to cart successfully")
    );
});

export const removeFromCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => (item as any)._id.toString() !== id);
    
    await cart.save();

    // Populate cart with product details
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    return res.status(200).json(
        new ApiResponse(200, populatedCart, "Item removed from cart successfully")
    );
});

export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();

    const cart = await Cart.findOne({ userId }).populate('items.product');
    
    if (!cart) {
        return res.status(200).json(
            new ApiResponse(200, { items: [], total: 0 }, "Cart is empty")
        );
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
        const product = item.product as any;
        return sum + (product.price * item.quantity);
    }, 0);

    const cartWithTotal = {
        ...cart.toObject(),
        total: parseFloat(total.toFixed(2))
    };

    return res.status(200).json(
        new ApiResponse(200, cartWithTotal, "Cart fetched successfully")
    );
});

export const checkout = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user._id.toString();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new ApiError(400, "Cart items are required");
    }

    // Calculate total and validate items
    let total = 0;
    const processedItems = [];

    for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }

        if (product.stock! < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
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
        product.stock! -= item.quantity;
        await product.save();
    }

    // Clear user's cart after successful checkout
    await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
    );

    // Create mock receipt
    const receipt = {
        receiptId: `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        items: processedItems,
        total: parseFloat(total.toFixed(2)),
        timestamp: new Date().toISOString(),
        status: "completed"
    };

    return res.status(200).json(
        new ApiResponse(200, receipt, "Checkout completed successfully")
    );
});