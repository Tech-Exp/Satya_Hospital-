import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import MessageForm from '../components/MessageForm';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, 
  FaClock, FaAmbulance, FaHeadset
} from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext.jsx';

import '../components/MessageForm.css';

const Contact = () => {
  const { translate: t } = useLanguage();
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>{t("Contact Us | Satya Hospital")}</title>
        <meta name="description" content={t("Contact Satya Trauma & Maternity Center for appointments, inquiries, or feedback. Our team is available 24/7 to assist you with your healthcare needs.")} />
      </Helmet>
      
      <div className="contact-container">
        <div className="container"style={{overflow : "hidden"}}>
          <motion.div 
            className="contact-header"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{overflow : "hidden"}}>{t("Get In Touch")}</h1>
            <p>
              {t("We're here to assist you with all your healthcare needs. Whether you have questions about our services, need to schedule an appointment, or want to provide feedback, our team is ready to help.")}
            </p>
          </motion.div>
          
          {/* Emergency Contact Banner */}
          <motion.div
            className="emergency-banner"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, #ff5252 0%, #e33e3e 100%)',
              padding: '20px 30px',
              borderRadius: '15px',
              color: 'white',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(231, 76, 60, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaAmbulance size={36} style={{ marginRight: '15px' }} />
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontWeight: 700, fontSize: '1.5rem' }}>{t("Emergency? Call Now")}</h3>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>{t("Our emergency services are available 24/7")}</p>
              </div>
            </div>
            <a 
              href="tel:+91 9235052100," 
              style={{
                background: 'white',
                color: '#e33e3e',
                padding: '12px 25px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '1.2rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              <FaPhoneAlt style={{ marginRight: '8px' }} /> +91 9235052100
            </a>
          </motion.div>
          
          {/* Contact Information Cards */}
          <motion.div
            className="contact-cards"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px',
              marginBottom: '50px'
            }}
          >
            <div className="contact-card" style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="card-icon" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(57, 57, 217, 0.1) 0%, rgba(179, 224, 0, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaMapMarkerAlt size={30} color="#3939d9" />
              </div>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{t("Visit Us")}</h3>
              <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '15px' }}>
                {t("HIG - 1/3, Barra - 6, Kanpur Nagar,")}<br />
                {t("Uttar Pradesh, India - 208027")}
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#3939d9',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {t("Get Directions")}
              </a>
            </div>
            
            <div className="contact-card" style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="card-icon" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(57, 57, 217, 0.1) 0%, rgba(179, 224, 0, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaPhoneAlt size={30} color="#3939d9" />
              </div>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{t("Call Us")}</h3>
              <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '15px' }}>
                {t("Our friendly staff is available to assist you")}
              </p>
              <a 
                href="tel:+919235052100" 
                style={{
                  color: '#3939d9',
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginBottom: '10px',
                  display: 'block'
                }}
              >
                +91 9235052100 {t("(Main)")}
              </a>
              <a 
                href="tel:+919838951052" 
                style={{
                  color: '#3939d9',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                +91 9838951052 {t("(Appointments)")}
              </a>
            </div>
            
            <div className="contact-card" style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="card-icon" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(57, 57, 217, 0.1) 0%, rgba(179, 224, 0, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FaClock size={30} color="#3939d9" />
              </div>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{t("Working Hours")}</h3>
              <div style={{ color: '#666', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{t("Mon - Fri:")}</span>
                  <span>{t("8:00 AM - 8:00 PM")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{t("Saturday:")}</span>
                  <span>{t("8:00 AM - 5:00 PM")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{t("Sunday:")}</span>
                  <span style={{ color: '#e74c3c' }}>{t("Emergency Only")}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', overflow :"hidden" }}>
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ gridColumn: 'span 1' }}
            >
              <div className="contact-form-container" style={{ height: '100%' }}>
                <h3 className="contact-form-title" style={{ display: 'flex', alignItems: 'center', overflow :"hidden"}}>
                  <FaHeadset style={{ marginRight: '10px'}} /> {t("Send Us A Message")}
                </h3>
                <MessageForm />
              </div>
            </motion.div>
            
            {/* Map */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ gridColumn: 'span 1', overflow : "hidden" }}
            >
              <div className="map-container" style={{ height: '100%', minHeight: '500px'}}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.504276419971!2d80.29275780000002!3d26.439469399999986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47c3cd081a87%3A0x624a166e9d7bbb0a!2sSatya%20Hospital!5e0!3m2!1sen!2sin!4v1763028768240!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Satya Hospital Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
          
          {/* FAQ Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ marginTop: '60px' }}
          >
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '40px',
              color: '#3939d9',
              position: 'relative',
              paddingBottom: '15px'
            }}>
              {t("Frequently Asked Questions")}
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, #3939d9, #b3e000)'
              }}></span>
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
              gap: '25px',
              marginBottom: '50px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ color: '#333', marginBottom: '15px' }}>{t("How do I schedule an appointment?")}</h4>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {t("You can schedule an appointment by calling our appointment desk, using our online booking system, or visiting our hospital in person. Our staff will assist you in finding a suitable time slot.")}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ color: '#333', marginBottom: '15px' }}>{t("What insurance plans do you accept?")}</h4>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {t("We accept most major insurance plans. Please contact our billing department for specific information about your insurance coverage and benefits.")}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ color: '#333', marginBottom: '15px' }}>{t("What should I bring to my appointment?")}</h4>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {t("Please bring your ID, insurance card, list of current medications, and any relevant medical records or test results from previous healthcare providers.")}
                </p>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ color: '#333', marginBottom: '15px' }}>{t("Do you have emergency services?")}</h4>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {t("Yes, our emergency department is open 24/7. For life-threatening emergencies, please call our emergency number or visit the emergency room immediately.")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
