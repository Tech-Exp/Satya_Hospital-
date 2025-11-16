import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaLink,
  FaYoutube
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import './Footer.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { translate } = useLanguage();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer-container">
      <div className="footer-wave">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-grid"style={{overflow : "hidden"}}>
          {/* Hospital Info Column */}
          <motion.div 
            className="footer-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Satya Hospital Logo" />
            </Link>
            <h3 className="hospital-name">{translate("Satya Trauma & Maternity Center")}</h3>
            <p className="hospital-address">
              {translate("Satya Chowk, Barra 6, Kanpur - 208027, Uttar Pradesh")}
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/satyahospitals/" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="https://x.com/stmckanpur" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/satya_hospitals/" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/@satyahospitalkanpur" className="social-icon">
                <FaYoutube />
              </a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div 
            className="footer-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="footer-heading">{translate("Quick Links")}</h3> <br />
            <ul className="footer-links">
              <li><Link to="/">{translate("Home")}</Link></li>
              <li><Link to="/about">{translate("About Us")}</Link></li>
              <li><Link to="/doctors">{translate("Doctor's")}</Link></li>
              <li><Link to="/appointment">{translate("Book Appointment")}</Link></li>
              <li><Link to="/services">{translate("Services")}</Link></li>
              <li><Link to="/contact">{translate("Contact Us")}</Link></li>
            </ul>
          </motion.div>

          {/* Working Hours Column */}
          <motion.div 
            className="footer-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="footer-heading">
              <FaClock style={{ marginRight: '8px' }} /> 
              {translate("Our Presence 24/7")}
              <span className="presence-badge">{translate("Always Open")}</span>
            </h3>
            <ul className="footer-schedule">
              <li>
                <span className="day">{translate("Monday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Tuesday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Wednesday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Thursday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Friday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Saturday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
              <li>
                <span className="day">{translate("Sunday")}</span>
                <span className="hours">{translate("24 Hours")}</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact Us Column */}
          <motion.div 
            className="footer-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="footer-heading">{translate("Contact Us")}</h3>
            <ul className="contact-list">
              <li className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-text">
                  <a href="tel:+919278097100" className="contact-link">+91-9278097100</a>
                </div>
              </li>
              
              <li className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-text">
                  <a href="tel:+919450332121" className="contact-link">+91-9450332121</a>
                </div>
              </li>
              
              <li className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-text">
                  <a href="tel:+919838951052" className="contact-link">+91-9838951052</a>
                </div>
              </li>

              <li className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-text">
                  <a href="tel:+919235052100" className="contact-link">+91-9235052100</a>
                </div>
              </li>
              
              <li className="contact-item">
                <div className="contact-icon">
                  <MdEmail />
                </div>
                <div className="contact-text">
                  <a href="mailto:stmckanpur@gmail.com" className="contact-link">stmckanpur@gmail.com</a>
                </div>
              </li>
              
              <li className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-text">
                  {translate("Hospital: Satya Hospital, Satya Chowk, Barra 6, Kanpur Nagar - 208027, Uttar Pradesh, India")}
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          {translate("Made By")} <span className="copyright-highlight">Awaneesh Kushwaha</span> || 
          <span className="copyright-year"> © {currentYear}</span> {translate("Satya Hospital")} || 
          <span className="copyright-highlight"> {translate("All rights reserved.")}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;