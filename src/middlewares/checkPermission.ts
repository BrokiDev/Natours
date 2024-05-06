import { NextFunction, Response } from "express";
import { RequestExt } from "../interfaces/reqExtend";
import { AppError } from "../utils/appError";

export const checkPermission = (...roles: string[]) => {
  return ({ user }: RequestExt, _res: Response, next: NextFunction) => {
    const role = `${user?.role}`;

    if (!roles.includes(role)) {
      console.log("here negative");
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
