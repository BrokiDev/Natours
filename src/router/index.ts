import express from "express";
import {createNewTour, getOneTour,deleteTour,getAllTours,updateTour} from "../controller/Tours/tours.controller";
import { checkBody } from "../middlewares/Tours/checkBody";


export const router = express.Router();



// router.param('id',checkId)

router.route("/").get(getAllTours).post(createNewTour);
router.route("/:id").get(getOneTour).patch(updateTour).delete(deleteTour);
