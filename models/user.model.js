const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return emailRegexPattern.test(value)
            },
            message: "please enter valid mail"
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be atleast 6 character"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    , courses: [
        {
            courseId: String
        }
    ]
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
const userModel = mongoose.model("User", userSchema);
module.exports = userModel