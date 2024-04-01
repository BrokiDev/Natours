import dotenv from 'dotenv'
import app from "./src/app";
import mongoose from "mongoose";

dotenv.config({path: './.env'})


mongoose.connect(process.env.DATABASE!,{}).then(()=> console.info('Connected To The Database Successfully'))


const port = process.env.PORT || 3000;


app.listen(port,()=> console.log(`App running in port ${port}`));