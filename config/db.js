const mongoose = require('mongoose')
require('dotenv').config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{

    });
    console.log("Mongodb connected successfully!");
    
  } catch (error) {
    console.log("Mongodb not connected",error);
    process.exit(1);
  }
}

module.exports = connectDb;