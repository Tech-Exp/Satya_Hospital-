import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaArrowRight } from 'react-icons/fa';
import { Context } from '../main';
import DirectAppointmentForm from './DirectAppointmentForm';
import './Hero.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Hero = ({ title, imageUrl }) => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const [showDirectForm, setShowDirectForm] = useState(false);
  const { translate } = useLanguage();

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      navigate('/appointment');
    } else {
      // Show direct appointment form instead of redirecting to login
      setShowDirectForm(true);
    }
  };
  
  const closeDirectForm = () => {
    setShowDirectForm(false);
  };

  return (
    <>
      <div className='hero container'>
        <div className="banner">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {translate(title, title)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {translate("Providing the best care of Your Health and give the Treatment by the expert Doctors.")}
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button 
              className="hero-appointment-btn"
              onClick={handleBookAppointment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCalendarCheck /> {translate("Book Appointment")} <FaArrowRight />
            </motion.button>
            <p className="hero-cta-note">{translate("Quick and easy appointment booking with our specialists")}</p>
          </motion.div>
        </div>
        
        <div className="banner" style={{overflow : "hidden"}}>
          <motion.img 
            src={imageUrl} 
            alt="Hospital Image" 
            className="animated-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <img src="/Vector.png" alt="Background Image" className="logo-image" />
          </motion.span>
        </div>
      </div>
      
      {/* Direct Appointment Form */}
      <DirectAppointmentForm isOpen={showDirectForm} onClose={closeDirectForm} />
    </>
  )
}

export default Hero
