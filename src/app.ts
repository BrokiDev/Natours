import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { RequestExt } from "./interfaces/reqExtend";
import { checkJwt } from "./middlewares/checkJwt";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRouter } from "./router/auth";
import { tourRouter } from "./router/index";
import { usersRouter } from './router/users';
import { AppError } from "./utils/appError";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import hpp from "hpp";
import helmet from "helmet";

const app = express();



const env = String(process.env.NODE_ENV).trim()

if(env === 'development') {
  app.use(morgan('dev'));
}



app.use(ExpressMongoSanitize())
app.use(express.json());
// app.use(xss('<script>alert("xss");</script>',{whiteList: {}}))

app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))
app.use(helmet())
app.use(express.static(`${__dirname}/public/`))




const limiter = rateLimit({
  windowMs: 15*60*1000,
  limit:100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'error',
    message:'Too Many Request'
  }

})

app.use(limiter)

app.use((req:RequestExt,res:Response,next:NextFunction) => {
  req.requestTime = new Date().toLocaleString();
  res.removeHeader('X-Powered-By')
  res.removeHeader('RateLimit-Policy')
  res.removeHeader('RateLimit')
  next();
});



app.use('/api/v1/tours',checkJwt,tourRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/auth',authRouter)





app.all('*',(req:Request,_res:Response,next:NextFunction) => {
  next(new AppError(`Can't find the route ${req.originalUrl} on this server`,404))
});



app.use(errorMiddleware)








export default app;