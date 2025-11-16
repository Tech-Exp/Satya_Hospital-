import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle, FaHome, FaInfoCircle, FaUserMd, FaCalendarAlt, FaHospital, FaPhoneAlt, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import './Navbar.css';

const Navbar = () => {
    const [show, setShow] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showDoctorsDropdown, setShowDoctorsDropdown] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
    const location = useLocation();
    const doctorsDropdownRef = useRef(null);
    const { translate, toggleLanguage, language } = useLanguage();

    const navigateTo = useNavigate();

    // Handle scrolling effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (show && !event.target.closest('.navLinks') && !event.target.closest('.hamburger')) {
                setShow(false);
            }
            
            // Close doctors dropdown when clicking outside
            if (showDoctorsDropdown && 
                doctorsDropdownRef.current && 
                !doctorsDropdownRef.current.contains(event.target) &&
                !event.target.closest('.doctors-nav-item')) {
                setShowDoctorsDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [show, showDoctorsDropdown]);
    
    // Fetch doctors for dropdown
    useEffect(() => {
        const fetchDoctors = async () => {
            if (showDoctorsDropdown && doctors.length === 0) {
                try {
                    setLoadingDoctors(true);
                    const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors");
                    if (data && data.doctors) {
                        setDoctors(data.doctors);
                    }
                } catch (error) {
                    console.error("Error fetching doctors:", error);
                } finally {
                    setLoadingDoctors(false);
                }
            }
        };
        
        fetchDoctors();
    }, [showDoctorsDropdown, doctors.length]);

    // Close mobile menu when route changes
    useEffect(() => {
        setShow(false);
    }, [location.pathname]);

    const handleLogout = async() => {
        try {
            // Determine which logout endpoint to use based on user role
            let logoutEndpoint;
            
            if (user && user.role === 'Admin') {
                logoutEndpoint = "http://localhost:4000/api/v1/user/admin/logout";
            } else if (user && user.role === 'Doctor') {
                logoutEndpoint = "http://localhost:4000/api/v1/user/doctor/logout";
            } else {
                logoutEndpoint = "http://localhost:4000/api/v1/user/patient/logout";
            }
                
            console.log("Logging out user with role:", user?.role);
            console.log("Using logout endpoint:", logoutEndpoint);
                
            const response = await axios.get(logoutEndpoint, { 
                withCredentials: true,
            });
                
            toast.success(response.data.message);
            // Use the global function to clear user state
            if (window.clearUserState) {
                window.clearUserState();
            } else {
                setIsAuthenticated(false);
            }
            // Redirect to home page
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    };
    
    const gotoLogin = () => {
        navigateTo("/login");
    };

    const isActive = (path) => {
        return location.pathname === path ? "active-link" : "";
    };

  return (
        <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`} style={{overflow : "hidden"}}>
            <div className="navbar-inner">
                <motion.div 
                    className="logo"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img src='/logo.png' alt='Satya Hospital Logo' className='logo-img'/>
                </motion.div>
                
                <div className={show ? "nav-menu show" : "nav-menu"} >
                    <ul className="nav-links" style={{overflow : "hidden"}}>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/"} className={isActive("/")}><FaHome className="nav-icon" /> {translate("Home")}</Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/about"} className={isActive("/about")}><FaInfoCircle className="nav-icon" /> {translate("About Us")}</Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/doctors"} className={isActive("/doctors")}><FaUserMd className="nav-icon" /> {translate("Doctors")}</Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/appointment"} className={isActive("/appointment")}><FaCalendarAlt className="nav-icon" /> {translate("Appointments")}</Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/services"} className={isActive("/services")}><FaHospital className="nav-icon" /> {translate("Services")}</Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={"/contact"} className={isActive("/contact")}><FaPhoneAlt className="nav-icon" /> {translate("Contact Us")}</Link>
                        </motion.li>
                    </ul>
                    <div className="language-switcher">
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="language-toggle-btn"
                        >
                            {language === "en" ? "हिन्दी" : "English"}
                        </button>
                    </div>
                    
            {isAuthenticated ? (
                        <div className="user-section">
                            {user && user.role === "Doctor" ? (
                                <motion.div 
                                    className="doctor-user-info"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Link to="/doctor/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                        {user.docPhoto ? (
                                            <img 
                                               // src={`http://localhost:4000/${user.docPhoto.replace(/\\/g, '/')}`} 
                                                alt={`Dr. ${user.firstName}`}
                                                className="doctor-photo"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                                                }}
                                            />
                                        ) : (
                                            <div className="doctor-photo" style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                backgroundColor: '#3939d9',
                                                color: 'white',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="doctor-info">
                                            <span className="doctor-name">Dr. {user.firstName} {user.lastName}</span>
                                            <span className="doctor-role">{translate("Doctor")}</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ) : user && user.role === "Admin" ? (
                                <motion.div 
                                    className="user-info"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <FaUserCircle size={22} className="user-icon" />
                                    <Link to="/admin/dashboard">
                                        Admin: {user.firstName} {user.lastName}
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="user-info"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <FaUserCircle size={22} className="user-icon" />
                                    <Link to="/patient/dashboard">
                            {user && user.firstName ? `${user.firstName} ${user.lastName}` : 'My Account'}
                        </Link>
                                </motion.div>
                            )}
                            <motion.button 
                                className="logout-btn"
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {translate("Logout")}
                            </motion.button>
                        </div>
            ) : (
                        <div className="auth-buttons" style={{overflow : "hidden"}}>
                            <motion.button 
                                className="login-btn admin-portal-btn"
                                onClick={gotoLogin}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {translate("Admin Portal")}
                            </motion.button>
                </div>
            )}
        </div>
                
                <div className='hamburger' onClick={() => setShow(!show)}>
                    <GiHamburgerMenu />
                </div>
        </div>
    </nav>
  );
};

export default Navbar
