require("dotenv").config()
const userModel = require("../models/user.model")
const ErrorHandler = require("../ErrorHandler")
//const CatchAsyncError = require("../middleware/catchAsyncError")
const jwt = require("jsonwebtoken")
const sendMail = require("../sendMAil")
const ejs = require("ejs")
const path = require("path")
const registrationUser = (async (req, res, next) => {
    try {

        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email })

        if (isEmailExist) {

            return next(new ErrorHandler("Email already exist", 400))
        }
        const user = {
            name,
            email,
            password
        }
        const activationToken = createActivationToken(user)

        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data)

        try {

            await sendMail({
                email: user.email,
                subject: "Activate you account",
                template: "activation-mail.",
                data,
            })
            res.status(201).json({
                success: true,
                message: `Please Check Your email:${user.email}`,
                activationToken: activationToken.token
            })
        }
        catch (error) {
            return next(new ErrorHandler(error.message, 400))
        }
        // module.exports = createActivationToken;

    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }

})
createActivationToken = (user) => {
    const activationCode = Math.floor(Math.random() * 9000).toString()

    const token = jwt.sign({
        user, activationCode
    },
        process.env.ACTIVATION_SECRET,
        {
            expiresIn: "5m"
        })
    return {
        token, activationCode
    }

}


//CLASS WORk

const updateUserInfo = (async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId)
        if (email && user) {
            const isEmailExist = await userModel.findOne({ email })
            if (isEmailExist) {
                return next(new ErrorHandler("Email Already Exist", 400))
            }
            user.email = email;
        }
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        await redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user
        })

    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//update password

const updateUserPassword = (async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Enter old and new password", 400))
        }
        const user = await userModel.findById(req.user?._id).select("+password")
        if (user === undefined) {
            return next(new ErrorHandler("Invalid user", 400))
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword)
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid old Password", 400))
        }
        user.password = newPassword
        await user.save();
        await redis.set(req.user?._id, JSON.stringify(user))
        res.status(201).json({
            success: true,
            user
        })

    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


//update Profile Picture

const updateProfilePicture = (async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId)
        if (avatar && user) {
            if (user?.avatar?.public_id) {
                //first delete old image and upload image
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
                //npm i cloudinary
                const mycloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                })
                user?.avatar = {
                    public_id: mycloud.public_id,
                    url: mycloud.secure_url
                }
            }
            else {
                const mycloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                })
                user?.avatar = {
                    public_id: mycloud.public_id,
                    url: mycloud.secure_url
                }
            }
        }
        await user?.save();
        await redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user
        })
    }

    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})






//above res.cookier
req.user = user




module.exports = { registrationUser, createActivationToken }