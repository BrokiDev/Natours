import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import { Tour } from "../../src/Model/Tour";

dotenv.config({ path: "../../.env" });

const tours = JSON.parse(fs.readFileSync("./tours-simple.json", "utf8"));


mongoose.connect(process.env.DATABASE!,{}).then(()=> console.log('Connected To Database Successfully'))

 
const importData = async() => {
    try {
        const Data = await Tour.create(tours)
    } catch (error) {
        console.log(error)
    }
}

// const deleteData = async () => {
//     try {
//         const Deleted = await Tour.deleteMany()
//     } catch (error) {
//         console.log(error)
//     }
// }

const getAll = async () => {
    try {
        const get = await Tour.find()
        console.log(get)
    } catch (error) {
        console.log(error)
        
    }
}


importData()

setTimeout(() => {
    getAll()

},1500)

