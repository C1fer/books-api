import { Request, Response } from "express";
import { User } from "../models/User";
import { CONSTANTS } from "../models/Constants";
import { sendResponse } from "../utils/HTTPUtils";

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        await User.find().then((users) => sendResponse(res, 200, users));
    }

    static async getUserById(req: Request, res: Response) {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return sendResponse(res, 400, "User ID is required");
        }

        await User.findOneBy({ id: userId }).then((user) =>
            sendResponse(res, 200, user)
        );
    }

    static async createUser(req: Request, res: Response) {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return sendResponse(res, 400, CONSTANTS.USERNAME_PASSWORD_REQUIRED);
        }

        if (password.length < 8 || password.length > 20) {
            return sendResponse(
                res,
                400,
                "Invalid password length. Must be between 8 and 20 characters"
            );
        }

        if (username.length < 5 || username.length > 15) {
            return sendResponse(
                res,
                400,
                "Invalid username length. Must be between 5 and 15 characters"
            );
        }

        const user = await User.findOneBy({ username: username });

        if (user) {
            sendResponse(res, 400, "User already exists");
        }

        const newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email = email;

        await User.save(newUser).then((savedUser) =>
            sendResponse(res, 200, {id: savedUser.id, username: savedUser.username})
        );
    }

    static async loginUser(req: Request, res: Response) {
        const { username, password, email } = req.body;
        const user = new User();
        user.username = username;
        user.password = password;
        user.email = email;

        if (!username || !password) {
            return sendResponse(res, 400, CONSTANTS.USERNAME_PASSWORD_REQUIRED);
        }

        await User.findOne({ where: { username, password } }).then((user) => {
            if (user) {
                res.status(200).send(user);
            } else {
                return sendResponse(res, 401, CONSTANTS.INVALID_CREDENTIALS);
            }
        });
    }

    static async updateUser(req: Request, res: Response) {
        const { id, username, password, email } = req.body;

        const requiredFields = ["id", "username", "password"];
        for (const key in requiredFields) {
            if (!requiredFields) {
                sendResponse(res, 400, `${key} is required`);
            }
        }

        try {
            const user = await User.findOneBy({ id: id });

            if (!user) {
                return sendResponse(res, 404, "User not found");
            }

            user.username = username;
            user.password = password;
            user.email = email;
            await User.save(user);
            return sendResponse(res, 200, "User updated successfully");
        } catch (error) {}
    }

    static async deleteUser(req: Request, res: Response) {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return sendResponse(res, 400, CONSTANTS.USERNAME_PASSWORD_REQUIRED);
        }

        try {
            const user = await User.findOneBy({
                id: userId,
                password: password,
            });
            if (!user) {
                return sendResponse(res, 401, CONSTANTS.INVALID_CREDENTIALS);
            }
            await User.delete(userId);
            return sendResponse(res, 200, "User deleted successfully");
        } catch (error) {}
    }
}
