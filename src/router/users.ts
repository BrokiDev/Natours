import express from "express";
// import { checkId } from "../controller/Tours/getAllTours.controller";
import { getAllUsers,createNewUser,deleteUser,getOneUser,updateUser } from "../controller/Users/users.controller";

export const router = express.Router();

// router.param('id',checkId)

router.route("/").get(getAllUsers).post(createNewUser);
router.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser);