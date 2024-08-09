const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,     // Use the new URL parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });

    // Log a success message if the connection is successful
    console.log('MongoDB connected successfully');
  } catch (err) {
    // Log the error message if the connection fails
    console.error('Error connecting to MongoDB:', err.message);
    
    // Exit the process with a failure code
    process.exit(1);
  }
};

module.exports = connectDB;
