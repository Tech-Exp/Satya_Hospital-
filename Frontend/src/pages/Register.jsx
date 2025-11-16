import React, { useContext, useState } from 'react';
import { Context } from "../main";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaVenusMars, FaLock, FaHospital } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Register.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const { translate } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidAadhaar(nic)) {
      toast.error(translate("Please enter a valid 12-digit Aadhaar number"));
      return;
    }
    try {
       await axios.post("http://localhost:4000/api/v1/user/patient/register", 
        { firstName, lastName, email, phone, nic, dob, gender, password, role : "Patient" },
        { withCredentials: true,
          headers : { "Content-Type": "application/json" },
         }
      )
      .then((res) => {
                toast.success(res.data.message);
                setIsAuthenticated(true);
                navigateTo("/");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setNic("");
                setDob("");
                setGender("");
                setPassword("");
              });
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
    }
  };
  if(isAuthenticated){
    return <Navigate to={"/login"}/>;
  }
  return (
    <div className="register-container">
      <motion.div 
        className="register-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="register-header">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FaHospital size={40} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {translate("Create Your Account")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {translate("Join Satya Hospital for quality healthcare services")}
          </motion.p>
        </div>
        
        <div className="register-body">
          <form onSubmit={handleRegister}>
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="firstName">{translate("First Name")}</label>
                <input 
                  type="text" 
                  id="firstName"
                  placeholder={translate("Enter your first name")}
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                />
                <FaUser className="input-icon" />
              </div>
              
              <div className="register-form-group">
                <label htmlFor="lastName">{translate("Last Name")}</label>
                <input 
                  type="text" 
                  id="lastName"
                  placeholder={translate("Enter your last name")}
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
                />
                <FaUser className="input-icon" />
              </div>
            </div>
            
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="email">{translate("Email Address")}</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder={translate("Enter your email")}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <FaEnvelope className="input-icon" />
              </div>
              
              <div className="register-form-group">
                <label htmlFor="phone">{translate("Phone Number")}</label>
                <input 
                  type="number" 
                  id="phone"
                  placeholder={translate("Enter your phone number")}
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
                <FaPhone className="input-icon" />
              </div>
            </div>
            
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="nic">{translate("Aadhaar Number")}</label>
                <input 
                  type="text" 
                  id="nic"
                  placeholder={translate("Enter your Aadhaar number")} 
                  value={nic} 
                  onChange={(e) => setNic(e.target.value)} 
                  required 
                />
                <FaIdCard className="input-icon" />
              </div>
              
              <div className="register-form-group">
                <label htmlFor="dob">{translate("Date of Birth")}</label>
                <input 
                  type="date" 
                  id="dob"
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                />
                <FaCalendarAlt className="input-icon" />
              </div>
            </div>
            
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="gender">{translate("Gender")}</label>
                <select 
                  id="gender"
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">{translate("Select Gender")}</option>
                  <option value="Male">{translate("Male")}</option>
                  <option value="Female">{translate("Female")}</option>
                  <option value="Other">{translate("Other")}</option>
                </select>
                <FaVenusMars className="input-icon" />
              </div>
              
              <div className="register-form-group">
                <label htmlFor="password">{translate("Password")}</label>
                <input 
                  type="password" 
                  id="password"
                  placeholder={translate("Create a strong password")}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <FaLock className="input-icon" />
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              className="register-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {translate("Create Account")}
            </motion.button>
          </form>
        </div>
        
        <div className="register-footer">
          <div className="register-login-link">
            <span>{translate("Already have an account?")}</span>
            <Link to="/login">{translate("Sign In")}</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
