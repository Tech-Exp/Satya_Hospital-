import { catchAsyncError } from "../middlewares/catchAsyncError.js ";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment, generateAppointmentNumber } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";
import { sendEmail, getBookingEmailTemplate, getApprovalEmailTemplate, getRejectionEmailTemplate, getDirectBookingEmailTemplate } from "../utils/sendEmail.js";

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

export const bookAppointment = catchAsyncError(async (req, res, next) => {
    // if(!req.body){
    //         return next(new ErrorHandler("Request Body is Missing!", 400));
    //     }
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    if (!isValidAadhaar(nic)) {
        return next(new ErrorHandler("Please provide a valid 12-digit Aadhaar number", 400));
    }
    const isConflict = await User.find({
        firstName : doctor_firstName,
        lastName : doctor_lastName,
        role: "Doctor",
        doctorDepartment: department
    });
    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor Not Found", 404));
    }
    if (isConflict.length > 1) {
        return next(new ErrorHandler("Multiple doctors found with the same name in the specified department. Please Contact Through Email or Phone !!", 400));
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    
    // Generate unique appointment number
    const appointmentNumber = await generateAppointmentNumber();
    
    const appointment = await Appointment.create({
        appointmentNumber,
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId
    });

    // Send confirmation email to patient
    try {
        const doctorFullName = `${doctor_firstName} ${doctor_lastName}`;
        const emailTemplate = getBookingEmailTemplate(
            firstName, 
            lastName, 
            appointment_date, 
            department, 
            doctorFullName,
            appointment.appointmentNumber // Pass the appointment number (STH format)
        );
        
        await sendEmail({
            email: email, // User's email from request
            subject: "Appointment Confirmation - Satya Trauma & Maternity Center",
            message: emailTemplate
        });
        
        console.log(`Confirmation email sent to ${email} for appointment ${appointment.appointmentNumber}`);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        // Don't return error to client, just log it
    }

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment,
    });
});

// New function to book multiple appointments
export const bookMultipleAppointments = catchAsyncError(async (req, res, next) => {
    const { appointments } = req.body;
    
    if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
        return next(new ErrorHandler("Please provide valid appointments array", 400));
    }

    const patientId = req.user._id;
    const createdAppointments = [];
    const errors = [];

    // Process each appointment
    for (const appointmentData of appointments) {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                nic,
                dob,
                gender,
                appointment_date,
                department,
                doctor_firstName,
                doctor_lastName,
                hasVisited,
                address,
            } = appointmentData;

            // Validate required fields
            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !nic ||
                !dob ||
                !gender ||
                !appointment_date ||
                !department ||
                !doctor_firstName ||
                !doctor_lastName ||
                !address
            ) {
                errors.push(`Appointment for ${appointment_date} is missing required fields`);
                continue;
            }

            if (!isValidAadhaar(nic)) {
                errors.push(`Invalid Aadhaar number for appointment on ${appointment_date}`);
                continue;
            }

            // Find doctor
            const isConflict = await User.find({
                firstName: doctor_firstName,
                lastName: doctor_lastName,
                role: "Doctor",
                doctorDepartment: department
            });

            if (isConflict.length === 0) {
                errors.push(`Doctor not found for appointment on ${appointment_date}`);
                continue;
            }

            if (isConflict.length > 1) {
                errors.push(`Multiple doctors found with the same name in ${department}`);
                continue;
            }

            const doctorId = isConflict[0]._id;
            
            // Generate unique appointment number
            const appointmentNumber = await generateAppointmentNumber();
            
            // Create appointment
            const appointment = await Appointment.create({
                appointmentNumber,
                firstName,
                lastName,
                email,
                phone,
                nic,
                dob,
                gender,
                appointment_date,
                department,
                doctor: {
                    firstName: doctor_firstName,
                    lastName: doctor_lastName,
                },
                hasVisited,
                address,
                doctorId,
                patientId
            });

            // Send confirmation email
            try {
                const doctorFullName = `${doctor_firstName} ${doctor_lastName}`;
                const emailTemplate = getBookingEmailTemplate(
                    firstName, 
                    lastName, 
                    appointment_date, 
                    department, 
                    doctorFullName,
                    appointment.appointmentNumber // Pass the appointment number (STH format)
                );
                
                await sendEmail({
                    email: email,
                    subject: "Appointment Confirmation - Satya Trauma & Maternity Center",
                    message: emailTemplate
                });
                
                console.log(`Confirmation email sent to ${email} for appointment ${appointment.appointmentNumber}`);
            } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
                // Don't stop processing for email errors
            }

            createdAppointments.push(appointment);
        } catch (error) {
            errors.push(`Failed to book appointment: ${error.message}`);
        }
    }

    res.status(201).json({
        success: true,
        message: createdAppointments.length > 0 
            ? `Successfully booked ${createdAppointments.length} appointments` 
            : "No appointments were booked",
        appointmentsCreated: createdAppointments.length,
        totalRequested: appointments.length,
        appointments: createdAppointments,
        errors: errors.length > 0 ? errors : undefined
    });
});

