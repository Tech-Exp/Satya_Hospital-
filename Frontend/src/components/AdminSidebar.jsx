import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../main';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminSidebar.css';

// Icons
import { 
  FaHome, FaUserMd, FaUserCog, FaUserPlus, 
  FaEnvelope, FaSignOutAlt, FaTimes, FaCalendarAlt,
  FaChartLine, FaBell, FaUserCircle, FaShieldAlt,
  FaStar
} from 'react-icons/fa';
import { RiDashboardLine } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';

const AdminSidebar = () => {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);
  const location = useLocation();
  const navigateTo = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return 'A';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
      if (window.innerWidth > 1200) {
        setShow(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Mock unread messages count - in a real app this would come from your API
    setUnreadMessages(5);
  }, []);

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async() => {
    try {
      console.log("Admin logging out");
      const response = await axios.get("http://localhost:4000/api/v1/user/admin/logout", { 
        withCredentials: true,
      });
      
      toast.success(response.data.message);
      // Use the global function to clear user state
      if (window.clearUserState) {
        window.clearUserState();
      } else {
        setIsAuthenticated(false);
      }
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Admin logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  const navTo = (path) => {
    navigateTo(path);
    if (isMobile) {
      setShow(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && isAuthenticated && show && (
        <div 
          className="sidebar-backdrop show"
          onClick={() => setShow(false)}
        />
      )}
      
      <motion.nav 
        className={`admin-sidebar ${show ? "show" : ""}`} 
        initial="open"
        animate="open"
        style={!isAuthenticated ? {display:"none"}: {display:"flex"}}
      >
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="sidebar-logo">
            <div className="logo-badge">SH</div>
            <div className="logo-text">
              <h1 className="hospital-name">
                <span>S</span><span>atya</span>
              </h1>
              <p className="hospital-type">Admin Portal</p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Horizontal */}
          <div className="desktop-nav">
            <div className="nav-links-horizontal">
              <div 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => navTo('/admin/dashboard')}
              >
                <span className="nav-icon"><RiDashboardLine /></span>
                <span className="nav-text">Dashboard</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/doctors') ? 'active' : ''}`}
                onClick={() => navTo('/admin/doctors')}
              >
                <span className="nav-icon"><FaUserMd /></span>
                <span className="nav-text">Doctors</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/messages') ? 'active' : ''}`}
                onClick={() => navTo('/admin/messages')}
              >
                <span className="nav-icon"><FaEnvelope /></span>
                <span className="nav-text">Messages</span>
                {unreadMessages > 0 && (
                  <span className="nav-badge">{unreadMessages}</span>
                )}
              </div>
              <div 
                className={`nav-link ${isActive('/admin/appointments') ? 'active' : ''}`}
                onClick={() => navTo('/admin/dashboard')}
              >
                <span className="nav-icon"><FaCalendarAlt /></span>
                <span className="nav-text">Appointments</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/doctor/add') ? 'active' : ''}`}
                onClick={() => navTo('/admin/doctor/add')}
              >
                <span className="nav-icon"><FaUserPlus /></span>
                <span className="nav-text">Add Doctor</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/add') ? 'active' : ''}`}
                onClick={() => navTo('/admin/add')}
              >
                <span className="nav-icon"><FaUserCog /></span>
                <span className="nav-text">Add Admin</span>
              </div>
            </div>
            
            <div className="nav-right">
              <div className="user-profile-compact">
                <div className="admin-avatar">
                  {getInitials()}
                </div>
                <div className="admin-info-compact">
                  <span className="admin-name-compact">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
                  <span className="admin-status-pill">● Active</span>
                </div>
              </div>
              <button className="logout-btn-compact" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button className="mobile-menu-btn" onClick={() => setShow(!show)}>
              {show ? <FaTimes /> : <GiHamburgerMenu />}
            </button>
          )}
        </div>

        {/* Mobile Navigation - Dropdown */}
        {isMobile && (
          <div className={`mobile-nav ${show ? "show" : ""}`}>
            <div className="mobile-user-profile">
              <div className="admin-avatar">
                {getInitials()}
              </div>
              <div className="admin-info">
                <h3 className="admin-name">{user ? `${user.firstName} ${user.lastName}` : 'Admin User'}</h3>
                <p className="admin-role">
                  <span className="admin-role-badge">Admin</span>
                  <span className="admin-status-pill">● Active</span>
                </p>
              </div>
            </div>
            
            <div className="mobile-nav-links">
              <div 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => navTo('/admin/dashboard')}
              >
                <span className="nav-icon"><RiDashboardLine /></span>
                <span className="nav-text">Dashboard</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/doctors') ? 'active' : ''}`}
                onClick={() => navTo('/admin/doctors')}
              >
                <span className="nav-icon"><FaUserMd /></span>
                <span className="nav-text">Doctors</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/messages') ? 'active' : ''}`}
                onClick={() => navTo('/admin/messages')}
              >
                <span className="nav-icon"><FaEnvelope /></span>
                <span className="nav-text">Messages</span>
                {unreadMessages > 0 && (
                  <span className="nav-badge">{unreadMessages}</span>
                )}
              </div>
              <div 
                className={`nav-link ${isActive('/admin/appointments') ? 'active' : ''}`}
                onClick={() => navTo('/admin/dashboard')}
              >
                <span className="nav-icon"><FaCalendarAlt /></span>
                <span className="nav-text">Appointments</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/doctor/add') ? 'active' : ''}`}
                onClick={() => navTo('/admin/doctor/add')}
              >
                <span className="nav-icon"><FaUserPlus /></span>
                <span className="nav-text">Add Doctor</span>
              </div>
              <div 
                className={`nav-link ${isActive('/admin/add') ? 'active' : ''}`}
                onClick={() => navTo('/admin/add')}
              >
                <span className="nav-icon"><FaUserCog /></span>
                <span className="nav-text">Add Admin</span>
              </div>
            </div>
            
            <div className="mobile-footer">
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
                Logout
              </button>
              <p className="sidebar-footnote">Healing with heart ♡</p>
            </div>
          </div>
        )}
      </motion.nav>
    </>
  );
};

export default AdminSidebar;