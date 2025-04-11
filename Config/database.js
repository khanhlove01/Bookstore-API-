const mongoose = require("mongoose")

const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB successfully");
    } catch (error) {
        console.log(error, "Fail to connect to DB");
    }
}

module.exports = connectToDB