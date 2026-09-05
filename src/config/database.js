/* eslint-disable no-undef */
// config/database.js: Connects the app to MongoDB using Mongoose.
import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]); //use this if you are using hot

const connectToDatabase = async () => {
  const mongogUser = process.env.MONGO_USER;
  const mongoPassword = process.env.MONGO_PASSWORD;
  const mongoDb = process.env.MONGO_DB;
  const clusterName = process.env.MONGO_CLUSTER_NAME;
  const domainName = process.env.MONGO_DOMAIN_NAME;
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
  if (!domainName) {
    throw new Error(
      "MongoDB domain name is not defined in environment variables",
    );
  }
  const mongStr = `mongodb+srv://${mongogUser}:${mongoPassword}@${domainName}/${mongoDb}?appName=${clusterName}`;
  await mongoose.connect(mongStr);
};

export default connectToDatabase;
