const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/policy_details';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;