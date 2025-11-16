import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true," First Name is required"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true," Last Name is required"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true," Email is required"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true," Phone Number is required"],
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  nic: {
    type: String,
    required: [true," NIC/Qualifications are required"],
    validate: {
      validator: function(v) {
        if (this.role === "Doctor") {
          return v.length >= 2;
        }
        return /^\d{12}$/.test(v);
      },
      message: function(props) {
        return this.role === "Doctor"
          ? "Qualifications must be at least 2 characters!"
          : "Aadhaar must contain exactly 12 digits!";
      }
    }
  },
  dob:{
    type: Date,
    required: [true, "Date of Birth is required!!"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["Doctor", "Admin", "Patient"],
    // default: "User",
  },
  doctorDepartment:{
    type: String,
  },
  docPhoto: {
    public_id: String,
    url: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
     next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);



 