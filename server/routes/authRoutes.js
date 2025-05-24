const express = require("express");
const router = express.Router();
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Initialize Google client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        process.env.REACT_APP_GOOGLE_CLIENT_ID, // Frontend client ID if different
      ],
    });

    const payload = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email }],
    });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        isVerified: true, // Google-verified email
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const token = generateToken(user._id);
    //Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });

    // Set CORS headers
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.json({ token });
  } catch (err) {
    console.error("Google auth error:", error);
    res.status(401).json({
      error: "Google authentication failed",
      message: error.message,
    });
  }
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, generate JWT
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  }
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
