import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Payment } from "../models/paymentSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import { createPaymentRequest, verifyPayment, handlePaymentCallback } from "../utils/paymentUtils.js";
import { sendEmail, getPaymentConfirmationEmailTemplate } from "../utils/sendEmail.js";

/**
 * Generate payment QR code for an appointment
 */
export const generatePaymentQR = catchAsyncError(async (req, res, next) => {
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
        return next(new ErrorHandler("Appointment ID is required", 400));
    }
    
    try {
        // Find the appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return next(new ErrorHandler("Appointment not found", 404));
        }
        
        // Check if payment already exists for this appointment
        const existingPayment = await Payment.findOne({ appointmentId });
        if (existingPayment && existingPayment.status === "SUCCESS") {
            return res.status(200).json({
                success: true,
                message: "Payment already completed for this appointment",
                payment: existingPayment
            });
        }
        
        // Generate payment request
        const patientName = `${appointment.firstName} ${appointment.lastName}`;
        const paymentDetails = {
            appointmentId,
            patientName,
            amount: 500, // Fixed amount of ₹500
            description: "Appointment Booking Fee"
        };
        
        const paymentData = await createPaymentRequest(paymentDetails);
        
        // Save payment details to database
        let payment;
        if (existingPayment) {
            // Update existing payment
            payment = await Payment.findByIdAndUpdate(
                existingPayment._id,
                {
                    paymentRefId: paymentData.paymentRefId,
                    status: "PENDING",
                    qrCodeData: paymentData.qrCodeDataUrl,
                    paymentUrl: paymentData.paymentUrl,
                    paymentDate: new Date()
                },
                { new: true }
            );
        } else {
            // Create new payment
            payment = await Payment.create({
                appointmentId,
                patientId: appointment.patientId,
                paymentRefId: paymentData.paymentRefId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                qrCodeData: paymentData.qrCodeDataUrl,
                paymentUrl: paymentData.paymentUrl
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Payment QR code generated successfully",
            payment: {
                _id: payment._id,
                appointmentId: payment.appointmentId,
                paymentRefId: payment.paymentRefId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                qrCodeData: payment.qrCodeData,
                paymentUrl: payment.paymentUrl
            }
        });
    } catch (error) {
        console.error("Error generating payment QR:", error);
        return next(new ErrorHandler("Failed to generate payment QR code", 500));
    }
});

/**
 * Check payment status
 */
export const checkPaymentStatus = catchAsyncError(async (req, res, next) => {
    const { paymentRefId } = req.params;
    
    if (!paymentRefId) {
        return next(new ErrorHandler("Payment reference ID is required", 400));
    }
    
    try {
        // Find the payment
        const payment = await Payment.findOne({ paymentRefId });
        if (!payment) {
            return next(new ErrorHandler("Payment not found", 404));
        }
        
        // In a real implementation, check with payment gateway
        // For demo purposes, we'll simulate a successful verification
        const verificationResult = await verifyPayment(paymentRefId);
        
        if (verificationResult.success) {
            // Update payment status
            payment.status = verificationResult.status;
            payment.transactionId = verificationResult.transactionId;
            payment.verifiedAt = new Date();
            await payment.save();
            
            // If payment is successful, update appointment status
            if (payment.status === "SUCCESS") {
                const appointment = await Appointment.findById(payment.appointmentId);
                if (appointment) {
                    // Don't change status if it's already been reviewed by admin
                    if (appointment.status === "Pending") {
                        appointment.paymentStatus = "PAID";
                        await appointment.save();
                    }
                }
            }
        }
        
        res.status(200).json({
            success: true,
            message: `Payment status: ${payment.status}`,
            payment: {
                _id: payment._id,
                appointmentId: payment.appointmentId,
                paymentRefId: payment.paymentRefId,
                amount: payment.amount,
                status: payment.status,
                transactionId: payment.transactionId,
                verifiedAt: payment.verifiedAt
            }
        });
    } catch (error) {
        console.error("Error checking payment status:", error);
        return next(new ErrorHandler("Failed to check payment status", 500));
    }
});

/**
 * Handle payment callback from payment gateway
 */
export const paymentCallback = catchAsyncError(async (req, res, next) => {
    const callbackData = req.query; // For GET callback
    // const callbackData = req.body; // For POST callback
    
    try {
        const result = await handlePaymentCallback(callbackData);
        
        // Update payment in database
        const payment = await Payment.findOne({ paymentRefId: result.paymentRefId });
        if (payment) {
            payment.status = result.status;
            payment.transactionId = result.transactionId;
            payment.verifiedAt = new Date();
            await payment.save();
            
            // Update appointment if payment is successful
            if (payment.status === "SUCCESS") {
                const appointment = await Appointment.findById(payment.appointmentId);
                if (appointment) {
                    appointment.paymentStatus = "PAID";
                    await appointment.save();
                    
                    // Send email notification
                    try {
                        const emailTemplate = getPaymentConfirmationEmailTemplate(
                            appointment.firstName,
                            appointment.lastName,
                            appointment._id,
                            payment.amount,
                            payment.transactionId,
                            appointment.appointment_date,
                            appointment.department,
                            `Dr. ${appointment.doctor_firstName} ${appointment.doctor_lastName}`
                        );
                        
                        await sendEmail({
                            email: appointment.email,
                            subject: "Payment Confirmation - Satya Hospital",
                            message: emailTemplate
                        });
                    } catch (emailError) {
                        console.error("Error sending payment confirmation email:", emailError);
                    }
                }
            }
        }
        
        // Respond based on callback type (redirect for web, JSON for API)
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            // Redirect to a payment success/failure page
            res.redirect(`/payment/status?ref=${result.paymentRefId}&status=${result.status}`);
        } else {
            res.status(200).json({
                success: true,
                message: "Payment callback processed successfully",
                result
            });
        }
    } catch (error) {
        console.error("Error processing payment callback:", error);
        
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            res.redirect('/payment/error');
        } else {
            return next(new ErrorHandler("Failed to process payment callback", 500));
        }
    }
});
