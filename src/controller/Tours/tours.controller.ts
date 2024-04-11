import { Tour } from "../../Model/Tour";
import { Request, Response } from "express";
import { APIFeatures } from "../../utils/ApiFeatures";

export const getAllTours = async (req: any, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};

export const getOneTour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

export const getTourStats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { rating: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
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
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

export const getMonthlyPlan = async (req: Request, res: Response) =>  {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }

}

export const createTour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};

export const UpdateTour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

export const deleteTour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "Error Invalid ID or Not Found",
    });
  }
};
