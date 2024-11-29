import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "./models/userModel";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost";
const PORT = process.env.PORT || 3000;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: `${SERVER_URL}:${PORT}/api/user/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({email: profile.emails?.[0].value});

            if (!user) {
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0].value,
                });
                await newUser.save({
                    validateBeforeSave: false,
                });
                if (newUser) {
                    done(null, newUser);
                }
            } else {
                done(null, user);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
});
