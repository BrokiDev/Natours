import express from "express";
import fs from 'fs'

// const express = require("express");

const app = express();
const port = 1234;




const tours =JSON.parse(fs.readFileSync(`dev-data/data/tours-simple.json`,'utf-8'))






// app.get('/', (req, res)=> {
//     res.status(200).json({
//         message: 'Hello from the server side!',
//         app: 'Natours'
//     })
// })

// app.post('/',({req,res}:any)=> {
//     res.status(200).send('<h1>you cant post here</h1>')
// })


app.get('/api/v1/tours',(req,res)=> {
    res.status(200).send({
        status:'success',
        result: tours.length,
        data: {
            tours
        }
    })
})




app.listen(port, ()=> console.log(`App Running in the port ${port}...`))