export const getAllAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments
    });
});

export const updateAppointmentStatus = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found", 404));
    }
    
    const previousStatus = appointment.status;
    const newStatus = req.body.status;
    
    appointment = await Appointment.findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true, 
        useFindAndModify: false 
    });
    
    // Only send email if status is changing to Accepted or Rejected
    if (previousStatus !== newStatus && (newStatus === 'Accepted' || newStatus === 'Rejected')) {
        try {
            const { firstName, lastName, email, appointment_date, department, doctor } = appointment;
            const doctorFullName = `${doctor.firstName} ${doctor.lastName}`;
            
            // Choose template based on new status
            let emailTemplate;
            let emailSubject;
            
            if (newStatus === 'Accepted') {
                emailTemplate = getApprovalEmailTemplate(firstName, lastName, appointment_date, department, doctorFullName, appointment.appointmentNumber);
                emailSubject = "Appointment Approved - Satya Trauma & Maternity Center";
            } else if (newStatus === 'Rejected') {
                emailTemplate = getRejectionEmailTemplate(firstName, lastName, appointment_date, department, doctorFullName, appointment.appointmentNumber);
                emailSubject = "Appointment Not Approved - Satya Trauma & Maternity Center";
            }
            
            // Send email notification
            if (emailTemplate) {
                await sendEmail({
                    email: email, // Use the email from appointment
                    subject: emailSubject,
                    message: emailTemplate
                });
                
                console.log(`Status update email (${newStatus}) sent to ${email}`);
            }
        } catch (error) {
            console.error("Error sending status update email:", error);
            // Don't return error to client, just log it
        }
    }
    
    res.status(200).json({
        success: true,
        message: "Appointment Status Updated Successfully",
        appointment
    });
});

export const deleteAppointment = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    const appointment = await Appointment.findById(id);
    
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found", 404));
    }
    
    // Admin can delete any appointment
    if(req.user.role === "Admin") {
        await Appointment.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Appointment Deleted Successfully!!"
        });
    }
    
    // Check if the appointment belongs to the requesting patient
    if(appointment.patientId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not authorized to delete this appointment", 403));
    }
    
    // Check if the appointment status is Pending
    if(appointment.status !== "Pending") {
        return next(new ErrorHandler("Only pending appointments can be cancelled by patients", 400));
    }
    
    // Delete the appointment
    await Appointment.findByIdAndDelete(id);
    
    res.status(200).json({
        success: true,
        message: "Appointment Cancelled Successfully!!"
    });
});

export const getPatientAppointments = catchAsyncError(async (req, res, next) => {
    const patientId = req.user._id;
    
    console.log("Fetching appointments for patient ID:", patientId);
    
    const appointments = await Appointment.find({ patientId });
    
    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments
    });
});

