import { User } from "../models/userModel";
import { connectDB } from "../db";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

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

    await connectDB(mongoUri);

    // Clear existing users
    await User.deleteMany({});

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      mockUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert mock users with hashed passwords
    const users = await User.insertMany(hashedUsers);

    console.log(`✅ Successfully seeded ${users.length} users`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
