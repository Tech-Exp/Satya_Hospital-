import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';
import {
  FaUserAlt, FaEnvelope, FaPhone, FaIdCard, FaBirthdayCake,
  FaTransgenderAlt, FaMapMarkerAlt, FaCalendarAlt, FaHospital,
  FaUserMd, FaPlus, FaTrashAlt, FaCheck, FaExclamationTriangle,
  FaArrowRight, FaRupeeSign, FaCreditCard
} from 'react-icons/fa';
import PaymentQR from './PaymentQR';
import './AppointmentForm.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const AppointmentForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [nic, setNic] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [hasVisited, setHasVisited] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    
    const [appointmentsToBook, setAppointmentsToBook] = useState([
        {
            appointmentDate: "",
            department: "",
            doctorFirstName: "",
            doctorLastName: ""
        }
    ]);
    const [multipleMode, setMultipleMode] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);
    const { translate } = useLanguage();
    const t = translate;

    const isValidAadhaar = (value) => /^\d{12}$/.test(value);

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

    const navigateTo = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                // Try to fetch without requiring authentication
                const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors");
                
                if (data && data.doctors && Array.isArray(data.doctors)) {
                    setDoctors(data.doctors);
                    console.log("Doctors fetched successfully:", data.doctors);
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
        fetchDoctors();
    }, []);

    // Add another appointment slot
    const addAppointmentSlot = () => {
        setAppointmentsToBook([
            ...appointmentsToBook,
            {
                appointmentDate: "",
                department: "",
                doctorFirstName: "",
                doctorLastName: ""
            }
        ]);
    };

    // Remove an appointment slot
    const removeAppointmentSlot = (index) => {
        if (appointmentsToBook.length > 1) {
            const updatedAppointments = [...appointmentsToBook];
            updatedAppointments.splice(index, 1);
            setAppointmentsToBook(updatedAppointments);
        }
    };

    // Update a specific appointment's fields
    const updateAppointment = (index, field, value) => {
        console.log(`Updating appointment #${index+1} field "${field}" to:`, value);
        
        // Create a deep copy of the current state
        const updatedAppointments = JSON.parse(JSON.stringify(appointmentsToBook));
        
        // Update the specific field
        updatedAppointments[index] = {
            ...updatedAppointments[index],
            [field]: value
        };
        
        // Set the state with the updated array
        setAppointmentsToBook(updatedAppointments);
        
        // Log the updated appointment for debugging
        console.log(`Appointment #${index+1} after update:`, updatedAppointments[index]);
    };

    // Handle doctor selection for a specific appointment
    const handleDoctorSelect = (index, selectedValue) => {
        try {
            if (!selectedValue) {
                const updatedAppointments = [...appointmentsToBook];
                updatedAppointments[index] = {
                    ...updatedAppointments[index],
                    doctorFirstName: "",
                    doctorLastName: ""
                };
                setAppointmentsToBook(updatedAppointments);
                return;
            }
            
            const { firstName, lastName } = JSON.parse(selectedValue);
            const updatedAppointments = [...appointmentsToBook];
            updatedAppointments[index] = {
                ...updatedAppointments[index],
                doctorFirstName: firstName,
                doctorLastName: lastName
            };
            setAppointmentsToBook(updatedAppointments);
            console.log(`Selected doctor for appointment #${index+1}:`, firstName, lastName);
        } catch (error) {
            console.error("Error parsing doctor selection:", error);
            toast.error(t("Error selecting doctor. Please try again."));
        }
    };

    // Book a single appointment
    const handleSingleAppointment = async () => {
        try {
            setLoading(true);
            const hasVisitedBool = Boolean(hasVisited);
            const { appointmentDate, department, doctorFirstName, doctorLastName } = appointmentsToBook[0];
            
            console.log("Submitting single appointment with data:", {
                firstName, lastName, email, phone, nic, dob, gender,
                appointment_date: appointmentDate,
                department, doctor_firstName: doctorFirstName, doctor_lastName: doctorLastName,
                address, hasVisited: hasVisitedBool
            });
            
            const { data } = await axios.post("http://localhost:4000/api/v1/appointment/book", {
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
                hasVisited: hasVisitedBool,
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
            setLoading(false);
            
            // Store appointment number for payment
            if (data.success && data.appointment && data.appointment.appointmentNumber) {
                setAppointmentId(data.appointment.appointmentNumber);
                // Show payment QR code
                setShowPayment(true);
            } else if (data.success && data.appointment && data.appointment._id) {
                // Fallback to _id if appointmentNumber is not available (for backward compatibility)
                setAppointmentId(data.appointment._id);
                setShowPayment(true);
            } else {
                // If no appointment ID, just navigate to dashboard
            toast.success(t(data.message));
            navigateTo("/patient/dashboard");
            }
        } catch (error) {
            setLoading(false);
            console.error("Appointment booking error:", error);
            
            if (error.response?.data?.message) {
            toast.error(t(error.response.data.message));
            } else if (error.message.includes("Network Error")) {
                toast.error(t("Network error - Please check your connection"));
            } else {
                toast.error(t("Failed to book appointment. Please try again."));
            }
        }
    };
    
    // Track if payment success has been handled
    const [paymentSuccessHandled, setPaymentSuccessHandled] = useState(false);
    
    // Handle payment success
    const handlePaymentSuccess = (payment) => {
        // Prevent duplicate handling
        if (paymentSuccessHandled) {
            console.log("Payment success already handled in AppointmentForm, ignoring duplicate callback");
            return;
        }
        
        console.log("Payment successful:", payment);
        setPaymentSuccessHandled(true);
        
        // Prevent multiple success messages with a unique ID
        const uniqueToastId = `appointment-payment-success-${Date.now()}`;
        toast.success(t("Payment successful! Your appointment is confirmed."), {
            toastId: uniqueToastId,
            autoClose: 3000
        });
        
        // Navigate after a short delay to ensure toast is visible
        const navigationTimer = setTimeout(() => {
            navigateTo("/patient/dashboard");
        }, 1500);
        
        // Clean up timer if component unmounts
        return () => clearTimeout(navigationTimer);
    };
    
    // Handle payment close
    const handlePaymentClose = () => {
        // Prevent multiple handling
        if (paymentSuccessHandled) {
            console.log("Payment already handled in AppointmentForm, ignoring close");
            return;
        }
        
        console.log("Payment modal closed manually in AppointmentForm");
        
        // Show info message with unique ID
        const uniqueToastId = `payment-later-${Date.now()}`;
        toast.info(t("You can complete the payment later."), {
            toastId: uniqueToastId,
            autoClose: 3000
        });
        
        // Navigate after a short delay
        const navigationTimer = setTimeout(() => {
            navigateTo("/patient/dashboard");
        }, 1500);
        
        // Clean up timer if component unmounts
        return () => clearTimeout(navigationTimer);
    };

    // Book multiple appointments
    const handleMultipleAppointments = async () => {
        try {
            setLoading(true);
            const hasVisitedBool = Boolean(hasVisited);
            
            // Format appointments for API
            const formattedAppointments = appointmentsToBook.map(apt => ({
                firstName,
                lastName,
                email,
                phone,
                nic,
                dob,
                gender,
                appointment_date: apt.appointmentDate,
                department: apt.department,
                doctor_firstName: apt.doctorFirstName,
                doctor_lastName: apt.doctorLastName,
                address,
                hasVisited: hasVisitedBool
            }));
            
            console.log("Submitting multiple appointments:", formattedAppointments);
            
            const { data } = await axios.post(
                "http://localhost:4000/api/v1/appointment/book-multiple", 
                { appointments: formattedAppointments },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );
            
            setLoading(false);
            console.log("Multiple appointment response:", data);
            
            if (data.appointmentsCreated > 0) {
            toast.success(`${data.appointmentsCreated} ${t("appointments booked successfully")}`);
                
            if (data.errors && data.errors.length > 0) {
                toast.warning(`${t("Note:")} ${data.errors.length} ${t("appointments had errors")}`);
            }
                
            navigateTo("/patient/dashboard");
            } else {
                toast.error(t("Failed to book any appointments. Please check your information and try again."));
                console.error("No appointments created. Server response:", data);
            }
        } catch (error) {
            setLoading(false);
            console.error("Multiple appointment booking error:", error);
            
            if (error.response?.data?.message) {
                toast.error(t(error.response.data.message));
            } else if (error.message.includes("Network Error")) {
                toast.error(t("Network error - Please check your connection"));
            } else {
                toast.error(t("Error booking appointments. Please try again."));
            }
        }
    };

    // Check if user is authenticated with valid token
    const checkAuthentication = async () => {
        try {
            // Try to make a request that requires authentication
            const response = await axios.get('http://localhost:4000/api/v1/appointment/my', {
                withCredentials: true
            });
            return true; // User is authenticated
        } catch (error) {
            console.log("Authentication check error:", error);
            if (error.response?.status === 400) {
                toast.error(t("You need to be logged in to book an appointment"));
                navigateTo("/login"); // Redirect to login page
                return false;
            }
            return true; // Other errors - assume authenticated but let the backend handle it
        }
    };

    // Main submit handler
    const handleAppointment = async (e) => {
        e.preventDefault();
        console.log("Form submitted. Current appointment state:", appointmentsToBook);
        
        // Validate common fields
        if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !address) {
            toast.error(t("Please fill all personal information fields"));
            console.log("Missing personal info fields:", {
                firstName, lastName, email, phone, nic, dob, gender, address
            });
            return;
        }

        if (!isValidAadhaar(nic)) {
            toast.error(t("Please enter a valid 12-digit Aadhaar number"));
            return;
        }

        // Validate appointment fields
        for (let i = 0; i < appointmentsToBook.length; i++) {
            const apt = appointmentsToBook[i];
            console.log(`Validating appointment #${i + 1}:`, apt);
            
            if (!apt.appointmentDate) {
                toast.error(`${t("Please select a date for appointment #")} ${i + 1}`);
                return;
            }
            
            if (!apt.department) {
                toast.error(`${t("Please select a department for appointment #")} ${i + 1}`);
                return;
            }
            
            if (!apt.doctorFirstName || !apt.doctorLastName) {
                toast.error(`${t("Please select a doctor for appointment #")} ${i + 1}`);
                return;
            }
        }
        
        console.log("All validation passed, proceeding with booking");
        
        // Check authentication before proceeding
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            return;
        }
        
        // Book single or multiple appointments
        if (multipleMode) {
            await handleMultipleAppointments();
        } else {
            await handleSingleAppointment();
        }
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <>
            <Helmet>
                <title>{translate("Book an Appointment | Satya Hospital")}</title>
            </Helmet>
            
            {showPayment ? (
                <PaymentQR 
                    appointmentId={appointmentId} 
                    onClose={handlePaymentClose} 
                    onPaymentSuccess={handlePaymentSuccess} 
                />
            ) : (
                <div className="appointment-container">
                    <div className="container">
                    <motion.div 
                        className="appointment-header"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>{translate("Book an Appointment")}</h1>
                        <p>
                            {translate("Schedule your visit at Satya Trauma & Maternity Center. Our team of experienced healthcare professionals is ready to provide you with the best care.")}
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="appointment-form-container"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Decorative elements */}
                        <div className="form-decoration decoration-1"></div>
                        <div className="form-decoration decoration-2"></div>
                        
                        {/* Progress steps - visual only */}
                        <div className="form-progress">
                            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                                <div className="step-number">1</div>
                                <div className="step-name">{t("Personal Info")}</div>
                            </div>
                            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <div className="step-name">{t("Appointment Details")}</div>
                            </div>
                            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                                <div className="step-number">3</div>
                                <div className="step-name">{t("Confirmation")}</div>
                            </div>
                        </div>
                        
                        {/* Multiple appointment toggle */}
                        <div className="multiple-toggle">
                            <label className="checkbox-label">
                                <span className="toggle-switch">
                        <input 
                            type="checkbox" 
                            checked={multipleMode}
                            onChange={() => {
                                setMultipleMode(!multipleMode);
                                // Reset to single appointment when switching modes
                                if (!multipleMode) {
                                    setAppointmentsToBook([appointmentsToBook[0]]);
                                }
                            }}
                        />
                                    <span className="toggle-slider"></span>
                                </span>
                                <span className="toggle-label">{t("Book Multiple Appointments")}</span>
                    </label>
                </div>
                
                <form onSubmit={handleAppointment}>
                            {/* Step 1: Personal Information */}
                            <div className="form-section" style={{display: currentStep === 1 ? 'block' : 'none'}}>
                                <h3 className="section-title">{t("Personal Information")}</h3>
                                
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
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="nic">{t("Aadhaar Number")}</label>
                                        <div style={{ position: 'relative' }}>
                                            <FaIdCard style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                                            <input 
                                                type="text" 
                                                id="nic"
                                                className="form-control" 
                                                style={{ paddingLeft: '40px' }}
                                                placeholder={t("Enter your Aadhaar number")} 
                                                value={nic} 
                                                onChange={(e) => setNic(e.target.value)} 
                                                required
                                            />
                    </div>
                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="dob">{t("Date of Birth")}</label>
                                        <div style={{ position: 'relative' }}>
                                            <FaBirthdayCake style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                        <input
                            type="date"
                                                id="dob"
                                                className="form-control" 
                                                style={{ paddingLeft: '40px' }}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                                                required
                        />
                    </div>
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="gender">{t("Gender")}</label>
                                        <div style={{ position: 'relative' }}>
                                            <FaTransgenderAlt style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                                            <select 
                                                id="gender"
                                                className="form-select" 
                                                style={{ paddingLeft: '40px' }}
                                                value={gender} 
                                                onChange={(e) => setGender(e.target.value)} 
                                                required
                                            >
                                                <option value="">{t("Select your gender")}</option>
                            <option value="Male">{t("Male")}</option>
                            <option value="Female">{t("Female")}</option>
                                                <option value="Other">{t("Other")}</option>
                        </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" htmlFor="address">{t("Address")}</label>
                                    <div style={{ position: 'relative' }}>
                                        <FaMapMarkerAlt style={{ position: 'absolute', left: '15px', top: '15px', color: '#aaa' }} />
                                        <textarea 
                                            id="address"
                                            className="form-textarea" 
                                            style={{ paddingLeft: '40px' }}
                                            placeholder={t("Your full address")} 
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)} 
                                            required
                                            rows="4"
                                        ></textarea>
                                    </div>
                    </div>
                    
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox"
                                            className="checkbox-input"
                                            checked={hasVisited}
                                            onChange={(e) => setHasVisited(e.target.checked)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="checkbox-text">{t("I have visited Satya Hospital before")}</span>
                                    </label>
                    </div>
                    
                                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                    <motion.button 
                                        type="button" 
                                        className="form-submit-btn"
                                        onClick={nextStep}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t("Next Step")} <FaArrowRight style={{ marginLeft: '10px' }} />
                                    </motion.button>
                                </div>
                    </div>
                    
                            {/* Step 2: Appointment Details */}
                            <div className="form-section" style={{display: currentStep === 2 ? 'block' : 'none'}}>
                                <h3 className="section-title">{t("Appointment Details")}</h3>
                                
                    {appointmentsToBook.map((appointment, index) => (
                                    <div key={index} className="appointment-slot">
                                        <div className="appointment-slot-header">
                                            <div className="appointment-slot-title">
                                                <FaCalendarAlt className="slot-icon" /> {t("Appointment")} #{index + 1}
                                            </div>
                                {multipleMode && appointmentsToBook.length > 1 && (
                                                <motion.button 
                                        type="button" 
                                                    className="slot-remove-btn"
                                        onClick={() => removeAppointmentSlot(index)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaTrashAlt className="remove-icon" /> Remove
                                                </motion.button>
                                )}
                            </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">{t("Appointment Date")}</label>
                                            <div style={{ position: 'relative' }}>
                                                <FaCalendarAlt style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                                <input 
                                    type="date" 
                                                    className="form-control" 
                                                    style={{ paddingLeft: '40px' }}
                                                    placeholder={t("Select appointment date")} 
                                    value={appointment.appointmentDate || ""} 
                                    onChange={(e) => {
                                        console.log("Date changed:", e.target.value);
                                        updateAppointment(index, 'appointmentDate', e.target.value);
                                    }}
                                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                                                    required
                                />
                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">{t("Department")}</label>
                                            <div style={{ position: 'relative' }}>
                                                <FaHospital style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                                <select 
                                                    className="form-select" 
                                                    style={{ paddingLeft: '40px' }}
                                    value={appointment.department || ""}
                                    onChange={(e) => {
                                        const selectedDepartment = e.target.value;
                                        console.log("Selected department:", selectedDepartment);
                                                        const updatedAppointments = [...appointmentsToBook];
                                                        updatedAppointments[index] = {
                                                            ...updatedAppointments[index],
                                                            department: selectedDepartment,
                                        // Reset doctor when department changes
                                                            doctorFirstName: '',
                                                            doctorLastName: ''
                                                        };
                                                        
                                                        // Update state with the modified appointments array
                                                        setAppointmentsToBook(updatedAppointments);
                                                    }}
                                                    required
                                                >
                                                    <option value="">{t("Select department")}</option>
                                    {departmentsArray.map((depart, idx) => (
                                        <option value={depart} key={idx}>{t(depart)}</option>
                                    ))}
                                </select>
                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">{t("Doctor")}</label>
                                            <div style={{ position: 'relative' }}>
                                                <FaUserMd style={{ position: 'absolute', left: '15px', top: '13px', color: '#aaa' }} />
                                <select 
                                                    className="form-select" 
                                                    style={{ paddingLeft: '40px' }}
                                    value={appointment.doctorFirstName && appointment.doctorLastName ? 
                                        JSON.stringify({
                                            firstName: appointment.doctorFirstName,
                                            lastName: appointment.doctorLastName,
                                        }) : ""
                                    }
                                    onChange={(e) => {
                                        console.log("Doctor selection changed:", e.target.value);
                                        if (e.target.value) {
                                            handleDoctorSelect(index, e.target.value);
                                        } else {
                                            updateAppointment(index, 'doctorFirstName', '');
                                            updateAppointment(index, 'doctorLastName', '');
                                        }
                                    }}
                                    disabled={!appointment.department}
                                                    required
                                                >
                                                    <option value="">{t("Select doctor")}</option>
                                    {doctors && Array.isArray(doctors) && doctors
                                        .filter(doctor => doctor && doctor.doctorDepartment === appointment.department)
                                        .map((doctor, idx) => (
                                            <option
                                                key={idx}
                                                value={JSON.stringify({
                                                    firstName: doctor.firstName,
                                                    lastName: doctor.lastName,
                                                })}
                                            >
                                                                {t("Dr.")} {doctor.firstName} {doctor.lastName}
                                            </option>
                                        ))}
                                </select>
                                            </div>
                                {appointment.department && (!doctors || doctors.filter(d => d && d.doctorDepartment === appointment.department).length === 0) && (
                                                <div className="no-doctors-message">
                                                    <FaExclamationTriangle className="warning-icon" />
                                        {t("No doctors available for this department")}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add more appointments button */}
                    {multipleMode && (
                                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                        <motion.button 
                                type="button" 
                                            className="add-appointment-btn"
                                onClick={addAppointmentSlot}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaPlus className="add-icon" /> {t("Add Another Appointment")}
                                        </motion.button>
                        </div>
                    )}
                    
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <motion.button 
                                        type="button" 
                                        onClick={prevStep}
                                        className="form-submit-btn"
                                        style={{ background: '#f5f5f5', color: '#333', boxShadow: 'none' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t("Back")}
                                    </motion.button>
                                    
                                    <motion.button 
                                        type="button" 
                                        onClick={nextStep}
                                        className="form-submit-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t("Review & Confirm")} <FaArrowRight style={{ marginLeft: '10px' }} />
                                    </motion.button>
                                </div>
                            </div>
                            
                            {/* Step 3: Review & Confirm */}
                            <div className="form-section" style={{display: currentStep === 3 ? 'block' : 'none'}}>
                                <h3 className="section-title">{t("Review & Confirm")}</h3>
                                
                                <div style={{ background: '#f8faff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                    <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>{t("Personal Information")}</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Name:")}</div>
                                            <div style={{ fontWeight: '600' }}>{firstName} {lastName}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Email:")}</div>
                                            <div style={{ fontWeight: '600' }}>{email}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Phone:")}</div>
                                            <div style={{ fontWeight: '600' }}>{phone}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Aadhaar:")}</div>
                                            <div style={{ fontWeight: '600' }}>{nic}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Date of Birth:")}</div>
                                            <div style={{ fontWeight: '600' }}>{dob}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Gender:")}</div>
                                            <div style={{ fontWeight: '600' }}>{gender}</div>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Address:")}</div>
                                            <div style={{ fontWeight: '600' }}>{address}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Previous Visit:")}</div>
                                            <div style={{ fontWeight: '600' }}>{hasVisited ? t("Yes") : t("No")}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
                                    {multipleMode ? t("Appointments") : t("Appointment")} {t("Details")}
                                </h4>
                                
                                {appointmentsToBook.map((appointment, index) => (
                                    <div key={index} style={{ 
                                        background: '#f8faff', 
                                        padding: '20px', 
                                        borderRadius: '10px', 
                                        marginBottom: '15px',
                                        borderLeft: '4px solid #3939d9'
                                    }}>
                                        <div style={{ marginBottom: '10px', fontWeight: '600', color: '#3939d9' }}>
                                            {t("Appointment")} #{index + 1}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                            <div>
                                                <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Date:")}</div>
                                                <div style={{ fontWeight: '600' }}>{appointment.appointmentDate}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Department:")}</div>
                                                <div style={{ fontWeight: '600' }}>{appointment.department}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#777', fontSize: '0.9rem' }}>{t("Doctor:")}</div>
                                                <div style={{ fontWeight: '600' }}>
                                                    {t("Dr.")} {appointment.doctorFirstName} {appointment.doctorLastName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="review-section payment-info" style={{ textAlign: 'center', backgroundColor: '#f0f7ff', borderLeft: '4px solid #3939d9', padding: '20px', marginBottom: '20px' }}>
                                    <h3 style={{ color: '#3939d9', marginBottom: '15px' }}>{t("Payment Information")}</h3>
                                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#3939d9', margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaRupeeSign style={{ marginRight: '5px' }} /> 500
                                    </div>
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{t("Appointment booking fee")}</p>
                                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#555', fontSize: '14px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
                                        <FaCreditCard /> {t("You will be redirected to the payment screen after submitting your appointment request.")}
                                    </p>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                                    <motion.button 
                                        type="button" 
                                        onClick={prevStep}
                                        className="form-submit-btn"
                                        style={{ background: '#f5f5f5', color: '#333', boxShadow: 'none' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t("Back")}
                                    </motion.button>
                                    
                                    <motion.button 
                            type="submit" 
                                        className="form-submit-btn"
                                        disabled={loading}
                                        whileHover={loading ? {} : { scale: 1.05 }}
                                        whileTap={loading ? {} : { scale: 0.95 }}
                                    >
                                        {loading ? t("Processing...") : (
                                            <>
                                                <FaCheck style={{ marginRight: '10px' }} /> 
                            {multipleMode ? 
                                                    `${t("Confirm & Pay for")} ${appointmentsToBook.length} ${t("Appointments")}` : 
                                                    t("Confirm & Pay")
                                                }
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                    </div>
                </form>
                        </motion.div>
                    </div>
            </div>
            )}
        </>
    )
}

export default AppointmentForm;