// Direct appointment booking without requiring authentication
export const directBookAppointment = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        address,
        hasVisited
    } = req.body;

    // Validate required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !address
    ) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    // Doctor is required only if department is not "Other"
    if (department !== "Other" && (!doctor_firstName || !doctor_lastName)) {
        return next(new ErrorHandler("Please select a doctor for this department", 400));
    }

    if (!isValidAadhaar(nic)) {
        return next(new ErrorHandler("Please provide a valid 12-digit Aadhaar number", 400));
    }

    try {
        let doctorId = null;
        let doctorFirstName = "";
        let doctorLastName = "";

        // Only check for doctor if department is not "Other"
        if (department !== "Other") {
            // Check if the doctor exists
            const isConflict = await User.find({
                firstName: doctor_firstName,
                lastName: doctor_lastName,
                role: "Doctor",
                doctorDepartment: department
            });

            if (isConflict.length === 0) {
                return next(new ErrorHandler("Doctor Not Found", 404));
            }

            if (isConflict.length > 1) {
                return next(new ErrorHandler("Multiple doctors found with the same name in the specified department. Please Contact Through Email or Phone !!", 400));
            }

            doctorId = isConflict[0]._id;
            doctorFirstName = doctor_firstName;
            doctorLastName = doctor_lastName;
        } else {
            // For "Other" department, use placeholder values
            doctorFirstName = "To be assigned";
            doctorLastName = "by hospital";
        }
        
        // Create a temporary patient ID (for database schema compatibility)
        const tempPatientId = new mongoose.Types.ObjectId();

        // Generate unique appointment number
        const appointmentNumber = await generateAppointmentNumber();

        // Create the appointment with pending status
        const appointment = await Appointment.create({
            appointmentNumber,
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor: {
                firstName: doctorFirstName,
                lastName: doctorLastName,
            },
            doctorId: doctorId || tempPatientId, // Use tempPatientId as fallback if no doctor
            patientId: tempPatientId, // Using temporary ID
            address,
            hasVisited,
            status: "Pending" // All direct bookings start as pending
        });

        // Send confirmation email
        try {
            const doctorFullName = department === "Other" 
                ? "To be assigned by hospital" 
                : `${doctorFirstName} ${doctorLastName}`;
            const emailTemplate = getDirectBookingEmailTemplate(
                firstName,
                lastName,
                appointment_date,
                department,
                doctorFullName,
                appointment.appointmentNumber // Pass the appointment number (STH format)
            );

            await sendEmail({
                email: email,
                subject: "Appointment Request - Satya Trauma & Maternity Center",
                message: emailTemplate
            });

            console.log(`Direct booking confirmation email sent to ${email} for appointment ${appointment.appointmentNumber}`);
        } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            // Don't stop processing for email errors
        }

        res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully. We will contact you shortly.",
            appointment
        });
    } catch (error) {
        console.error("Direct booking error:", error);
        return next(new ErrorHandler(error.message || "Failed to book appointment", 500));
    }
});

export const getDoctorAppointments = catchAsyncError(async (req, res, next) => {
    const doctorId = req.user._id;
    const doctorFirstName = req.user.firstName;
    const doctorLastName = req.user.lastName;
    const { date, status } = req.query;
    
    console.log("Fetching appointments for doctor:", doctorFirstName, doctorLastName, "ID:", doctorId);
    
    // Build query - use both doctorId and doctor name fields for maximum compatibility
    // This handles both old appointments (using doctor names) and new ones (using doctorId)
    const query = {
        $or: [
            { doctorId },
            { 
                "doctor.firstName": doctorFirstName,
                "doctor.lastName": doctorLastName
            }
        ]
    };
    
    // Add date filter if provided
    if (date) {
        try {
            // Parse the date string
            const dateObj = new Date(date);
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                console.error("Invalid date format:", date);
                return next(new ErrorHandler("Invalid date format", 400));
            }
            
            // Format the date as YYYY-MM-DD for string comparison
            const formattedDate = dateObj.toISOString().split('T')[0];
            console.log("Filtering by date:", formattedDate);
            
            // Since appointment_date is stored as a string, we can use string comparison
            // This is more reliable than Date object comparison for string-stored dates
            query.appointment_date = { $regex: new RegExp('^' + formattedDate) };
        } catch (error) {
            console.error("Error parsing date:", error);
            return next(new ErrorHandler("Invalid date format", 400));
        }
    }
    
    // Add status filter if provided
    if (status && status !== 'all') {
        query.status = status;
    } else if (!status || status === 'all') {
        // By default, only show accepted appointments to doctors
        query.status = "Accepted";
    }
    
    console.log("Final query:", JSON.stringify(query, null, 2));
    
    // Get appointments and populate doctor details
    const appointments = await Appointment.find(query).sort({ appointment_date: 1 });
    
    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments
    });
});

// Update appointment status by doctor (can change Pending to Completed)
export const updateAppointmentStatusByDoctor = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;
    
    let appointment = await Appointment.findById(id);
    
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found", 404));
    }
    
    // Verify that the appointment belongs to this doctor
    const isDoctorAppointment = appointment.doctorId.toString() === doctorId.toString() ||
        (appointment.doctor.firstName === req.user.firstName && 
         appointment.doctor.lastName === req.user.lastName);
    
    if(!isDoctorAppointment){
        return next(new ErrorHandler("You are not authorized to update this appointment", 403));
    }
    
    // Doctors can only change status to Completed or Accepted
    if(status !== "Completed" && status !== "Accepted"){
        return next(new ErrorHandler("Doctors can only change status to Completed or Accepted", 400));
    }
    
    const previousStatus = appointment.status;
    appointment.status = status;
    appointment = await appointment.save();
    
    res.status(200).json({
        success: true,
        message: `Appointment status updated to ${status} successfully`,
        appointment
    });
});