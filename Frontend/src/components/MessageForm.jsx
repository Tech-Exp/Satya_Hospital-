import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserAlt, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const MessageForm = () => {
  const { translate: t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        { firstName, lastName, email, phone, message }, 
        { 
          withCredentials: true, 
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      toast.success(response.data.message);
      setSuccess(true);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("An error occurred. Please try again."));
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <div className="success-message">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <h4>{t("Message Sent Successfully!")}</h4>
            <p>{t("Thank you for reaching out. We will get back to you shortly.")}</p>
            <motion.button 
              className="submit-btn"
              onClick={() => setSuccess(false)}
              style={{ marginTop: '20px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Send Another Message")}
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <form onSubmit={handleMessage}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">{t("First Name")}</label>
              <div style={{ position: 'relative' }}>
                <FaUserAlt style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                <input 
                  type="text" 
                  id="firstName"
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  placeholder={t("Your first name")} 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">{t("Last Name")}</label>
              <div style={{ position: 'relative' }}>
                <FaUserAlt style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                <input 
                  type="text" 
                  id="lastName"
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  placeholder={t("Your last name")} 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="email">{t("Email Address")}</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                <input 
                  type="email" 
                  id="email"
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  placeholder={t("Your email address")} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="phone">{t("Phone Number")}</label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                <input 
                  type="tel" 
                  id="phone"
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  placeholder={t("Your contact number")} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="message">{t("Your Message")}</label>
            <textarea 
              id="message"
              className="form-textarea" 
              placeholder={t("How can we help you? Write your message here...")} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required
              rows="6"
            ></textarea>
          </div>
          
          <motion.button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.05 }}
            whileTap={loading ? {} : { scale: 0.95 }}
          >
            {loading ? t("Sending...") : (
              <>
                <FaPaperPlane className="submit-icon" /> {t("Send Message")}
              </>
            )}
          </motion.button>
        </form>
      )}
    </>
  );
};

export default MessageForm;