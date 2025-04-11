require("dotenv").config()
const express = require("express")
const connectToDb = require("./Config/database")

const app = express();
const PORT = process.env.PORT || 5001;

//connect to DB
connectToDb();
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
