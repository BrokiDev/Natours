export const updateTour = (req: any, res: any) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here ...>",
    },
  });
};
