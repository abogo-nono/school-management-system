const mongoose = require('mongoose');

/**
 * Asynchronously connects to the MongoDB database using the connection URI
 * specified in the environment variable `MONGODB_URI`.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws Will throw an error if the connection fails, and exits the process with status code 1.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;