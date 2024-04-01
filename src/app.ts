import express  from "express";
import {Response,Request,NextFunction} from 'express'
import { tourRouter } from "./router/index";
import morgan from "morgan";
import {usersRouter} from './router/users'

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











export default app;