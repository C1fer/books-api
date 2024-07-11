import { Request, Response } from "express";
import { Router } from "express";
import { BookController } from "../controllers/BookController";

export const bookRouter = Router();

bookRouter.get("/", BookController.getAllBooks);
bookRouter.get("/:id", BookController.getBookById);
bookRouter.post("/", BookController.createBook);
bookRouter.put("/", BookController.updateBook);
bookRouter.delete("/:id", BookController.deleteBook);