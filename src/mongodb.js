const mongoose = require('mongoose');

// Connect to the database with a more robust error handling and connection options
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Users');
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

connectDB();

// Define the schema with a more descriptive name
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model with a more descriptive name
const UserModel = mongoose.model('User', UserSchema);

// Export the model
module.exports = UserModel;
