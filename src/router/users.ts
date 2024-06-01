import express from "express";
import { deleteMe, deleteUser, getAllUsers, getOneUser, updateMe, updateUser } from "../controller/Users/users.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkPermission } from "../middlewares/checkPermission";
import { updatePassword } from "../controller/Users/auth/auth.controller";

export const usersRouter = express.Router();



usersRouter.patch('/updateMe',checkJwt,updateMe)
usersRouter.patch('/update-password',checkJwt,updatePassword)
usersRouter.delete('/deleteMe',checkJwt,deleteMe)

usersRouter.route("/").get(checkJwt,checkPermission('admin','moderator'),getAllUsers);
usersRouter.route("/:id").get(checkJwt,checkPermission('admin','moderator'),getOneUser).patch(checkJwt,checkPermission('admin',),updateUser).delete(checkJwt,checkPermission('admin'),deleteUser);