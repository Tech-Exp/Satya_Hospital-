import express from "express";
import { 
    generatePaymentQR,
    checkPaymentStatus,
    paymentCallback
} from "../controller/paymentController.js";

const router = express.Router();

// Generate payment QR code
router.post("/generate-qr", generatePaymentQR);

// Check payment status
router.get("/status/:paymentRefId", checkPaymentStatus);

// Payment gateway callback
router.get("/callback", paymentCallback);
router.post("/callback", paymentCallback);

export default router;
