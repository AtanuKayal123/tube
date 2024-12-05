import mongoose from "mongoose";
import { DB_NAME } from "D:\VVC++\Mern back\vidtube\tube\src\constants.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`) 
    
       console.log(`MongoDB connected!: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("MongoDB error",error);
        process.exit(1);
    }
}
export default connectDB; 
