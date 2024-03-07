import express  from "express";
import {Response,Request,NextFunction} from 'express'
import { router as tourRouter } from "./router/index";
import morgan from "morgan";
import {router as usersRouter} from './router/users'

const app = express();





//1 Middlewares

process.env.NODE_ENV == 'development' && app.use(morgan("dev"));
setTimeout(() => {
  console.log('Environment of' ,process.env.NODE_ENV)
},1000)

app.use(express.json());
app.use(express.static(`${__dirname}/public/`))


app.use((req: any, res:Response, next:NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  console.log("Hello From Middleware");
  next();
});


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',usersRouter);











export default app;