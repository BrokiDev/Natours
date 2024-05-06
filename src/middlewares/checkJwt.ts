import { NextFunction, Response } from "express";
import { User } from "../Model/Users";
import { catchAsync } from "../helpers/catchAsync";
import { verifyToken } from "../helpers/jwt.service";
import { RequestExt } from "../interfaces/reqExtend";
import { AppError } from "../utils/appError";

export const checkJwt = catchAsync(
  async (req: RequestExt, res: Response, next: NextFunction) => {
    const jwtByUser = req.headers.authorization;
    const jwt = jwtByUser?.split(" ").pop();
    const validateToken = verifyToken(`${jwt}`);

    const currentUser = await User.findById(validateToken.userId);
    if (!currentUser) {
      return next(new AppError("Unauthorized", 401));
    }

    if (currentUser.changePasswordAfter(validateToken.iat as number)) {
      return next(new AppError("User recently change password! Please log in again", 401));
    }

    (req as RequestExt).user = currentUser;

    console.log("User is authenticated", req.user);
    next(); 
  }
);
