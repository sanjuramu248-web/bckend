import mongoose from "mongoose";

export const connectDB = async(mongoUri: string) => {
    try {
        const connectionInstances = await mongoose.connect(mongoUri, {
            dbName: "nexora"
        })

        console.log(`db is running on host ${connectionInstances.connection.host}`)
    } catch (error: any) {
        console.log("failed to connect with db", error)
        process.exit(1)
    }
}