import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "./.env" });
export const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.DATABASE ?? "Error");
    return console.log("Connected To The Database Successfully");
  } catch (error) {
    console.log(error);
  }
};
