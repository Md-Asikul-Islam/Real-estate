import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel.js";

// ================= GOOGLE STRATEGY =================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/oauth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ email });

        // 🔹 Create user if doesn't exist
        if (!user) {
          user = await User.create({
            userName: profile.displayName,
            email,
            googleId: profile.id,
            oauthProvider: "google",
            isVerified: true,
          });
        } else if (!user.googleId) {
          // 🔹 If user exists but not linked to Google yet
          user.googleId = profile.id;
          user.oauthProvider = "google";
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ================= GITHUB STRATEGY =================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/oauth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value;

        // যদি profile এ email না থাকে
        if (!email) {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${accessToken}` },
          });
          const emails = await response.json();
          email = emails.find((e) => e.primary)?.email || emails[0]?.email;
        }

        // 🔹 Step 1: Check if user already exists by githubId OR email
        let user = await User.findOne({
          $or: [{ githubId: profile.id }, { email: email }],
        });

        // 🔹 Step 2: Create new user only if not exists
        if (!user) {
          user = await User.create({
            userName: profile.displayName || profile.username || "GitHubUser",
            email: email || `${profile.username}@noemail.github.com`,
            githubId: profile.id,
            oauthProvider: "github",
          });
        } else {
          // 🔹 Step 3: If user exists but githubId not linked, update it
          if (!user.githubId) {
            user.githubId = profile.id;
            user.oauthProvider = "github";
            await user.save({ validateBeforeSave: false });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("GitHub OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;
