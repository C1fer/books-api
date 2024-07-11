// server.ts
import { createConnection } from 'typeorm';
import app from './app';
import { CONSTANTS } from './models/Constants';

createConnection().then(() => {
  app.listen(CONSTANTS.APP_PORT, () => {
    console.log(`Server is running on ${CONSTANTS.BASE_URL}`);
  });
}).catch(error => console.error('Database connection failed:', error));