const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    image: {
      type: String,
      default: "/uploads/users/user.png",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    role: {
      type: String,
      enum: roles, // e.g., ["user", "super_admin"]
      default: "user",
    },
    type: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
    },
    // seller, admin, customer

    // ─── Driver-only fields ───────────────────────────────────────────────
    address: {
      type: String,
      default: null,
    },
    // ──────────────────────────────────────────────────────────────────────

    phoneNumber: {
      type: String,
      unique: true,
    },

    oneTimeCode: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    fcmToken: { type: String, default: null }, // push
    isDeleted: { type: Boolean, default: false },

    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalWithDrawal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Statics
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPhoneNumberTaken = async function (
  phoneNumber,
  excludeUserId
) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

// Methods
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Hooks
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Indexes
userSchema.index({ name: 1 });
userSchema.index({ type: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
