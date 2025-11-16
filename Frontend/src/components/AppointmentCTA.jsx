import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight, FaTimes } from 'react-icons/fa';
import { Context } from '../main';
import DirectAppointmentForm from './DirectAppointmentForm';
import './AppointmentCTA.css';

const AppointmentCTA = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);
  const [showDirectForm, setShowDirectForm] = useState(false);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show the CTA based on current route
  useEffect(() => {
    // List of paths where we don't want to show the CTA
    const excludedPaths = [
      '/login', 
      '/register', 
      '/appointment',
      '/admin',
      '/doctor/dashboard',
      '/patient/dashboard'
    ];
    
    // Check if current path is in the excluded list
    const isExcludedPath = excludedPaths.some(path => 
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
    
    setShouldShow(!isExcludedPath);
  }, [location.pathname]);

  // Show button after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsButtonVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookNowClick = () => {
    if (isAuthenticated) {
      navigate('/appointment');
    } else {
      // Show direct appointment form instead of login popup
      setShowDirectForm(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  
  const closeDirectForm = () => {
    setShowDirectForm(false);
  };

  // If we shouldn't show the CTA on this page, return null
  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {isButtonVisible && !isPopupOpen && !showDirectForm && (
          <motion.button
            className="appointment-cta-button"
            onClick={handleBookNowClick}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <FaCalendarAlt className="appointment-cta-icon" />
            <span>Book Appointment</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Legacy Popup Modal - Keeping this code commented for future reference */}
      {/* 
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="appointment-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="appointment-popup"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <button className="popup-close-btn" onClick={closePopup}>
                <FaTimes />
              </button>
              
              <div className="popup-header">
                <FaCalendarAlt className="popup-icon" />
                <h2>Book Your Appointment</h2>
              </div>
              
              <div className="popup-content">
                <p>Please sign in or create an account to book an appointment with our specialists.</p>
                
                <div className="popup-buttons">
                  <Link to="/login" className="popup-btn login-btn">
                    Sign In <FaArrowRight />
                  </Link>
                  <Link to="/register" className="popup-btn register-btn">
                    Create Account <FaArrowRight />
                  </Link>
                </div>
                
                <div className="popup-info">
                  <p>Already a patient? Sign in to access your medical records and book appointments quickly.</p>
                  <p>New patient? Create an account to get started with Satya Hospital's comprehensive healthcare services.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      */}
      
      {/* Direct Appointment Form */}
      <DirectAppointmentForm isOpen={showDirectForm} onClose={closeDirectForm} />
    </>
  );
};

export default AppointmentCTA;
