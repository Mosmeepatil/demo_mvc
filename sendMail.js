const nodemailer = require("nodemailer")
// const Transporter = require("nodemailer")
const ejs = require("ejs")
const path = require('path')

const sendMail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
    })

    const { email, subject, template, data } = options;
    const templatePath = path.join(__dirname, '../mails', template)

    // const html = await ejs.renderFile(templatePath, data)
    // console.log(html);
    const mailOption = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    };
    console.log(mailOption);
    await transporter.sendMail(mailOption)
}
module.exports = sendMail