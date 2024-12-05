import dotenv from "dotenv";
import { app } from './app.js';
import connectDB from './db/index.js';


dotenv.config();
const Port = process.env.PORT || 3000;


connectDB()
.then(() => {
    console.log("Database connected");
    app.listen(Port, (req,res)=>{
        console.log(`Server is running on port ${Port}`);
    });
})
.catch((err) => {
    console.log("Database connection error", err);
    process.exit(1);
});
 


