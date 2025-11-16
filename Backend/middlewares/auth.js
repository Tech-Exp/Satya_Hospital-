import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Not Authenticated Admin", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
    }
    next();
});

export const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("Not Authenticated Patient", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Patient"){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
    }
    next();
});

export const isDoctorAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.doctorToken;
    if (!token) {
        return next(new ErrorHandler("Not Authenticated Doctor", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Doctor"){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
    }
    next();
});

// Middleware that allows either admin or patient to access a resource
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    // Check for patient token first
    const patientToken = req.cookies.patientToken;
    const adminToken = req.cookies.adminToken;
    
    if (!patientToken && !adminToken) {
        return next(new ErrorHandler("Not Authenticated", 401));
    }
    
    try {
        if (patientToken) {
            const decoded = jwt.verify(patientToken, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id);
            if (req.user && req.user.role === "Patient") {
                return next();
            }
        }
        
        if (adminToken) {
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id);
            if (req.user && req.user.role === "Admin") {
                return next();
            }
        }
        
        // If we get here, the tokens were invalid or user roles didn't match
        return next(new ErrorHandler("Not authorized", 403));
    } catch (error) {
        return next(new ErrorHandler("Authentication failed", 401));
    }
});