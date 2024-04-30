import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../helpers/catchAsync";
import { User } from "../../Model/Users";
export const getAllUsers = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

export const createNewUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

export const getOneUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

export const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

export const deleteUser = catchAsync(
  async ({ params }: Request, res: Response, next: NextFunction) => {
    const { id } = params;
    await User.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
