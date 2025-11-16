import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUserMd, FaCalendarAlt, FaCalendarCheck, FaCalendarTimes,
  FaUserInjured, FaStethoscope, FaClock, FaEye, FaCheckCircle,
  FaSignOutAlt, FaFilter, FaSearch
} from 'react-icons/fa';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { isAuthenticated, user, setIsAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('Accepted');
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    total: 0
  });
  const [viewAppointment, setViewAppointment] = useState(null);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fetch appointments based on selected date and status
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log(`Fetching appointments for date: ${selectedDate}, status: ${selectedStatus}`);
      
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/appointment/doctor?date=${selectedDate}&status=${selectedStatus}`,
        { withCredentials: true }
      );
      
      console.log(`Received ${data.count} appointments:`, data.appointments);
      setAppointments(data.appointments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
      setLoading(false);
    }
  };

  // Fetch appointment statistics
  const fetchStats = async () => {
    try {
      // Get today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await axios.get(
        `http://localhost:4000/api/v1/appointment/doctor?date=${today}`,
        { withCredentials: true }
      );
      
      // Get all appointments
      const allResponse = await axios.get(
        'http://localhost:4000/api/v1/appointment/doctor',
        { withCredentials: true }
      );
      
      // Get pending appointments
      const pendingResponse = await axios.get(
        'http://localhost:4000/api/v1/appointment/doctor?status=Pending',
        { withCredentials: true }
      );
      
      // Get completed appointments
      const completedResponse = await axios.get(
        'http://localhost:4000/api/v1/appointment/doctor?status=Completed',
        { withCredentials: true }
      );
      
      setStats({
        today: todayResponse.data.count || 0,
        total: allResponse.data.count || 0,
        pending: pendingResponse.data.count || 0,
        completed: completedResponse.data.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "Doctor") {
      fetchAppointments();
      fetchStats();
    }
  }, [isAuthenticated, user, selectedDate, selectedStatus]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };
  
  // Handle mark as complete
  const handleMarkAsComplete = async (appointmentId) => {
    try {
      if (!confirm("Are you sure you want to mark this appointment as completed?")) {
        return;
      }
      
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/status/${appointmentId}`,
        { status: "Completed" },
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success("Appointment marked as completed");
        // Update the appointment in the state
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment._id === appointmentId 
              ? { ...appointment, status: "Completed" } 
              : appointment
          )
        );
        
        // Update stats - increase completed count
        setStats(prevStats => ({
          ...prevStats,
          completed: prevStats.completed + 1
        }));
        
        // Refresh data to get updated stats and appointments
        fetchStats();
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment status");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/doctor/logout", { 
        withCredentials: true,
      });
      
      toast.success(response.data.message);
      setIsAuthenticated(false);
      
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Doctor logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  // Format time from date string
  const formatTime = (dateString) => {
    try {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date for time formatting:", dateString);
        return "Time not specified"; // Return a fallback message
      }
      
      return date.toLocaleTimeString(undefined, options);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time not specified"; // Return a fallback message on error
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return dateString; // Return the original string if invalid
      }
      
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string on error
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== "Doctor") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard | Satya Hospital</title>
      </Helmet>

      <div className="doctor-dashboard-container">
        <div className="container">
          {/* Welcome Section */}
          <motion.div 
            className="doctor-welcome-card"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="doctor-bg-shape"></div>
            <div className="doctor-welcome-content">
              <div className="doctor-welcome-header">
                <div>
                  <h1>Doctor Dashboard</h1>
                  <h2>Welcome, Dr. {user?.firstName || ''} {user?.lastName || ''}</h2>
                  <p className="doctor-department">
                    {user?.doctorDepartment || 'Department'} Specialist
                  </p>
                  <p className="doctor-welcome-message">
                    Here you can view and manage your appointments. You have <strong>{stats.today} appointments</strong> scheduled for today.
                  </p>
                </div>
                
                <div className="doctor-profile">
                  <div className="doctor-avatar">
                    {user?.docPhoto?.url ? (
                      <img 
                        src={user.docPhoto.url} 
                        alt={`Dr. ${user?.firstName || ''} ${user?.lastName || ''}`}
                        className="doctor-avatar-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/doc.png";
                        }}
                      />
                    ) : (
                      <div className="doctor-avatar-placeholder">
                        {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="doctor-welcome-actions">
                <button className="doctor-action-btn doctor-primary-btn" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
                <button className="doctor-action-btn doctor-secondary-btn" onClick={() => window.print()}>
                  <FaCalendarCheck /> Print Schedule
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="doctor-stats-grid"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="doctor-stat-card">
              <div className="doctor-stat-icon icon-primary">
                <FaCalendarAlt />
              </div>
              <div className="doctor-stat-value">{stats.today}</div>
              <div className="doctor-stat-label">Today's Appointments</div>
            </div>

            <div className="doctor-stat-card">
              <div className="doctor-stat-icon icon-success">
                <FaCalendarCheck />
              </div>
              <div className="doctor-stat-value">{stats.total}</div>
              <div className="doctor-stat-label">Total Appointments</div>
            </div>

            <div className="doctor-stat-card">
              <div className="doctor-stat-icon icon-warning">
                <FaClock />
              </div>
              <div className="doctor-stat-value">{stats.pending}</div>
              <div className="doctor-stat-label">Pending Appointments</div>
            </div>

            <div className="doctor-stat-card">
              <div className="doctor-stat-icon icon-danger">
                <FaStethoscope />
              </div>
              <div className="doctor-stat-value">{stats.completed}</div>
              <div className="doctor-stat-label">Completed Appointments</div>
            </div>
          </motion.div>

          {/* Appointments Section */}
          <motion.div 
            className="doctor-appointments-card"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="doctor-card-header">
              <h3 className="doctor-card-title">
                <FaCalendarCheck className="doctor-card-icon" /> Your Appointments
              </h3>
            </div>

            <div className="doctor-controls">
              <div className="doctor-date-filter">
                <label htmlFor="appointment-date">Date:</label>
                <input
                  type="date"
                  id="appointment-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>

              <div className="doctor-status-filter">
                <button 
                  className={`status-filter-btn ${selectedStatus === 'Accepted' ? 'active' : ''}`}
                  onClick={() => handleStatusFilter('Accepted')}
                >
                  Accepted
                </button>
                <button 
                  className={`status-filter-btn ${selectedStatus === 'Completed' ? 'active' : ''}`}
                  onClick={() => handleStatusFilter('Completed')}
                >
                  Completed
                </button>
                <button 
                  className={`status-filter-btn ${selectedStatus === 'Pending' ? 'active' : ''}`}
                  onClick={() => handleStatusFilter('Pending')}
                >
                  Pending
                </button>
                <button 
                  className={`status-filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilter('all')}
                >
                  All
                </button>
              </div>
            </div>

            {loading ? (
              // Loading skeletons
              <div className="doctor-appointments-list">
                {[1, 2, 3].map(i => (
                  <div key={i} className="doctor-skeleton">
                    <div className="doctor-skeleton-header">
                      <div className="doctor-skeleton-time skeleton"></div>
                      <div className="doctor-skeleton-status skeleton"></div>
                    </div>
                    <div className="doctor-skeleton-details">
                      <div className="doctor-skeleton-detail skeleton"></div>
                      <div className="doctor-skeleton-detail skeleton"></div>
                      <div className="doctor-skeleton-detail skeleton"></div>
                      <div className="doctor-skeleton-detail skeleton"></div>
                    </div>
                    <div className="doctor-skeleton-actions">
                      <div className="doctor-skeleton-btn skeleton"></div>
                      <div className="doctor-skeleton-btn skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : appointments.length === 0 ? (
              // Empty state
              <div className="doctor-empty-state">
                <FaCalendarTimes className="doctor-empty-state-icon" />
                <h3 className="doctor-empty-state-title">No Appointments Found</h3>
                <p className="doctor-empty-state-message">
                  {selectedStatus === 'all' 
                    ? `You don't have any appointments scheduled for ${formatDate(selectedDate)}.`
                    : `You don't have any ${selectedStatus.toLowerCase()} appointments for ${formatDate(selectedDate)}.`
                  }
                </p>
              </div>
            ) : (
              // Appointments list
              <div className="doctor-appointments-list">
                {appointments.map(appointment => (
                  <div key={appointment._id} className="doctor-appointment-item">
                    <div className="doctor-appointment-header">
                      <div className="doctor-appointment-time">
                        {formatTime(appointment.appointment_date)}
                      </div>
                      <div className={`doctor-appointment-status status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="doctor-appointment-details">
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Appointment Number</div>
                        <div className="doctor-detail-value appointment-id">
                          {appointment.appointmentNumber || `#${appointment._id.substring(appointment._id.length - 8)}`}
                        </div>
                      </div>
                    
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Patient Name</div>
                        <div className="doctor-detail-value patient-name">
                          {appointment.firstName} {appointment.lastName}
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Gender</div>
                        <div className="doctor-detail-value">
                          {appointment.gender}
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Age</div>
                        <div className="doctor-detail-value">
                          {appointment.dob ? Math.floor((new Date() - new Date(appointment.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} years
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Phone</div>
                        <div className="doctor-detail-value">
                          <a href={`tel:${appointment.phone}`}>{appointment.phone}</a>
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Email</div>
                        <div className="doctor-detail-value">
                          <a href={`mailto:${appointment.email}`}>{appointment.email}</a>
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Department</div>
                        <div className="doctor-detail-value department-badge">
                          {appointment.department}
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Appointment Date</div>
                        <div className="doctor-detail-value">
                          {formatDate(appointment.appointment_date)}
                        </div>
                      </div>
                      
                      <div className="doctor-appointment-detail">
                        <div className="doctor-detail-label">Previous Visit</div>
                        <div className="doctor-detail-value">
                          {appointment.hasVisited ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="doctor-appointment-actions">
                      <button
                        className="doctor-appointment-btn doctor-view-btn"
                        onClick={() => setViewAppointment(appointment)}
                      >
                        <FaEye /> View Details
                      </button>
                      {(appointment.status === 'Accepted' || appointment.status === 'Pending') && (
                        <button 
                          className="doctor-appointment-btn doctor-complete-btn"
                          onClick={() => handleMarkAsComplete(appointment._id)}
                        >
                          <FaCheckCircle /> {appointment.status === 'Pending' ? 'Mark as Done' : 'Mark as Completed'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {viewAppointment && (
        <div className="appointment-modal-backdrop" onClick={() => setViewAppointment(null)}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Appointment Details</h2>
            <div className="appointment-modal-content">
              <div><strong>Appointment #:</strong> {viewAppointment.appointmentNumber || 'N/A'}</div>
              <div><strong>Patient:</strong> {viewAppointment.firstName} {viewAppointment.lastName}</div>
              <div><strong>Email:</strong> {viewAppointment.email}</div>
              <div><strong>Phone:</strong> {viewAppointment.phone}</div>
              <div><strong>Date:</strong> {formatDate(viewAppointment.appointment_date)}</div>
              <div><strong>Status:</strong> {viewAppointment.status}</div>
              <div><strong>Visited:</strong> {viewAppointment.hasVisited ? 'Yes' : 'No'}</div>
              <div><strong>Aadhaar:</strong> {viewAppointment.nic}</div>
              <div><strong>Address:</strong> {viewAppointment.address}</div>
            </div>
            <button className="appointment-modal-close" onClick={() => setViewAppointment(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDashboard;
