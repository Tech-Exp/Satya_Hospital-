import crypto from 'crypto';
import axios from 'axios';
import qrcode from 'qrcode';

// Configuration for payment gateway
const config = {
  merchantId: process.env.PAYMENT_MERCHANT_ID || 'DEMO_MERCHANT_ID',
  merchantKey: process.env.PAYMENT_MERCHANT_KEY || 'DEMO_MERCHANT_KEY',
  apiEndpoint: process.env.PAYMENT_API_ENDPOINT || 'https://api.demo-payment-gateway.com',
  callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:4000/api/v1/payment/callback',
  defaultAmount: 500, // Default amount in INR (₹500)
  currency: 'INR'
};

/**
 * Generate a unique payment reference ID
 * @param {string} prefix - Prefix for the reference ID (e.g., 'APT' for appointments)
 * @returns {string} A unique reference ID
 */
export const generatePaymentRefId = (prefix = 'APT') => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(4).toString('hex');
  return `${prefix}_${timestamp}_${randomStr}`;
};

/**
 * Create a payment request and generate QR code
 * @param {Object} paymentDetails - Payment details
 * @param {string} paymentDetails.appointmentId - Appointment ID
 * @param {string} paymentDetails.patientName - Patient name
 * @param {number} paymentDetails.amount - Payment amount (optional, defaults to 500)
 * @param {string} paymentDetails.description - Payment description
 * @returns {Promise<Object>} Payment data including QR code
 */
export const createPaymentRequest = async (paymentDetails) => {
  try {
    const {
      appointmentId,
      patientName,
      amount = config.defaultAmount,
      description = 'Appointment Booking Fee'
    } = paymentDetails;

    const paymentRefId = generatePaymentRefId();
    
    // In a real implementation, this would call the payment gateway API
    // For demo purposes, we're generating a simulated payment link
    
    // Create payment data that would be sent to the payment gateway
    const paymentData = {
      merchantId: config.merchantId,
      referenceId: paymentRefId,
      amount: amount,
      currency: config.currency,
      description: `${description} - ${appointmentId}`,
      customerName: patientName,
      callbackUrl: `${config.callbackUrl}?refId=${paymentRefId}&appointmentId=${appointmentId}`,
      timestamp: Date.now()
    };
    
    // Generate a signature (in a real implementation)
    // const signature = crypto.createHmac('sha256', config.merchantKey)
    //   .update(JSON.stringify(paymentData))
    //   .digest('hex');
    
    // paymentData.signature = signature;
    
    // For demo purposes, create a simulated payment URL
    const paymentUrl = `upi://pay?pa=satya.hospital@upi&pn=Satya%20Hospital&am=${amount}.00&cu=INR&tn=${encodeURIComponent(description)}%20-%20${appointmentId}&refId=${paymentRefId}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await qrcode.toDataURL(paymentUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    // In a real implementation, you would store payment details in your database
    // and return the response from the payment gateway
    
    return {
      success: true,
      paymentRefId,
      appointmentId,
      amount,
      currency: config.currency,
      paymentUrl,
      qrCodeDataUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw new Error('Failed to create payment request');
  }
};

/**
 * Verify payment status
 * @param {string} paymentRefId - Payment reference ID
 * @returns {Promise<Object>} Payment verification result
 */
export const verifyPayment = async (paymentRefId) => {
  try {
    // In a real implementation, this would call the payment gateway API to verify payment status
    // For demo purposes, we're returning a simulated successful response
    
    return {
      success: true,
      paymentRefId,
      status: 'SUCCESS',
      transactionId: `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      verifiedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

/**
 * Handle payment callback from payment gateway
 * @param {Object} callbackData - Data received in callback
 * @returns {Promise<Object>} Processed callback result
 */
export const handlePaymentCallback = async (callbackData) => {
  try {
    const { refId, appointmentId, status, transactionId } = callbackData;
    
    // In a real implementation, you would:
    // 1. Verify the callback authenticity (check signature)
    // 2. Update payment status in your database
    // 3. Update appointment status if payment is successful
    
    return {
      success: true,
      paymentRefId: refId,
      appointmentId,
      status,
      transactionId,
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error handling payment callback:', error);
    throw new Error('Failed to process payment callback');
  }
};
