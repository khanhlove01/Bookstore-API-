const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectToDb = require("./Config/database")
const authRoutes = require('./Routes/auth-routes')
const router = express.Router();
const homeRoutes = require('./Routes/home-routes')
const adminRoutes = require('./Routes/admin-routes')
const imageRoutes = require('./Routes/image-routes')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json())
app.use(cookieParser());
//Postman / Browser clients won’t store the cookie unless your server sends it with the right CORS setup.
app.use(cors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true // 👈 allow sending cookies // “Allow cookies to be sent in cross-origin requests.”   
  }));
//route here
app.use('/api/user',authRoutes)
app.use('/welcome',homeRoutes)
app.use('/welcome',adminRoutes)
app.use('/api/image',imageRoutes)

//connect to DB
connectToDb();
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`Server is running on PORT ${PORT}`);
    console.log('====================================');
})
