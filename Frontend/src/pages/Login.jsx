import React, { useContext, useState } from 'react'
import { Context } from '../main';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaHospital } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Login.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { translate } = useLanguage();

  const navigateTo = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
     // Initial login - we'll let the server validate credentials
     const response = await axios.post("http://localhost:4000/api/v1/user/login", 
        { email, password },
        { 
          withCredentials: true,
          headers : { "Content-Type": "application/json" },
         }
      );
      
      // Get the user's role from the response
      const userRole = response.data.user.role;
      console.log("Login successful - User role:", userRole);
      console.log("User data:", response.data.user);
      
      // Update authentication state with user data
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success(response.data.message);
      
      // Redirect based on detected user role
      if (userRole === "Admin") {
        // Redirect to admin dashboard page
        navigateTo("/admin/dashboard");
      } else if (userRole === "Doctor") {
        // Redirect to doctor dashboard page
        navigateTo("/doctor/dashboard");
      } else {
        // Regular patient redirect
        navigateTo("/patient/dashboard");
      }
      
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
    }
  };

  // Check if user is already authenticated and redirect based on role
  if (isAuthenticated) {
    if (user && user.role === "Admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user && user.role === "Doctor") {
      return <Navigate to="/doctor/dashboard" />;
    }
    return <Navigate to="/patient/dashboard" />;
  }
  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-header">
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
            {translate("Welcome Back")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {translate("Sign in to continue to Satya Hospital")}
          </motion.p>
        </div>
        
        <div className="login-body">
          <form onSubmit={handleLogin}>
            <div className="login-form-group">
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
            
            <div className="login-form-group">
              <label htmlFor="password">{translate("Password")}</label>
              <input 
                type="password" 
                id="password"
                placeholder={translate("Enter your password")}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <FaLock className="input-icon" />
            </div>

            <motion.button 
              type="submit" 
              className="login-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {translate("Sign In")}
            </motion.button>
          </form>
        </div>
        
        {/* Login footer removed as requested */}
      </motion.div>
    </div>
  );
};

export default Login;
