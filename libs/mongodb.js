import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Mongodb.");
  } catch (err) {
    console.log(err);
  }
};

export default connectMongoDB;