const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const UserSchema = require('../modules/users/users.schema')

const isGoogleConfigured = () =>
    Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

if (isGoogleConfigured()) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:9099/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value

            let user = await UserSchema.findOne({ $or: [{ googleId: profile.id }, { email }] })

            if (!user) {
                user = await UserSchema.create({
                    googleId: profile.id,
                    firstName: profile.name?.givenName || profile.displayName || 'User',
                    lastName: profile.name?.familyName || '-',
                    email,
                    avatar: profile.photos && profile.photos[0] && profile.photos[0].value
                })
            } else if (!user.googleId) {
                user.googleId = profile.id
                await user.save()
            }

            done(null, user)
        } catch (e) {
            done(e)
        }
    }))
}

module.exports = { passport, isGoogleConfigured }
