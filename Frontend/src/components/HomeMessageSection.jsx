import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaHeadset, FaCommentDots } from 'react-icons/fa';
import MessageForm from './MessageForm';
import './HomeMessageSection.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const HomeMessageSection = () => {
  const { translate: t } = useLanguage();
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="home-message-section">
      <div className="message-wave-top">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="message-container container">
        <div className="message-content" style={{overflow : "hidden"}}>
          <motion.div
            className="message-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="message-header">
              <div className="message-icon">
                <FaHeadset />
              </div>
              <h2>{t("Get In Touch With Us")}</h2>
            </div>
            
            <p>
              {t("Have questions about our services or need to schedule an appointment? Our team is here to assist you with all your healthcare needs.")}
            </p>
            
            <div className="contact-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <FaCommentDots />
                </div>
                <div className="feature-text">
                  <h4>{t("Quick Response")}</h4>
                  <p>{t("We respond to all inquiries within 24 hours")}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <FaEnvelope />
                </div>
                <div className="feature-text">
                  <h4>{t("Email Support")}</h4>
                  <p>{t("Contact us anytime at stmckanpur@gmail.com")}</p>
                </div>
              </div>
            </div>
            
            <div className="contact-numbers">
              <div className="contact-number">
                <strong>{t("Emergency:")}</strong> +91-9838951052
              </div>
              <div className="contact-number">
                <strong>{t("Appointments:")}</strong> +91-9838968996
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="message-form-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="form-decoration decoration-1"></div>
            <div className="form-decoration decoration-2"></div>
            
            <h3 className="form-title" style={{overflow : "hidden"}}>{t("Send Us A Message")}</h3>
            <MessageForm />
          </motion.div>
        </div>
      </div>
      
      <div className="message-wave-bottom">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};

export default HomeMessageSection;
