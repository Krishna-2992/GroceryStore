const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB C onnected Successfully');
    } catch (error) {
        logger.error('MongoDB Connection Failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;