import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017/restaurant';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    await mongoose.connect(mongoUri);
    const { host, name } = mongoose.connection;
    console.log(`[mongo] Connected to ${name} at ${host}`);
  } catch (error) {
    console.error('[mongo] Connection failed', error);
    process.exit(1);
  }
};

