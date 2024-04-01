import express from "express";
import { getAllUsers,createNewUser,deleteUser,getOneUser,updateUser } from "../controller/Users/users.controller";

export const usersRouter = express.Router();


usersRouter.route("/").get(getAllUsers).post(createNewUser);
usersRouter.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser);