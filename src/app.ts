import express  from "express";
import {Response,Request,NextFunction} from 'express'
import { tourRouter } from "./router/index";
import morgan from "morgan";
import {usersRouter} from './router/users'
import { AppError } from "./utils/appError";
import { RequestExt } from "./interfaces/reqExtend";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { checkJwt } from "./middlewares/checkJwt";
import { authRouter } from "./router/auth";

const app = express();



const env = String(process.env.NODE_ENV).trim()

//1 Middlewares
if(env === 'development') {
  app.use(morgan('dev'));
}




app.use(express.json());
app.use(express.static(`${__dirname}/public/`))


app.use((req:RequestExt,_res:Response,next:NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  next();
});



app.use('/api/v1/tours',checkJwt,tourRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/auth',authRouter)





app.all('*',(req:Request,res:Response,next:NextFunction) => {
  // const err:ErrorCustom = new Error(`Can't find the route ${req.originalUrl} on this server`);
  // err.status = 'fail',
  // err.statusCode = 404
  next(new AppError(`Can't find the route ${req.originalUrl} on this server`,404))
});



app.use(errorMiddleware)





export default app;