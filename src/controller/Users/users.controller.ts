import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../helpers/catchAsync";
import { IUser, User } from "../../Model/Users";
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.find();
    res.status(200).json({
      status: "success",
      requestAt: new Date(),
      data: {
        users: data,
      },
    });
  }
);
export const getOneUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  const body: IUser = req.body;
  const data = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: data,
    },
  });
});

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
