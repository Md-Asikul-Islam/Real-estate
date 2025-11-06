import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (process.env.NODE_ENV === "development") {
      console.log(`mongoDB connected ${conn.connection.host}`);
    } else {
      console.log(`mongoDB connected successfully `);
    }
  } catch (error) {
    console.log(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;