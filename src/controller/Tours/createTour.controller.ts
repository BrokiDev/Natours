import { Tour } from "../../Model/Tour";

export const createNewTour = async (req: any, res: any) => {
  try{

    const newTour = await Tour.create(req.body)
      res.status(201).json({
        status: "success",
        data: {
          tours: newTour
        },
      });
  }catch(err){
    res.status(400).json({
      status: 'failed',
      message:err
    })
  }

};
