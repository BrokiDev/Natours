import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../helpers/catchAsync";
import { verifyToken } from "../helpers/jwt.service";
import { AppError } from "../utils/appError";
import { User } from "../Model/Users";

interface RequestWithUser extends Request {
  user?: object;
}

export const checkJwt = catchAsync(
  async ({headers,user}: RequestWithUser, res: Response, next: NextFunction) => {
    const jwtByUser = headers.authorization;
    const jwt = jwtByUser?.split(" ").pop();
    const validateToken = verifyToken(`${jwt}`);
    const currentUser = await User.findById(validateToken.userId);
    if (!currentUser) {
      return next(new AppError("Unauthorized", 401));
    }

    if (currentUser.changePasswordAfter(validateToken.iat as number)) {
      return next(new AppError("User recently change password! Please log in again", 401));
    }
    user = currentUser;

    console.log("User is authenticated", user);
    next(); 
  }
);
