import { User } from "../models/User";
import { Request, Response } from "express";
import { Book } from "../models/Book";

export class ReadingListController {
    static async getUserReadingList(req: Request, res: Response) {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).send("User ID is required");
        }

        await User.findOneBy({id: userId}).then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            return res.status(200).send(user.readingList);
        });
    }

    static async addToReadingList(req: Request, res: Response) {
        const { userId, bookId } = req.body;

        if (!userId || !bookId) {
            return res.status(400).send("User ID and Book ID are required");
        }

        const user = await User.findOne({where: {id: userId}, relations: ["readingList"]});
        const book = await Book.findOneBy({id: bookId})

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!book) {
            return res.status(404).send("Book not found");
        }

        if (user.readingList.includes(book)) {
            return res.status(400).send("Book already in reading list");
        }

        user.readingList.push(bookId);
        user.save();

        return res.status(200).send("Book added to reading list");
    }

    static async removeFromReadingList(req: Request, res: Response) {
        const { userId, bookId } = req.body;

        if (!userId || !bookId) {
            return res.status(400).send("User ID and Book ID are required");
        }

        const user = await User.findOne({where: {id: userId}, relations: ["readingList"]});

        if (!user) {
            return res.status(404).send("User not found");
        }

        const bookIds: number[] = user.readingList.map(book => book.id);

        if (!bookIds.includes(bookId)) {
            return res.status(400).send("Book not in reading list");
        }

        user.readingList.filter(book => book.id !== bookId);
        await user.save();
        res.status(200).send("Book removed from reading list");


    }
}
