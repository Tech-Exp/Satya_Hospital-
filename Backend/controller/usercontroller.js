import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

export const patientRegister = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role
    ) {
        return next(new ErrorHandler("Please fill all the fields!", 400));
    }
    if (!isValidAadhaar(nic)) {
        return next(new ErrorHandler("Please provide a valid 12-digit Aadhaar number", 400));
    }
    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("User already exists!", 400));
    }
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,       
});
    generateToken(user, "User registered successfully!", 200, res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;
    console.log("Login attempt:", { email });
    
    if (!email || !password) {
        console.log("Login failed: Missing required fields");
        return next(new ErrorHandler("Please provide email and password!", 400));
    }       
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        console.log("Login failed: User does not exist", { email });
        return next(new ErrorHandler("User does not exist!", 400));
    }      
    
    const isMatch = await user.isPasswordMatched(password);
    if (!isMatch) {
        console.log("Login failed: Password mismatch", { email });
        return next(new ErrorHandler("Invalid email or password!", 400));
    }
    
    // If role is provided, verify it matches
    if (role && role !== user.role) {
        console.log("Login failed: Incorrect role", { email, requestedRole: role, actualRole: user.role });
        return next(new ErrorHandler("You don't have permission to access this portal!", 400));
    }
    
    console.log("Login successful", { email, userRole: user.role });
    
    // Return the user info along with the token
    generateToken(user, "User Logged in successfully!", 200, res, true);
});

export const addNewAdmin = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic
    ) {
        return next(new ErrorHandler("Please fill all the fields!", 400));
    }
    if (!isValidAadhaar(nic)) {
        return next(new ErrorHandler("Please provide a valid 12-digit Aadhaar number", 400));
    }
    let isRegistered = await User.findOne({ email });
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
    }
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin"
    });
    return res.status(200).json({
        success: true,
        message: "Admin added successfully!",
        admin,
    });
    // generateToken(admin, "Admin added successfully!", 200, res);
});

export const getAllDoctors = catchAsyncError(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    return res.status(200).json({
        success: true,
        message: "Doctors fetched successfully!",
        doctors,
    });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        message: "Patient details fetched successfully!",
        user,
    });
});

export const logoutAdmin = catchAsyncError(async (req, res, next) => {
    res.cookie("adminToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return res.status(200).json({
        success: true,
        message: "Admin logged out successfully!",
    });
});

export const logoutPatient = catchAsyncError(async (req, res, next) => {
    res.cookie("patientToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return res.status(200).json({
        success: true,
        message: "Patient logged out successfully!",
    });
});

export const logoutDoctor = catchAsyncError(async (req, res, next) => {
    res.cookie("doctorToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return res.status(200).json({
        success: true,
        message: "Doctor logged out successfully!",
    });
});

export const addNewDoctor = catchAsyncError(async (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Please upload the Doctor's photo!", 400));
    }
    const { docPhoto } = req.files;
    const allowedFormates = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if(!allowedFormates.includes(docPhoto.mimetype)){
        return next(new ErrorHandler("Please upload jpg, jpeg, webp or png format!", 400));
    }
    const {
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            doctorDepartment
    } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !doctorDepartment
    ) {
        return next(new ErrorHandler("Please fill all the fields!", 400));
    }
    if (nic.trim().length < 2) {
        return next(new ErrorHandler("Qualifications must be at least 2 characters!", 400));
    }
    console.log("Adding doctor with qualifications:", nic);
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`, 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docPhoto.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error:");
    }
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,   
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docPhoto: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor added successfully!",
        doctor
    });
});

export const deleteDoctor = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const doctor = await User.findOne({ _id: id, role: "Doctor" });

    if (!doctor) {
        return next(new ErrorHandler("Doctor not found", 404));
    }

    if (doctor.docPhoto?.public_id) {
        try {
            await cloudinary.uploader.destroy(doctor.docPhoto.public_id);
        } catch (error) {
            console.error("Cloudinary deletion error", error);
        }
    }

    await doctor.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Doctor deleted successfully",
    });
});
