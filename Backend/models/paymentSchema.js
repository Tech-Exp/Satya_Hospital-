import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment',
        required: [true, "Appointment ID is required"]
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // Not required for direct bookings without login
    },
    paymentRefId: {
        type: String,
        required: [true, "Payment reference ID is required"],
        unique: true
    },
    amount: {
        type: Number,
        required: [true, "Payment amount is required"]
    },
    currency: {
        type: String,
        default: "INR"
    },
    description: {
        type: String,
        default: "Appointment Booking Fee"
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
        default: "PENDING"
    },
    paymentMethod: {
        type: String,
        default: "UPI"
    },
    transactionId: {
        type: String,
        // Only available after successful payment
    },
    qrCodeData: {
        type: String,
        // Store QR code data URL
    },
    paymentUrl: {
        type: String,
        // Store payment URL for UPI
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    verifiedAt: {
        type: Date,
        // Only set when payment is verified
    }
}, {
    timestamps: true
});

export const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
