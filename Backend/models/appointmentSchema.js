import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    appointmentNumber: {
        type: String,
        unique: true,
        required: [true, "Appointment number is required"],
        validate: {
            validator: (value) => /^STH\d{6}$/.test(value),
            message: "Appointment number must be in format STH followed by 6 digits"
        }
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must be at least 3 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minLength: [3, "Last name must be at least 3 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        minLength: [10, "Phone number must be at least 10 digits"],
        maxLength: [10, "Phone number must be at most 10 digits"],
    },
    nic: {
        type: String,
        required: [true, "Aadhaar is required"],
        validate: {
            validator: (value) => /^\d{12}$/.test(value),
            message: "Aadhaar must contain exactly 12 digits"
        }
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"],
    },
    appointment_date: {
        type: String,
        required: [true, "Appointment date is required"],
    },
    department: {
        type: String,
        required: [true, "Department is required"],
    },
    doctor: {
        firstName: {
            type: String,
            required: function() {
                // Doctor name is required only if department is not "Other"
                return this.department !== "Other";
            },
        },
        lastName: {
            type: String,
            required: function() {
                // Doctor name is required only if department is not "Other"
                return this.department !== "Other";
            },
        },
    },
    hasVisited: {
        type: Boolean,
        default: false,
        // required: true,
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: function() {
            // Doctor ID is required only if department is not "Other"
            return this.department !== "Other";
        },
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Patient ID is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Cancelled", "Accepted", "Completed"],
        default: "Pending",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);

// Function to generate unique appointment number
export const generateAppointmentNumber = async () => {
    let appointmentNumber;
    let isUnique = false;
    
    while (!isUnique) {
        // Generate random 6-digit number
        const randomNum = Math.floor(100000 + Math.random() * 900000); // 100000 to 999999
        appointmentNumber = `STH${randomNum}`;
        
        // Check if it already exists
        const existing = await Appointment.findOne({ appointmentNumber });
        if (!existing) {
            isUnique = true;
        }
    }
    
    return appointmentNumber;
};

export default Appointment;
