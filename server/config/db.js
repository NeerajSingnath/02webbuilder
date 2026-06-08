import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${res.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
};

export default dbConnect;
