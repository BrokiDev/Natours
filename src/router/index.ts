import express from "express";
import { getAllTours,createTour,deleteTour,getOneTour,UpdateTour, getTourStats } from "../controller/Tours/tours.controller";
import { topCheap } from "../middlewares/topCheap";


export const tourRouter = express.Router();



tourRouter.route('/top-5-cheaps').get(topCheap,getAllTours)
tourRouter.route('/tour-stats').get(getTourStats)

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").delete(deleteTour).get(getOneTour).patch(UpdateTour);

