import { Tour } from "../../Model/Tour";
import { NextFunction, Request, Response } from "express";
import { APIFeatures } from "../../utils/ApiFeatures";
import { RequestExt } from "../../interfaces/reqExtend";
import { catchAsync } from "../../helpers/catchAsync";

export const getAllTours = catchAsync(
  async (req: RequestExt, res: Response, next: NextFunction): Promise<void> => {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const tours = await features.query;
    res.status(200).send({
      status: "success",
      createdAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  }
);

export const getOneTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  }
);

export const getTourStats = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const stats = await Tour.aggregate([
      { $match: { rating: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$rating" },
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  }
);

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      tour,
    });
  }
);

export const UpdateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      tour,
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
