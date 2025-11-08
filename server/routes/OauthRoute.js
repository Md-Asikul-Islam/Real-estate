import express from "express";
import passport from "../config/passport.js";
import { oauthSuccess, oauthFailure } from "../controllers/OauthController.js";

const router = express.Router();

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/api/oauth/failure", session: false }), oauthSuccess);

// GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/api/oauth/failure", session: false }), oauthSuccess);

// Failure
router.get("/failure", oauthFailure);

export default router;