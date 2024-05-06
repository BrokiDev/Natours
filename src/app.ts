import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { RequestExt } from "./interfaces/reqExtend";
import { checkJwt } from "./middlewares/checkJwt";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRouter } from "./router/auth";
import { tourRouter } from "./router/index";
import { usersRouter } from './router/users';
import { AppError } from "./utils/appError";

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
  next(new AppError(`Can't find the route ${req.originalUrl} on this server`,404))
});



app.use(errorMiddleware)





export default app;