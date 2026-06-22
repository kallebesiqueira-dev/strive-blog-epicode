const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const fromAddress = process.env.SENDGRID_FROM || 'noreply@striveblog.com'

const sgtSend = async (to, subject, message) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('SendGrid not configured, skipping email')
        return
    }
    return sgMail.send({ from: fromAddress, to, subject, html: message })
}

const sendEmail = async (to, subject, message) => {
    if (!process.env.HOST || !process.env.EMAIL_USERNAME) {
        console.warn('SMTP not configured, skipping email')
        return
    }

    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    return transporter.sendMail({ from: fromAddress, to, subject, html: message })
}

module.exports = {
    sendEmail,
    sgtSend,
}
