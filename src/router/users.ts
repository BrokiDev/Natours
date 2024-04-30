import express from "express";
import { getAllUsers,createNewUser,deleteUser,getOneUser,updateUser } from "../controller/Users/users.controller";
import { signUpController } from "../controller/Users/auth/auth.controller";

export const usersRouter = express.Router();


usersRouter.post('/signup',signUpController)

usersRouter.route("/").get(getAllUsers).post(createNewUser);
usersRouter.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser);