import dotenv from 'dotenv';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

import app from './App.js';
dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const db = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(db)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error💥: ', err);
  });

const server = app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
