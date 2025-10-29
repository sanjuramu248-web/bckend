"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const db_1 = require("../db");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const mockUsers = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
    },
    {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        password: "password123",
    },
    {
        name: "Alice Brown",
        email: "alice.brown@example.com",
        password: "password123",
    },
    {
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        password: "password123",
    },
];
const seedUsers = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI not found in environment variables");
        }
        await (0, db_1.connectDB)(mongoUri);
        // Clear existing users
        await userModel_1.User.deleteMany({});
        // Hash passwords before inserting
        const hashedUsers = await Promise.all(mockUsers.map(async (user) => ({
            ...user,
            password: await bcrypt_1.default.hash(user.password, 10),
        })));
        // Insert mock users with hashed passwords
        const users = await userModel_1.User.insertMany(hashedUsers);
        console.log(`✅ Successfully seeded ${users.length} users`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error seeding users:", error);
        process.exit(1);
    }
};
seedUsers();
//# sourceMappingURL=seed.js.map