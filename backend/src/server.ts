import express from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";


// import { examinerRouter } from "./routes/examiner.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

// environment set up
const ENVIRONMENT = process.env.ENVIRONMENT ?? "local";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// mongo connection
export const mongoClient = new MongoClient(MONGO_URI);

async function connectMongo() {
    await mongoClient.connect();
    console.log("MongoDB connected");
}

// create the app
const app = express();

app.use(express.json());

// routers
// app.use("/examiner", examinerRouter);


//start up
async function start() {
    await connectMongo();

    app.listen(PORT, () => {
        console.log(
            `Server running on port ${PORT} (${ENVIRONMENT})`
        );
    });
}

start().catch((err) => {
    console.error("Startup failure:", err);
    process.exit(1);
});
