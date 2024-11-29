import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "./models/userModel";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:8080/api/user/auth/google/callback',
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
