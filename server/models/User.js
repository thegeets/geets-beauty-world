const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  id: { type: String, default: () => Date.now().toString() },
  label: { type: String, default: "Home" },
  province: { type: String, default: "Gandaki" },
  city: { type: String, default: "Pokhara" },
  area: { type: String, default: "" },
  street: { type: String, default: "" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: Number, // product id
      },
    ],
    role: {
      type: String,
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
