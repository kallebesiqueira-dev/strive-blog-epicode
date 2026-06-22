const express = require('express')
const jwt = require('jsonwebtoken')
const auth = express.Router()
const { passport, isGoogleConfigured } = require('../../config/passport')

const notConfigured = (req, res) =>
    res.status(503).send({ statusCode: 503, message: 'Google OAuth is not configured' })

auth.get('/auth/google', (req, res, next) => {
    if (!isGoogleConfigured()) {
        return notConfigured(req, res)
    }
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next)
})

auth.get('/auth/google/callback', (req, res, next) => {
    if (!isGoogleConfigured()) {
        return notConfigured(req, res)
    }
    passport.authenticate('google', { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`)
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        )

        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`)
    })(req, res, next)
})

module.exports = auth
