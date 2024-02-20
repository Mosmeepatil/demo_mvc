const express = require("express")
const UserControl = require("../controllers/user.controller")
const userRouter = express.Router();

userRouter.post('/registration', UserControl.registrationUser)

module.exports = userRouter;

//change

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo)
userRouter.put("/update-user-password", isAuthenticated, updatePassword)
userRouter.put("/update-user-avatar", updateProfilePicture)