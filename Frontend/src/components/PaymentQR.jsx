import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaTimes, FaInfoCircle } from 'react-icons/fa';
import './PaymentQR.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const FALLBACK_QR = '/payment-qr-code.jpeg';

/**
 * PaymentQR Component
 * Displays payment QR code for 2 minutes, then redirects to home page
 * 
 * @param {string} appointmentId - The appointment ID for tracking
 * @param {function} onClose - Callback function when payment modal is closed
 * @param {function} onPaymentSuccess - Callback function when payment is successful
 */
const PaymentQR = ({ appointmentId, onClose, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown (120 seconds)
  const [redirecting, setRedirecting] = useState(false);
  const { translate } = useLanguage();
  const [qrSrc, setQrSrc] = useState('/paymentQr.jpeg');

  // Countdown timer and auto-redirect after 2 minutes
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !redirecting) {
      // Auto-redirect to home page after 2 minutes
      setRedirecting(true);
      
      // Show message before redirecting
      setTimeout(() => {
        navigate('/');
        // Call onClose if provided
        if (onClose) {
          onClose();
        }
      }, 1000);
    }
  }, [countdown, navigate, onClose, redirecting]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle manual close
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // If no onClose callback, navigate to home
      navigate('/');
    }
  };

  return (
    <div className="payment-qr-overlay">
      <motion.div 
        className="payment-qr-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <button className="payment-qr-close" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className="payment-qr-header">
          <h2>{translate("Scan & Pay")}</h2>
          <p>{translate("Scan the QR code with any UPI app to complete payment")}</p>
        </div>
        
        <div className="payment-qr-content">
          <div className="payment-qr-two-column">
            {/* Left Side */}
            <div className="payment-qr-left">
              <div className="payment-qr-amount">
                <FaRupeeSign /> 500
              </div>
              
              {appointmentId && (
                <div className="payment-appointment-info">
                  <span>{translate("Appointment Number:")}</span>
                  <strong>{appointmentId}</strong>
                </div>
              )}
              
              <div className="payment-qr-image">
                <img 
                  src={qrSrc} 
                  alt="Payment QR Code - Scan & Pay"
                  onError={() => setQrSrc(FALLBACK_QR)}
                />
              </div>
            </div>
            
            {/* Right Side */}
            <div className="payment-qr-right">
              <div className="payment-qr-message">
                <FaInfoCircle className="message-icon" />
                <p className="payment-instruction-text">
                  {translate("After payment is successfully completed, please send the payment screenshot and appointment number and call to this number:")} {" "}
                  <strong>9838951052 || 9235052100</strong>
                </p>
              </div>
              
              {appointmentId && (
                <div className="payment-appointment-info-right">
                  <span>{translate("Appointment Number:")}</span>
                  <strong>{appointmentId}</strong>
                </div>
              )}
              
              <div className="payment-qr-instructions">
                <ol>
                  <li>{translate("Open any UPI app (Google Pay, PhonePe, Paytm, etc.)")}</li>
                  <li>{translate("Scan the QR code above")}</li>
                  <li>{translate("Complete the payment")}</li>
                  <li>
                    {translate("Send payment screenshot and appointment number to")} {" "}
                    <strong>9838951052</strong> {translate("or call this number")}
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="payment-qr-timer">
            <p>{translate("Redirecting to home in:")} <span>{formatTime(countdown)}</span></p>
          </div>
          
          {redirecting && (
            <div className="payment-redirecting">
              <p>{translate("Redirecting to home page...")}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentQR;
