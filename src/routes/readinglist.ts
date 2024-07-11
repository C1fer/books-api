/* istanbul ignore file */


import { Router } from "express";
import {ReadingListController} from "../controllers/ReadingListController";

export const readingListRouter = Router();

readingListRouter.get('/', ReadingListController.getUserReadingList);
readingListRouter.post('/', ReadingListController.addToReadingList);
readingListRouter.delete('/', ReadingListController.removeFromReadingList);