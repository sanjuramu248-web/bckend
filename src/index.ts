import { app } from "./app";
import dotenv from "dotenv";
import { connectDB } from "./db";

dotenv.config()

const mongoUri = process.env.MONGO_URI

connectDB(mongoUri!)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is runnning on port: ${process.env.PORT}`)
        })
    })
    .catch((err: any) => {
        console.log("failed to connect with server", err)
    })
