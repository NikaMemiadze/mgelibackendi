const mongoose = require('mongoose');

const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB on local network");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); 
    }
};

module.exports = connectDB;
