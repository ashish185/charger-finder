import mongoose from "mongoose";

const connectToDatabase = async () => {
    const mongogUser= process.env.MONGO_USER;
    const mongoPassword= process.env.MONGO_PASSWORD;
    const mongoDb= process.env.MONGO_DB;
    if(!mongogUser){
        throw new Error("MongoDB user is not defined in environment variables");
    }
    if(!mongoPassword){
        throw new Error("MongoDB password is not defined in environment variables");
    }
    if(!mongoDb){
        throw new Error("MongoDB database name is not defined in environment variables");
    }
    const mongStr= `mongodb+srv://${mongogUser}:${mongoPassword}@web-tinder-cluster.iaxdmii.mongodb.net/${mongoDb}?appName=web-tinder-cluster`;
    await mongoose.connect(mongStr);
};

export default connectToDatabase;
