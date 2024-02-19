import express from "express";
import fs from 'fs'


const app = express();
const port = 1234;


const tours =JSON.parse(fs.readFileSync(`dev-data/data/tours-simple.json`,'utf-8'))

app.use(express.json())


app.get('/api/v1/tours',(req,res)=> {
    res.status(200).send({
        status:'success',
        result: tours.length,
        data: {
            tours
        }
    })
})

app.post('/api/v1/tours',(req,res)=> {
    // console.log(req.body)
    const newId = tours[tours.length -1].id ++;
    const newTour = Object.assign({id:newId},req.body)

    tours.push(newTour)

    fs.writeFile(`dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=> {
        res.status(201).json({
            status:'success',
            data: {
                tours:newTour
            }
        })
    })
})




app.listen(port, ()=> console.log(`App Running in the port ${port}...`))

