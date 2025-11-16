import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserAlt, FaEnvelope, FaPhone, FaIdCard, FaBirthdayCake,
  FaTransgenderAlt, FaMapMarkerAlt, FaCalendarAlt, FaHospital,
  FaUserMd, FaTimes, FaCheck, FaRupeeSign, FaCreditCard
} from 'react-icons/fa';
import PaymentQR from './PaymentQR';
import './DirectAppointmentForm.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const DirectAppointmentForm = ({ isOpen, onClose, embedded = false }) => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const t = translate;
  
  const isValidAadhaar = (value) => /^\d{12}$/.test(value);
  
  // Personal information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  
  // Appointment details
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [paymentSuccessHandled, setPaymentSuccessHandled] = useState(false);

  const departmentsArray = [
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
        "Other",
  ];

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors");
        
        if (data && data.doctors && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          console.error("Invalid doctors data format:", data);
          toast.error(t("Error loading doctors data. Please refresh the page."));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(t("Failed to load doctors. Please try again."));
        setLoading(false);
      }
    };
    
    if (isOpen || embedded) {
      fetchDoctors();
    }
  }, [isOpen, embedded]);

  // Handle doctor selection
  const handleDoctorSelect = (e) => {
    try {
      if (!e.target.value) {
        setDoctorFirstName("");
        setDoctorLastName("");
        return;
      }
      
      const { firstName, lastName } = JSON.parse(e.target.value);
      setDoctorFirstName(firstName);
      setDoctorLastName(lastName);
    } catch (error) {
      console.error("Error parsing doctor selection:", error);
    }
  };

  // Form validation
  const validateStep1 = () => {
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !address) {
      toast.error(t("Please fill all personal information fields"));
      return false;
    }
    if (!isValidAadhaar(nic)) {
      toast.error(t("Please enter a valid 12-digit Aadhaar number"));
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    if (!appointmentDate) {
      toast.error(t("Please select an appointment date"));
      return false;
    }
    if (!department) {
      toast.error(t("Please select a department"));
      return false;
    }
    // Doctor selection is optional if "Other" department is selected
    if (department !== "Other" && (!doctorFirstName || !doctorLastName)) {
      toast.error(t("Please select a doctor"));
      return false;
    }
    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step !== 3) {
      nextStep();
      return;
    }
    
    if (!validateStep1() || !validateStep2()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const appointmentData = {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date: appointmentDate,
        department,
        doctor_firstName: doctorFirstName,
        doctor_lastName: doctorLastName,
        address,
        hasVisited
      };
      
      console.log("Submitting appointment:", appointmentData);
      
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/direct-book",
        appointmentData
      );
      
      setLoading(false);
      
      if (data.success) {
        console.log("Appointment booked successfully:", data);
        
        // If we have an appointment number, proceed to payment
        if (data.appointment && data.appointment.appointmentNumber) {
          setAppointmentId(data.appointment.appointmentNumber);
          setShowPayment(true);
        } else if (data.appointment && data.appointment._id) {
          // Fallback to _id if appointmentNumber is not available (for backward compatibility)
          setAppointmentId(data.appointment._id);
          setShowPayment(true);
        } else {
          // No payment flow, just show success
          toast.success(t("Appointment booked successfully"));
          setSubmitSuccess(true);
          
          // Reset form and close modal after delay
          setTimeout(() => {
            resetForm();
            if (!embedded) {
              onClose();
            }
          }, 3000);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error booking appointment:", error);
      toast.error(t(error.response?.data?.message || "Failed to book appointment. Please try again."));
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    if (paymentSuccessHandled) return;
    setPaymentSuccessHandled(true);
    
    // Show success message with unique ID to prevent duplicates
    toast.success(t("Payment successful! Your appointment is confirmed."), {
      toastId: `payment-success-${Date.now()}`
    });
    
    // Reset form
    resetForm();
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/');
      if (!embedded && onClose) {
        onClose();
      }
    }, 1500);
  };

  // Handle payment close
  const handlePaymentClose = () => {
    if (paymentSuccessHandled) return;
    setShowPayment(false);
    
    // Reset form and redirect to home
    resetForm();
    
    // Redirect to home page
    setTimeout(() => {
      navigate('/');
      if (!embedded && onClose) {
        onClose();
      }
    }, 500);
  };

  // Reset form
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setDob("");
    setGender("");
    setAddress("");
    setHasVisited(false);
    setAppointmentDate("");
    setDepartment("");
    setDoctorFirstName("");
    setDoctorLastName("");
    setStep(1);
    setSubmitSuccess(false);
    setPaymentSuccessHandled(false);
  };

  // Navigation between steps
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // For modal version, return null if not open
  if (!isOpen && !embedded) return null;

  // Show payment QR if in payment state
  if (showPayment) {
    return (
      <div className={embedded ? "embedded-payment-container" : "direct-appointment-overlay"}>
        <PaymentQR 
          appointmentId={appointmentId} 
          onClose={handlePaymentClose} 
          onPaymentSuccess={handlePaymentSuccess} 
        />
      </div>
    );
  }

  // Main form content
  const formContent = (
    <>
      {!embedded && (
        <button className="direct-appointment-close" onClick={onClose}>
          <FaTimes />
        </button>
      )}
      
      <div className="direct-appointment-header">
        <h2>{t("Quick Appointment Request")}</h2>
        <p>{t("Book your appointment directly without creating an account")}</p>
      </div>
      
      {/* Progress indicator */}
      <div className="direct-appointment-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-name">Personal Info</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-name">Appointment</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-name">Confirm</div>
        </div>
      </div>
    
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        <div className="form-step" style={{ display: step === 1 ? 'block' : 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t("First Name")}</label>
              <div className="input-with-icon">
                <FaUserAlt className="input-icon" />
                <input 
                  type="text"
                  placeholder={t("Enter your first name")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("Last Name")}</label>
              <div className="input-with-icon">
                <FaUserAlt className="input-icon" />
                <input 
                  type="text"
                  placeholder={t("Enter your last name")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t("Email Address")}</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input 
                  type="email"
                  placeholder={t("Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("Phone Number")}</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input 
                  type="tel"
                  placeholder={t("Enter your phone number")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t("Aadhaar Number")}</label>
              <div className="input-with-icon">
                <FaIdCard className="input-icon" />
                <input 
                  type="text"
                  placeholder={t("Enter your Aadhaar number")}
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("Date of Birth")}</label>
              <div className="input-with-icon">
                <FaBirthdayCake className="input-icon" />
                <input 
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t("Gender")}</label>
              <div className="input-with-icon">
                <FaTransgenderAlt className="input-icon" />
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">{t("Select Gender")}</option>
                  <option value="Male">{t("Male")}</option>
                  <option value="Female">{t("Female")}</option>
                  <option value="Other">{t("Other")}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t("Address")}</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input 
                  type="text"
                  placeholder={t("Enter your address")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={hasVisited}
                  onChange={(e) => setHasVisited(e.target.checked)}
                />
              <span>{t("I have visited Satya Hospital before")}</span>
              </label>
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="next-btn"
              onClick={nextStep}
            >
              {t("Next Step")}
            </button>
          </div>
        </div>
        
        {/* Step 2: Appointment Details */}
        <div className="form-step" style={{ display: step === 2 ? 'block' : 'none' }}>
          <div className="form-row">
            <div className="form-group">
              <label>{t("Appointment Date")}</label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input 
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("Department")}</label>
              <div className="input-with-icon">
                <FaHospital className="input-icon" />
                <select 
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDoctorFirstName("");
                    setDoctorLastName("");
                  }}
                  required
                >
                  <option value="">{t("Select department")}</option>
                  {departmentsArray.map((dept, index) => (
                    <option key={index} value={dept}>{t(dept) || dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>{t("Doctor")} {department === "Other" && <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal'}}>({t("Optional")})</span>}</label>
              <div className="input-with-icon">
                <FaUserMd className="input-icon" />
                <select 
                  value={doctorFirstName && doctorLastName ? 
                    JSON.stringify({ firstName: doctorFirstName, lastName: doctorLastName }) : ""
                  }
                  onChange={handleDoctorSelect}
                  disabled={!department || department === "Other"}
                  required={department !== "Other"}
                >
                  <option value="">{department === "Other" ? t("Not specified") : t("Select doctor")}</option>
                  {department !== "Other" && doctors
                    .filter(doctor => doctor.doctorDepartment === department)
                    .map((doctor, index) => (
                      <option 
                        key={index}
                        value={JSON.stringify({
                          firstName: doctor.firstName,
                          lastName: doctor.lastName
                        })}
                      >
                        {t("Dr.")} {doctor.firstName} {doctor.lastName}
                      </option>
                    ))
                  }
                </select>
              </div>
              {department && department !== "Other" && doctors.filter(doctor => doctor.doctorDepartment === department).length === 0 && (
                <div className="no-doctors-message">
                  {t("No doctors available for this department")}
                </div>
              )}
              {department === "Other" && (
                <div className="no-doctors-message" style={{color: '#666', fontStyle: 'italic'}}>
                  {t("A doctor will be assigned by the hospital")}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="back-btn"
              onClick={prevStep}
            >
              {t("Back")}
            </button>
            <button 
              type="button" 
              className="next-btn"
              onClick={nextStep}
            >
              {t("Review")}
            </button>
          </div>
        </div>
        
        {/* Step 3: Review and Confirm */}
        <div className="form-step" style={{ display: step === 3 ? 'block' : 'none' }}>
          <div className="review-section">
            <h3>{t("Personal Information")}</h3>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">{t("Name:")}</span>
                <span className="review-value">{firstName} {lastName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Email:")}</span>
                <span className="review-value">{email}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Phone:")}</span>
                <span className="review-value">{phone}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Aadhaar:")}</span>
                <span className="review-value">{nic}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Date of Birth:")}</span>
                <span className="review-value">{dob}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Gender:")}</span>
                <span className="review-value">{gender}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Address:")}</span>
                <span className="review-value">{address}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Previous Visit:")}</span>
                <span className="review-value">{hasVisited ? t("Yes") : t("No")}</span>
              </div>
            </div>
          </div>
          
          <div className="review-section">
            <h3>{t("Appointment Details")}</h3>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">{t("Date:")}</span>
                <span className="review-value">{appointmentDate}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Department:")}</span>
                <span className="review-value">{t(department)}</span>
              </div>
              <div className="review-item">
                <span className="review-label">{t("Doctor:")}</span>
                <span className="review-value">
                  {doctorFirstName && doctorLastName 
                    ? `${t("Dr.")} ${doctorFirstName} ${doctorLastName}`
                    : department === "Other" 
                      ? t("To be assigned by hospital")
                      : t("Not selected")
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="review-section payment-info">
            <h3>{t("Payment Information")}</h3>
            <div className="payment-amount">
              <FaRupeeSign /> 500.00
            </div>
            <div className="payment-description">
              {t("Appointment booking fee")}
            </div>
            <div className="payment-note">
              <FaCreditCard /> {t("You will be redirected to the payment screen after submitting your appointment request.")}
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="back-btn"
              onClick={prevStep}
            >
              {t("Back")}
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? t("Processing...") : t("Submit & Proceed to Payment")}
            </button>
          </div>
        </div>
      </form>
      
      {submitSuccess && (
        <div className="success-message">
          <FaCheck className="success-icon" />
          <h3>{t("Appointment Requested!")}</h3>
          <p>{t("Your appointment request has been submitted successfully.")}</p>
        </div>
      )}
    </>
  );

  // Return the appropriate version based on embedded prop
  return embedded ? (
    <div className="direct-appointment-embedded">
      {formContent}
    </div>
  ) : (
    <div className="direct-appointment-overlay">
      <motion.div 
        className="direct-appointment-modal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        {formContent}
      </motion.div>
    </div>
  );
};

export default DirectAppointmentForm;