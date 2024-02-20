require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookiesParser = require("cookie-parser")
const ErrorMiddleware = require("./middleware/error")
app.use(express.json({ limit: "50mb" }));
app.use(cookiesParser());
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN
}))
const connectDb = require("./db");
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API WORKING"
    })
})


const userRouter = require("./routes/user.route")
app.use("/api/v1", userRouter);


app.all("*", (req, res, next) => {
    const err = new Error("Route not found");
    err.status = 404;
    next(err)

})
app.use(ErrorMiddleware)


//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})
app.listen(process.env.PORT, function () {
    console.log(`server is running:${process.env.PORT}`);
    connectDb();
});