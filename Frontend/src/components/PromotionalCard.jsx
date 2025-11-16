import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PromotionalCard.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const PROMOTIONAL_IMAGES = [
  '06 Nov.png',
  '05 Nov (2).png',
  '4.png',
  '26 Oct.png',
  '25 Oct.png',
  '21 Oct.png',
  'WhatsApp Image 2025-11-08 at 02.11.22_07ead7d1.jpg',
  'Robotics.png',
];

const PromotionalCard = () => {
  const [show, setShow] = useState(false);
  const [cardImage, setCardImage] = useState('');
  const navigate = useNavigate();
  const { translate } = useLanguage();

  useEffect(() => {
    // ✅ Pick a random image each time page is refreshed
    const pickRandomImage = () => {
      if (PROMOTIONAL_IMAGES.length === 0) return '/image.png';

      const randomIndex = Math.floor(Math.random() * PROMOTIONAL_IMAGES.length);
      const selectedImage = PROMOTIONAL_IMAGES[randomIndex];

      // Handle backend URL if defined
      const configuredBaseUrl = import.meta.env?.VITE_BACKEND_URL;
      const isLocalDev =
        typeof window !== 'undefined' &&
        window.location.origin.includes('localhost');
      const devFallbackBase = isLocalDev ? 'http://localhost:4000' : '';
      const baseUrl = (configuredBaseUrl || devFallbackBase || '').replace(/\/$/, '');

      // Build full path or fallback to public folder
      if (!baseUrl) {
        return `/public/${encodeURIComponent(selectedImage)}`;
      }

      return `${baseUrl}/public/${encodeURIComponent(selectedImage)}`;
    };

    // Set random image on mount
    setCardImage(pickRandomImage());

    // Show popup after 1 second
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setShow(false);

  const handleBookAppointment = () => {
    setShow(false);
    navigate('/appointment');
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="promo-card-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            className="promo-card-container"
            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ position: 'fixed', top: '50%', left: '50%' }}
          >
            {/* Close Button */}
            <button className="promo-card-close" onClick={handleClose}>
              <FaTimes />
            </button>

            {/* Card Content */}
            <div className="promo-card-content" >
              {/* Header */}
              <div className="promo-card-header">
                <div className="promo-card-title-section">
                  <h2 className="promo-card-subtitle">{translate("Satya Hospital")}</h2>
                  <p className="promo-card-doctor">
                    {translate("Experience Precision Healing by Dr. A.K Agrawal")}
                  </p>
                </div>

              </div>

              {/* Image Section */}
              <div className="promo-card-image-section">
                <img
                  src={cardImage}
                  alt="Satya Hospital Promotion"
                  className="promo-card-main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/image.png'; // fallback
                  }}
                />
              </div>

              {/* Footer Section */}
              <div className="promo-card-footer">
                <div className="promo-card-footer-row">
                  {/* Hospital Info */}
                  <div className="promo-card-hospital-info">
                    <div className="hospital-logo-section">
                      <div className="hospital-logo">
                        <span className="logo-s">S</span>
                        <span className="logo-text">atya</span>
                      </div>
                      <p className="hospital-type">{translate("Satya Trauma & Maternity Center")}</p>
                    </div>

                    <div className="promo-card-contact">
                      <div className="contact-address">
                        <p>
                          {translate("Hospital: HIG - 1/3 Barra - 6, Kanpur Nagar - 208027, Uttar Pradesh")}
                        </p>
                      </div>
                      <div className="contact-numbers">
                        <p>
                          <FaPhone className="contact-icon" /> {translate("Book Consultation : 9278097100")}
                        </p>
                        <p>
                          <FaPhone className="contact-icon" /> {translate("For Appointment : 9235052100, 9838951052")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="promo-card-cta-btn" onClick={handleBookAppointment}>
                  {translate("Book Appointment Now")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromotionalCard;
