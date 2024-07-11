// app.ts
import Express from 'express';
import { CONSTANTS } from './models/Constants';
import { bookRouter } from './routes/books';
import { userRouter } from './routes/users';
//import { readingListRouter } from './routes/readinglist';
import { sendResponse } from './utils/HTTPUtils';


const app = Express();

app.use(Express.json());

// Moved error handler middleware to be used before route handlers
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    sendResponse(res, 500, CONSTANTS.REQUEST_ERROR_MESSAGE);
  }
});

app.use('/books', bookRouter);
app.use('/users', userRouter);
//app.use('/reading-list', readingListRouter);

export default app;