import express from "express";
import { deleteUser, getAllUsers, getOneUser, updateUser } from "../controller/Users/users.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkPermission } from "../middlewares/checkPermission";

export const usersRouter = express.Router();




usersRouter.route("/").get(checkJwt,checkPermission('admin','moderator'),getAllUsers);
usersRouter.route("/:id").get(checkJwt,checkPermission('admin','moderator'),getOneUser).patch(checkJwt,checkPermission('admin',),updateUser).delete(checkJwt,checkPermission('admin'),deleteUser);