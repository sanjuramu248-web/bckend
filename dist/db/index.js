"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (mongoUri) => {
    try {
        const connectionInstances = await mongoose_1.default.connect(mongoUri, {
            dbName: "nexora"
        });
        console.log(`db is running on host ${connectionInstances.connection.host}`);
    }
    catch (error) {
        console.log("failed to connect with db", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=index.js.map