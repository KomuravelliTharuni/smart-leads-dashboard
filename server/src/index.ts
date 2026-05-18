import dotenv from 'dotenv'
dotenv.config()

import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URL || 'mongodb://localhost:27017/smart-leads';

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
