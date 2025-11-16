import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Context } from '../main';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import './AddAdmin.css';

// Icons
import { 
  FaUserShield, FaInfoCircle, FaSave, FaTimes, 
  FaUserCog, FaLock, FaShieldAlt, FaUserPlus,
  FaCheckCircle, FaDatabase
} from 'react-icons/fa';

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

const AddAdmin = () => {
  const { isAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    nic: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For Aadhaar number field, only allow digits
    if (name === 'nic') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: digitsOnly
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.nic.trim()) newErrors.nic = "Aadhaar number is required";
    else if (!isValidAadhaar(formData.nic)) newErrors.nic = "Aadhaar number must be exactly 12 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/admin/addnew",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        gender: "",
        dob: "",
        nic: "",
      });
      setLoading(false);
      
      // Navigate back to dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to add admin");
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== "Admin") {
    return <Navigate to="/patient/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title>Add New Admin | Satya Hospital</title>
        <meta name="description" content="Add a new administrator to Satya Hospital system. Enter admin details and access information." />
      </Helmet>

      <div className="add-admin-container">
        <AdminSidebar />
        
        <motion.div 
          className="add-admin-header"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="add-admin-title">Add New Administrator</h1>
        </motion.div>

        <motion.div 
          className="add-admin-form-container"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Info Panel */}
          <div className="add-admin-info">
            <div className="info-decoration info-decoration-1"></div>
            <div className="info-decoration info-decoration-2"></div>
            
            <div className="info-content">
              <div className="info-icon">
                <FaUserShield />
              </div>
              <h2 className="info-title">Administrator Access</h2>
              <p className="info-subtitle" style={{color:"white"}}>
                Administrators have full access to manage the hospital system, including patients, 
                doctors, appointments, and other administrators.
              </p>
              
              <div className="info-features">
                <div className="info-feature">
                  <div className="feature-icon">
                    <FaUserCog />
                  </div>
                  <div className="feature-text">
                    Full access to all hospital management features
                  </div>
                </div>
                <div className="info-feature">
                  <div className="feature-icon">
                    <FaLock />
                  </div>
                  <div className="feature-text">
                    Ability to add, edit, and remove users and data
                  </div>
                </div>
                <div className="info-feature">
                  <div className="feature-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="feature-text">
                    High-level security clearance and data access
                  </div>
                </div>
                <div className="info-feature">
                  <div className="feature-icon">
                    <FaDatabase />
                  </div>
                  <div className="feature-text">
                    Access to sensitive patient and hospital data
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="add-admin-form">
            <div className="form-header">
              <h3 className="form-title">Administrator Information</h3>
              <p className="form-subtitle">Enter the details of the new administrator</p>
            </div>

            <form onSubmit={handleAddAdmin}>
              <div className="form-body">
                <div className="form-info">
                  <FaInfoCircle className="form-info-icon" />
                  All fields marked with an asterisk (*) are required
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Aadhaar Number *</label>
                      <input
                        type="text"
                        name="nic"
                        placeholder="Enter Aadhaar number (12 digits)"
                        value={formData.nic}
                        onChange={handleInputChange}
                        maxLength="12"
                        className={`form-control ${errors.nic ? 'is-invalid' : ''}`}
                      />
                      {errors.nic && <div className="invalid-feedback">{errors.nic}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                      />
                      {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : <><FaUserPlus /> Add Administrator</>}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddAdmin;