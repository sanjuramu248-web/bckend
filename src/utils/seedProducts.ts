import { Product } from "../models/productModel";
import { connectDB } from "../db";
import dotenv from "dotenv";

dotenv.config();

const mockProducts = [
    { name: "Wireless Headphones", price: 99.99, image: "https://www.leafstudios.in/cdn/shop/files/1_a43c5e0b-3a47-497d-acec-b4764259b10e_800x.png?v=1750486829", description: "High-quality wireless headphones with noise cancellation.", stock: 10 },
    { name: "Bluetooth Speaker", price: 59.99, image: "https://m.media-amazon.com/images/I/718B62xadcL._SX522_.jpg", description: "Portable Bluetooth speaker with excellent sound quality.", stock: 10 },
    { name: "Smartwatch", price: 149.99, image: "https://m.media-amazon.com/images/I/61Iw0g8zYYL._AC_UF350,350_QL80_FMwebp_.jpg", description: "Feature-rich smartwatch with fitness tracking.", stock: 10 },
    { name: "Laptop Stand", price: 39.99, image: "https://m.media-amazon.com/images/I/51mN-RUnn5L._SX569_.jpg", description: "Adjustable laptop stand for better ergonomics.", stock: 10 },
    { name: "USB-C Hub", price: 29.99, image: "https://honeywellconnection.com/cdn/shop/files/01_ff2085bf-e79a-4936-9fa9-50ce05789c1a.jpg?v=1755710400&width=600", description: "Multi-port USB-C hub for connectivity.", stock: 10 },
    { name: "Wireless Mouse", price: 24.99, image: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX522_.jpg", description: "Ergonomic wireless mouse with long battery life.", stock: 15 },
    { name: "Mechanical Keyboard", price: 89.99, image: "https://m.media-amazon.com/images/I/81QKqOHGpgL._AC_SX522_.jpg", description: "RGB mechanical keyboard with tactile switches.", stock: 8 },
    { name: "Phone Case", price: 19.99, image: "https://m.media-amazon.com/images/I/71ZQoJhKzgL._AC_SX522_.jpg", description: "Protective phone case with drop protection.", stock: 25 },
    { name: "Power Bank", price: 34.99, image: "https://m.media-amazon.com/images/I/61Ks8IXPL-L._AC_SX522_.jpg", description: "10000mAh portable power bank with fast charging.", stock: 12 },
    { name: "Webcam", price: 79.99, image: "https://m.media-amazon.com/images/I/61U2Zq8XJOL._AC_SX522_.jpg", description: "1080p HD webcam with auto-focus and noise reduction.", stock: 6 }
];

const seedProducts = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        await connectDB(mongoUri);

        // Clear existing products
        await Product.deleteMany({});

        // Insert mock products
        const products = await Product.insertMany(mockProducts);

        console.log(`✅ Successfully seeded ${products.length} products`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts();