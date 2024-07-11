import { Request, Response } from "express";
import { Book } from "../models/Book";
import { sendResponse } from "../utils/HTTPUtils";

export class BookController {
    static async getAllBooks(req: Request, res: Response) {
        await Book.find().then((books) => sendResponse(res, 200, books));
    }

    static async getBookById(req: Request, res: Response) {
        const bookId: number = Number(req.params.id);

        if (isNaN(bookId)) {
            return sendResponse(res, 400, "Invalid Book ID");
        }

        await Book.findOneBy({ id: bookId }).then((book) =>
            sendResponse(res, 200, book)
        );
    }

    static async createBook(req: Request, res: Response) {
        const {
            author,
            title,
            genre,
            isbn,
            publisher,
            publishedYear,
            edition,
            pages,
        } = req.body;

        const fields = {
            author,
            title,
            genre,
            isbn,
            publisher,
            publishedYear,
            pages,
        };

        const missingFields = Object.entries(fields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return sendResponse(
                res,
                400,
                `Missing required fields: ${missingFields.join(", ")}`
            );
        }
        const bookExists = await Book.findOneBy({ isbn: isbn });

        if (bookExists) {
            return sendResponse(res, 400, "Book already exists");
        }

        const book = new Book();
        book.author = author;
        book.title = title;
        book.genre = genre;
        book.isbn = isbn;
        book.publisher = publisher;
        book.publishedYear = publishedYear;
        book.edition = edition;
        book.pages = pages;

        await Book.save(book).then((savedBook) =>
            sendResponse(res, 200, {id: savedBook.id })
        );
    }

    static async updateBook(req: Request, res: Response) {
        const {
            id,
            author,
            title,
            genre,
            isbn,
            publisher,
            publishedYear,
            edition,
            pages
        } = req.body;

        for (const key in req.body) {
            if (!req.body[key]) {
                return sendResponse(res, 400, "All fields are required");
            }
        }

        const bookExists = await Book.findOneBy({ id: id });

        if (!bookExists) {
            return sendResponse(res, 404, "Book not found");
        }

        await Book.update(id, {
            ...bookExists,
            author,
            title,
            genre,
            isbn,
            publisher,
            publishedYear,
            edition,
            pages
        }).then(() => sendResponse(res, 200, "Book updated successfully"));
    }

    static async deleteBook(req: Request, res: Response) {
        const bookId: number = Number(req.params.id);

        if (isNaN(bookId)) {
            return sendResponse(res, 400, "Invalid Book ID");
        }

        const bookExists = await Book.findOneBy({ id: bookId });

        if (!bookExists) {
            return sendResponse(res, 404, "Book not found");
        }

        await Book.delete(bookId)
            .then(() => sendResponse(res, 200, "Book deleted successfully"))
    }
}
