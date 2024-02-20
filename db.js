const mongoose = require("mongoose");
require("dotenv").config()
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then((data) => {
            console.log(`Database Connected with${data.connection.host}`);
        })
    }
    catch (error) {
        console.log(error.message);
        setTimeout(connectDb, 5000)
    }
}

module.exports = connectDb;