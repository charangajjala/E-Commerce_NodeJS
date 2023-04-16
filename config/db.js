import mongoose from "mongoose";
const DB_NAME = "E-Commerce";
const NAME = "charan_app";
const PASSWORD = "charan_app";
const CONNECTION_STRING = `mongodb+srv://${NAME}:${PASSWORD}@cluster0.ktgx7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
// console.log(CONNECTION_STRING);

/**
 * Connects to MongoDB using Mongoose.
 * @async
 * @function connectToMongoDB
 * @returns {Promise<void>} - A Promise that resolves when the connection to MongoDB is successful.
 * @throws {Error} - If an error occurs while connecting to MongoDB.
 */
export default async function connectToMongoDB() {
  await mongoose.connect(CONNECTION_STRING);
  console.log("Connected to MongoDB");
};
