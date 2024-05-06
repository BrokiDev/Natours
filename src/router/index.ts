import express from "express";
import { getAllTours,createTour,deleteTour,getOneTour,UpdateTour, getTourStats, getMonthlyPlan } from "../controller/Tours/tours.controller";
import { topCheap } from "../middlewares/topCheap";
import { checkPermission } from "../middlewares/checkPermission";


export const tourRouter = express.Router();



tourRouter.route('/top-5-cheaps').get(topCheap,getAllTours)
tourRouter.route('/tour-stats').get(getTourStats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").delete(checkPermission('admin'|| 'moderator'),deleteTour).get(getOneTour).patch(checkPermission('admin'|| 'moderator'),UpdateTour);

