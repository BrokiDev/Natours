import { Tour } from "../../Model/Tour";

export const getOneTour = async (req: any, res: any) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).send({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};
