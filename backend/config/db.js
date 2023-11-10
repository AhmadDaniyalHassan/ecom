import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log(`mongodb connected`);
  } catch (error) {
    console.log(`Mongodb console Error: ${error.message} `.bgRed);
    process.exit(1);
  }
};

export default connectDB;
