import express  from "express";
import {Response,Request,NextFunction} from 'express'
import { tourRouter } from "./router/index";
import morgan from "morgan";
import {usersRouter} from './router/users'

interface ErrorCustom extends Error {
  status?:string,
  statusCode?:number
}

const app = express();



//1 Middlewares
if(process.env.NODE_ENV == 'development'){
  app.use(morgan("dev"))
}



app.use(express.json());
app.use(express.static(`${__dirname}/public/`))


app.use((req: any, res:Response, next:NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});



app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',usersRouter);





app.all('*',(req:Request,res:Response,next:NextFunction) => {
  const err:ErrorCustom = new Error(`Can't find the route ${req.originalUrl} on this server`);
  err.status = 'fail',
  err.statusCode = 404
  next(err)
});

app.use((err:any,req:Request,res:Response,next:NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message:err.message
  })
})





export default app;