import dotenv from 'dotenv'
import app from "./src/app";
import mongoose from "mongoose";

dotenv.config({path: './.env'})





// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     price: 450,
//     rating:4.8 
// })

// testTour.save().then(doc => console.log(doc)).catch(err => console.log(err))



mongoose.connect(process.env.DATABASE!,{}).then(()=> console.info('Connected To The Database Successfully'))


const port = process.env.PORT || 3000;


app.listen(port,()=> console.log(`App running in port ${port}`));