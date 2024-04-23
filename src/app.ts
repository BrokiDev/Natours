import express  from "express";
import {Response,Request,NextFunction} from 'express'
import { tourRouter } from "./router/index";
import morgan from "morgan";
import {usersRouter} from './router/users'
import { AppError } from "./utils/appError";
import { RequestExt } from "./interfaces/reqExtend";
import { errorMiddleware } from "./middlewares/errorMiddleware";


const app = express();



//1 Middlewares
if(process.env.NODE_ENV == 'development'){
  app.use(morgan("dev"))
}



app.use(express.json());
app.use(express.static(`${__dirname}/public/`))


app.use((req:RequestExt,res:Response,next:NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});



app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',usersRouter);





app.all('*',(req:Request,res:Response,next:NextFunction) => {
  // const err:ErrorCustom = new Error(`Can't find the route ${req.originalUrl} on this server`);
  // err.status = 'fail',
  // err.statusCode = 404
  next(new AppError(`Can't find the route ${req.originalUrl} on this server`,404))
});



app.use(errorMiddleware)





export default app;