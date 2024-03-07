import { Tour } from "../../Model/Tour";

export const getAllTours =  async (req: any, res: any) => {

  const tours = await Tour.find()
  res.status(200).send({
    status: "success",
    createdAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};
