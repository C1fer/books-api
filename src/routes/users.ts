import { Router } from "express";
import { UserController } from "../controllers/UserController";

export const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.put("/", UserController.updateUser);
userRouter.get("/:id", UserController.getUserById);
userRouter.delete("/:id", UserController.deleteUser);

// Auth Routes
userRouter.post("/signup", UserController.createUser);
userRouter.post("/login", UserController.loginUser);


