import { mongoose } from "mongoose";

export const connectDB = async () => {
  const URI = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connection to MongoDB: ", error.message);
    process.exit(1);
  }
};
