import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStethoscope,
  FaHospital, FaUserMd, FaClock, FaHeartbeat, FaWeight,
  FaThermometerHalf, FaTint, FaFileMedicalAlt, FaChevronRight,
  FaTrash
} from 'react-icons/fa';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4000/api/v1/appointment/patient", {
        withCredentials: true
      });
      setAppointments(data.appointments);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);
  
  const handleCancelAppointment = async (appointmentId) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to cancel appointments");
      return;
    }
    
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const { data } = await axios.delete(`http://localhost:4000/api/v1/appointment/delete/${appointmentId}`, {
          withCredentials: true
        });
        
        toast.success(data.message || "Appointment cancelled successfully");
        
        // Refresh appointments list
        fetchAppointments();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel appointment");
        console.error("Cancel appointment error:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f1c40f'; // yellow
      case 'Accepted': return '#2ecc71'; // green
      case 'Rejected': return '#e74c3c'; // red
      case 'Cancelled': return '#95a5a6'; // grey
      default: return '#3498db'; // blue
    }
  };

  // Get the next upcoming appointment (accepted only)
  const upcomingAppointment = appointments
    .filter(apt => apt.status === 'Accepted')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .find(apt => new Date(apt.appointment_date) >= new Date());

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Helmet>
        <title>Patient Dashboard | Satya Hospital</title>
      </Helmet>

      <div className="dashboard-container">
        <div className="container">
          {/* Welcome Section */}
          <motion.div 
            className="dashboard-welcome"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="welcome-bg-shape"></div>
            <div className="dashboard-welcome-content">
              <h1>Patient Dashboard</h1>
              <h2>Welcome back, {user?.firstName || 'Patient'}</h2>
              
              <div className="welcome-details">
                <div className="welcome-detail-item">
                  <div className="welcome-detail-icon">
                    <FaUser />
                  </div>
                  <div className="welcome-detail-text">
                    <div className="welcome-detail-label">Full Name</div>
                    <div className="welcome-detail-value">{user?.firstName} {user?.lastName}</div>
                  </div>
                </div>
                
                <div className="welcome-detail-item">
                  <div className="welcome-detail-icon">
                    <FaEnvelope />
                  </div>
                  <div className="welcome-detail-text">
                    <div className="welcome-detail-label">Email</div>
                    <div className="welcome-detail-value">{user?.email}</div>
                  </div>
                </div>
                
                {user?.phone && (
                  <div className="welcome-detail-item">
                    <div className="welcome-detail-icon">
                      <FaPhone />
                    </div>
                    <div className="welcome-detail-text">
                      <div className="welcome-detail-label">Phone</div>
                      <div className="welcome-detail-value">{user?.phone}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="welcome-actions">
                <Link to="/appointment" className="dashboard-action-btn dashboard-primary-btn">
                  <FaCalendarAlt className="action-icon" /> Book New Appointment
                </Link>
                
                <Link to="/services" className="dashboard-action-btn dashboard-outline-btn">
                  <FaStethoscope className="action-icon" /> View Services
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Appointments Section */}
          <motion.div 
            className="dashboard-section"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="dashboard-section-header">
              <h3 className="dashboard-section-title">
                <FaFileMedicalAlt className="section-icon" /> Your Appointments
              </h3>
              <Link to="/appointment" className="dashboard-section-action">
                Book New <FaChevronRight />
              </Link>
            </div>

            {loading ? (
              // Skeleton loading state
              <div className="appointments-container">
                {[1, 2].map(i => (
                  <div key={i} className="skeleton-appointment">
                    <div className="skeleton-header">
                      <div className="skeleton skeleton-title"></div>
                      <div className="skeleton skeleton-badge"></div>
                    </div>
                    <div className="skeleton-details">
                      <div className="skeleton skeleton-detail"></div>
                      <div className="skeleton skeleton-detail"></div>
                      <div className="skeleton skeleton-detail"></div>
                      <div className="skeleton skeleton-detail"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <FaCalendarAlt className="empty-state-icon" />
                <p className="empty-state-message">You don't have any appointments yet.</p>
                <Link to="/appointment" className="dashboard-action-btn dashboard-primary-btn">
                  Book Your First Appointment
                </Link>
              </div>
            ) : (
              <div className="appointments-container">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment._id} 
                    className="appointment-card"
                    style={{ borderLeftColor: getStatusColor(appointment.status) }}
                  >
                    <div className="appointment-header">
                      <div>
                        <h4 className="appointment-department">{appointment.department} Department</h4>
                        <span className="appointment-id">Appointment ID: {appointment._id}</span>
                      </div>
                      <div className="appointment-status-container">
                        <span 
                          className="appointment-status"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status}
                        </span>
                        {appointment.status === 'Pending' && (
                          <div className="appointment-pending-note">
                            Waiting for admin approval
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="appointment-detail">
                        <span className="appointment-detail-label">Date</span>
                        <span className="appointment-detail-value">
                          {formatDate(appointment.appointment_date)}
                        </span>
                      </div>
                      
                      <div className="appointment-detail">
                        <span className="appointment-detail-label">Doctor</span>
                        <span className="appointment-detail-value">
                          Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                        </span>
                      </div>
                      
                      <div className="appointment-detail">
                        <span className="appointment-detail-label">Patient</span>
                        <span className="appointment-detail-value">
                          {appointment.firstName} {appointment.lastName}
                        </span>
                      </div>
                      
                      <div className="appointment-detail">
                        <span className="appointment-detail-label">Contact</span>
                        <span className="appointment-detail-value">{appointment.phone}</span>
                      </div>
                    </div>
                    
                    <div className="appointment-actions">
                      <button className="appointment-action-btn action-view">View Details</button>
                      {appointment.status === 'Pending' && (
                        <button 
                          className="appointment-action-btn action-cancel"
                          onClick={() => handleCancelAppointment(appointment._id)}
                        >
                          <FaTrash /> Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Health Overview Section with dummy data */}
          <motion.div 
            className="dashboard-section"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="dashboard-section-header">
              <h3 className="dashboard-section-title">
                <FaHeartbeat className="section-icon" /> Health Overview
              </h3>
              <span className="dashboard-section-action">
                Last Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <FaHeartbeat />
                </div>
                <div className="metric-value">72 BPM</div>
                <div className="metric-label">Heart Rate</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaTint />
                </div>
                <div className="metric-value">120/80</div>
                <div className="metric-label">Blood Pressure</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaWeight />
                </div>
                <div className="metric-value">68 kg</div>
                <div className="metric-label">Weight</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaThermometerHalf />
                </div>
                <div className="metric-value">98.6°F</div>
                <div className="metric-label">Temperature</div>
              </div>
            </div>
          </motion.div>

          {/* Next Appointment Section (Conditionally rendered) */}
          {upcomingAppointment && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="dashboard-section-title" style={{ marginBottom: '15px' }}>
                <FaClock className="section-icon" /> Your Next Appointment
              </h3>
              
              <div className="upcoming-appointment">
                <div className="upcoming-appointment-bg"></div>
                <div className="upcoming-appointment-content">
                  <div className="upcoming-date">
                    <FaCalendarAlt style={{ marginRight: '8px' }} />
                    {formatDate(upcomingAppointment.appointment_date)}
                  </div>
                  <div className="upcoming-department">
                    {upcomingAppointment.department} Department
                  </div>
                  <div className="upcoming-doctor">
                    <FaUserMd style={{ marginRight: '8px' }} />
                    Dr. {upcomingAppointment.doctor.firstName} {upcomingAppointment.doctor.lastName}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;