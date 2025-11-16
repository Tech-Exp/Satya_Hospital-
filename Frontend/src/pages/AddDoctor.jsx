import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Context } from '../main';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import './AddDoctor.css';

// Icons
import { 
  FaUserMd, FaUpload, FaInfoCircle, FaSave, 
  FaTimes, FaArrowLeft, FaHospital
} from 'react-icons/fa';

const AddDoctor = () => {
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
    doctorDepartment: "",
  });
  const [docPhoto, setDocPhoto] = useState("");
  const [previewImage, setPreviewImage] = useState("/doc.png");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const departmentArray = [
        "ORTHOPAETDICS",
        "OBS & GYNAECOLOGY",
        "MEDICINE",
        "SPINE AND NEUROSURGERY",
        "PAEDIATRICS",
        "RADIOLOGY",
        "GENERAL & LAPROSCOPIC SURGERY",
        "PLASTIC SURGERY",
        "EAR, NOSE & THROAT (ENT)",
        "ONCO SURGERY",
        "GASTRO & LAPROSCOPIC SURGERY",
        "DERMATOLOGISTS",
        "OTHER",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error when field is edited
      if (errors.docPhoto) {
        setErrors({
          ...errors,
          docPhoto: ""
        });
      }
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
    if (!formData.nic.trim()) newErrors.nic = "Qualifications are required";
    if (!formData.doctorDepartment) newErrors.doctorDepartment = "Department is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    // Check if photo is selected
    if (!docPhoto) {
      setErrors({
        ...errors,
        docPhoto: "Doctor's photo is required"
      });
      toast.error("Please upload the Doctor's photo");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData object
      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append photo
      submitData.append("docPhoto", docPhoto);
      
      console.log("Submitting doctor data with photo:", docPhoto.name);
      
      // Set a button text instead of showing a separate loading toast
      toast.info("Uploading doctor information and photo. Please wait...", {
        autoClose: false,
        toastId: "doctor-upload"
      });

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/doctor/addnew",
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60 seconds timeout
        }
      );
      
      // Dismiss the info toast
      toast.dismiss("doctor-upload");
      
      console.log("Doctor added successfully:", data);
      toast.success(data.message || "Doctor added successfully!");
      
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
        doctorDepartment: "",
      });
      setDocPhoto("");
      setPreviewImage("/doc.png");
      setLoading(false);
      
      // Navigate back to doctors list
      setTimeout(() => {
        navigate('/admin/doctors');
      }, 1000);
    } catch (error) {
      console.error("Error adding doctor:", error);
      setLoading(false);
      
      // Make sure to dismiss the loading toast if there's an error
      toast.dismiss("doctor-upload");
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to add doctor. Please check your connection and try again.");
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/doctors');
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
        <title>Add New Doctor | Satya Hospital Admin</title>
        <meta name="description" content="Add a new doctor to Satya Hospital system. Enter doctor details and department information." />
      </Helmet>

      <div className="add-doctor-container">
        <AdminSidebar />
        
        <motion.div 
          className="add-doctor-header"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="add-doctor-title">Add New Doctor</h1>
        </motion.div>

        <motion.div 
          className="add-doctor-form-container"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="add-doctor-form-header">
            <h2 className="add-doctor-form-title">Doctor Information</h2>
            <p className="add-doctor-form-subtitle">Enter the details of the new doctor</p>
            <div className="form-decoration decoration-1"></div>
            <div className="form-decoration decoration-2"></div>
          </div>

          <form onSubmit={handleAddDoctor}>
            <div className="add-doctor-form-body">
              <div className="form-info">
                <FaInfoCircle className="form-info-icon" />
                All fields marked with an asterisk (*) are required
              </div>

              <div className="form-row">
                <div className="form-col">
                  <div className="doctor-preview-container">
                    <img 
                      src={previewImage} 
                      alt="Doctor Preview" 
                      className="doctor-preview"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Photo</label>
                    <div className="form-file-wrapper">
                      <label className="file-upload-btn">
                        <FaUpload /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage}
                          className="file-upload-input"
                        />
                      </label>
                      {errors.docPhoto && <div className="invalid-feedback">{errors.docPhoto}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-col-2">
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
                        <label className="form-label">Qualifications *</label>
                        <input
                          type="text"
                          name="nic"
                          placeholder="Enter doctor's qualifications (e.g., MBBS, MD)"
                          value={formData.nic}
                          onChange={handleInputChange}
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
                        <label className="form-label">Department *</label>
                        <select
                          name="doctorDepartment"
                          value={formData.doctorDepartment}
                          onChange={handleInputChange}
                          className={`form-select ${errors.doctorDepartment ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select Department</option>
                          {departmentArray.map((dept, index) => (
                            <option key={index} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                        {errors.doctorDepartment && <div className="invalid-feedback">{errors.doctorDepartment}</div>}
                      </div>
                    </div>
                  </div>

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
                {loading ? 'Adding...' : <><FaSave /> Add Doctor</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AddDoctor;