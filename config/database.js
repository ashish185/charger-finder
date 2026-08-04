/* eslint-disable no-undef */
// config/database.js: Connects the app to MongoDB using Mongoose.
import mongoose from "mongoose";

const connectToDatabase = async () => {
  const mongogUser = process.env.MONGO_USER;
  const mongoPassword = process.env.MONGO_PASSWORD;
  const mongoDb = process.env.MONGO_DB;
  const clusterName = process.env.MONGO_CLUSTER_NAME;
  if (!mongogUser) {
    throw new Error("MongoDB user is not defined in environment variables");
  }
  if (!mongoPassword) {
    throw new Error("MongoDB password is not defined in environment variables");
  }
  if (!mongoDb) {
    throw new Error(
      "MongoDB database name is not defined in environment variables",
    );
  }
  if (!clusterName) {
    throw new Error(
      "MongoDB cluster name is not defined in environment variables",
    );
  }
  const mongStr = `mongodb+srv://${mongogUser}:${mongoPassword}@${clusterName}/${mongoDb}?appName=${clusterName}`;
  await mongoose.connect(mongStr);
};

export default connectToDatabase;
