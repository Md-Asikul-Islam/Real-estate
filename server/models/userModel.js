import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// const TransactionSchema = new Schema(
//   {
//     type: {
//       type: String,
//       enum: ["deposit", "withdraw", "purchase", "refund", "admin_adjust"],
//       required: true,
//     },
//     amount: {
//       type: mongoose.Types.Decimal128,
//       required: true,
//       min: [0, "Amount must be positive"],
//     },
//     description: { type: String, trim: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: function () {
        return this.oauthProvider === "local";
      },
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return this.oauthProvider === "local";
      },
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    /* -------------------- Balance Fields -------------------- */
    // balance: {
    //   type: mongoose.Types.Decimal128,
    //   default: 0.0,
    //   get: (v) => parseFloat(v.toString()), // convert for JSON output
    //   set: (v) => parseFloat(v).toFixed(2),
    //   min: [0, "Balance cannot be negative"],
    // },
    // currency: {
    //   type: String,
    //   enum: ["BDT", "USD", "EUR"],
    //   default: "BDT",
    // },
    // transactions: {
    //   type: [TransactionSchema],
    //   default: [],
    // },

    // Email verification token
    verificationCode: String,
    verificationCodeExpires: Date,

    // OTP for reset password
    verificationOTP: String,
    verificationOTPExpires: Date,
    // token
    refreshToken: String,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    //OAuth provider fields
    googleId: { type: String, index: true },
    githubId: { type: String, index: true },
    facebookId: { type: String, index: true },
    oauthProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if local auth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method (for local login only)
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false; // OAuth user has no password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Email verification Code
userSchema.methods.getVerificationCode = function () {
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  this.verificationCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
  this.verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return code;
};

// reset password verification  OTP
userSchema.methods.getVerificationOTP = function () {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  this.verificationOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10min
  return otp;
};

// Generate password reset token
userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

/* ----------------------------- Balance Methods ----------------------------- */
// userSchema.methods.credit = function (amount, description = "Deposit") {
//   if (amount <= 0) throw new Error("Credit amount must be positive");
//   this.balance = (parseFloat(this.balance) + parseFloat(amount)).toFixed(2);
//   this.transactions.push({ type: "deposit", amount, description });
// };

// userSchema.methods.debit = function (amount, description = "Purchase") {
//   if (amount <= 0) throw new Error("Debit amount must be positive");
//   if (parseFloat(this.balance) < parseFloat(amount))
//     throw new Error("Insufficient balance");
//   this.balance = (parseFloat(this.balance) - parseFloat(amount)).toFixed(2);
//   this.transactions.push({ type: "withdraw", amount, description });
// };

export default mongoose.model("User", userSchema);
