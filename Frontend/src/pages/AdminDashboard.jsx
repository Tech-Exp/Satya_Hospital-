import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../main";
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';

// Icons
import {
  FaUserCircle, FaCalendarCheck, FaCalendarAlt, FaChartLine,
  FaUserMd, FaHospital, FaFilter, FaEye, FaEdit,
  FaTrash, FaArrowUp, FaArrowDown, FaCheckCircle, FaTimesCircle,
  FaSearch, FaSyncAlt, FaPrint, FaDownload, FaFileCsv, FaCog,
  FaCalendarPlus, FaUserPlus
} from 'react-icons/fa';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewAppointment, setViewAppointment] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);
  const [editStatus, setEditStatus] = useState('Pending');
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const refreshData = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
        setLoading(false);
      } catch (error) {
        console.log("Error occurred while fetching appointments", error);
        toast.error("Failed to load appointments");
        setLoading(false);
      }
    };
    
    if (isAuthenticated && user && user.role === "Admin") {
      fetchAppointments();
    }
  }, [isAuthenticated, user, refreshKey]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(`http://localhost:4000/api/v1/appointment/update/${appointmentId}`, 
        { status }, 
        { withCredentials: true }
      );
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === appointmentId ? { ...appointment, status } : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const { data } = await axios.delete(`http://localhost:4000/api/v1/appointment/delete/${appointmentId}`, {
          withCredentials: true
        });
        
        // Remove the deleted appointment from state
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment._id !== appointmentId)
        );
        
        toast.success(data.message || "Appointment deleted successfully");
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error(error.response?.data?.message || "Failed to delete appointment");
      }
    }
  };
  
  // Export appointments to CSV
  const handleExportCSV = () => {
    // Get the current filtered appointments
    const appointmentsToExport = filteredAppointments;
    
    // Define CSV headers
    const headers = [
      'Appointment Number',
      'Patient Name',
      'Email',
      'Phone',
      'Doctor',
      'Department',
      'Appointment Date',
      'Status',
      'Has Visited'
    ];
    
    // Convert appointments to CSV rows
    const csvRows = appointmentsToExport.map(appointment => [
      appointment.appointmentNumber || 'N/A',
      `${appointment.firstName} ${appointment.lastName}`,
      appointment.email,
      appointment.phone,
      `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      appointment.department,
      formatDate(appointment.appointment_date),
      appointment.status,
      appointment.hasVisited ? 'Yes' : 'No'
    ]);
    
    // Add headers to the beginning
    csvRows.unshift(headers);
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `satya-hospital-appointments-${filterStatus}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Add to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print functionality for appointments
  const handlePrint = () => {
    // Get the current filtered appointments
    const appointmentsToPrint = filteredAppointments;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Satya Hospital - Appointments Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #3939d9;
            padding-bottom: 10px;
          }
          .hospital-name {
            font-size: 24px;
            font-weight: bold;
            color: #3939d9;
            margin: 0;
          }
          .report-title {
            font-size: 18px;
            margin: 5px 0;
          }
          .date {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
          }
          .pending {
            background-color: #fff3cd;
            color: #856404;
          }
          .accepted {
            background-color: #d4edda;
            color: #155724;
          }
          .rejected {
            background-color: #f8d7da;
            color: #721c24;
          }
          @media print {
            body {
              margin: 0.5cm;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="hospital-name">Satya Trauma & Maternity Center</h1>
          <p class="report-title">Appointments Report - ${filterStatus === 'all' ? 'All Appointments' : `${filterStatus} Appointments`}</p>
          <p class="date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Appointment Number</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Status</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            ${appointmentsToPrint.map(appointment => `
              <tr>
                <td>${appointment.appointmentNumber || 'N/A'}</td>
                <td>${appointment.firstName} ${appointment.lastName}</td>
                <td>Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</td>
                <td>${appointment.department}</td>
                <td>${formatDate(appointment.appointment_date)}</td>
                <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                <td>${appointment.phone}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>© ${new Date().getFullYear()} Satya Trauma & Maternity Center. All rights reserved.</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print();" style="padding: 10px 20px; margin-top: 20px; background-color: #3939d9; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
        </div>
        
        <script>
          // Auto-print when the page loads
          window.onload = function() {
            // Slight delay to ensure content is loaded
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Determine if an appointment is scheduled for today
  const isAppointmentToday = (dateString) => {
    if (!dateString) return false;

    const appointmentDate = new Date(dateString);
    if (Number.isNaN(appointmentDate.getTime())) return false;

    const today = new Date();
    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate()
    );
  };

  // Filter appointments based on status and date
  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch = filterStatus === 'all' || appointment.status === filterStatus;

    if (showTodayOnly) {
      return statusMatch && isAppointmentToday(appointment.appointment_date);
    }

    return statusMatch;
  });

  // Get counts for stats
  const totalAppointments = appointments.length;
  const pendingCount = appointments.filter(app => app.status === "Pending").length;
  const acceptedCount = appointments.filter(app => app.status === "Accepted").length;
  const rejectedCount = appointments.filter(app => app.status === "Rejected").length;

  // Get today's date
  const today = new Date().toLocaleDateString();

  // Format appointment date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Accepted': return 'accepted';
      case 'Rejected': return 'rejected';
      default: return 'pending';
    }
  };

  // Get first letter initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
        <title>Admin Dashboard | Satya Hospital</title>
        <meta name="description" content="Administrative dashboard for Satya Hospital. Manage appointments, doctors, and patient information." />
      </Helmet>
      
      <div className="admin-dashboard-container">
        <AdminSidebar />
        
        <div className="admin-content-wrapper">
          <motion.div 
            className="admin-dashboard-header"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h1 className="admin-dashboard-title">Dashboard</h1>
            <div className="admin-quick-actions">
              <button 
                className={`admin-action-btn ${showTodayOnly ? 'admin-action-primary' : 'admin-action-secondary'}`}
                onClick={() => setShowTodayOnly(!showTodayOnly)}
              >
                <FaCalendarCheck />
                {showTodayOnly ? 'Show All' : 'Check'}
              </button>
              <button 
                className="admin-action-btn admin-action-secondary"
                onClick={() => navigate('/admin/doctor/add')}
              >
                <FaUserPlus />
                Add Doctor
              </button>
            </div>
          </motion.div>

          {/* Welcome Card */}
          <motion.div 
            className="welcome-card"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="welcome-bg-shape"></div>
            <div className="welcome-bg-shape-2"></div>
            <div className="welcome-bg-shape-3"></div>
            
            <div className="welcome-content">
              <div className="welcome-title">Hello, {user && `${user.firstName} ${user.lastName}`}!</div>
              <div className="welcome-subtitle">Welcome to your admin dashboard</div>
              <p className="welcome-text">
                Manage your hospital operations, appointments, and staff from this central dashboard. 
                Today is {today}. You have {pendingCount} appointments pending approval.
              </p>
              <div className="welcome-actions">
                <button 
                  className="welcome-btn welcome-btn-primary"
                  onClick={() => {
                    setShowTodayOnly(false);
                    const appointmentsSection = document.getElementById('admin-appointments-section');
                    if (appointmentsSection) {
                      appointmentsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <FaCalendarCheck />
                  Manage Appointments
                </button>
                <button 
                  className="welcome-btn welcome-btn-secondary"
                  onClick={() => navigate('/admin/doctors')}
                >
                  <FaUserMd />
                  View Doctors
                </button>
              </div>
            </div>
            <img src='/logo.png' alt='Doctor' className="welcome-image" />
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="stats-grid"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="stat-card">
              <div className="stat-icon primary">
                <FaCalendarAlt />
              </div>
              <div className="stat-label">Total Appointments</div>
              <div className="stat-value">{totalAppointments}</div>
              <div className="stat-trend trend-up">
                <FaArrowUp className="trend-icon" /> 12% this week
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <FaCalendarCheck />
              </div>
              <div className="stat-label">Pending Approvals</div>
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-trend trend-down">
                <FaArrowDown className="trend-icon" /> 5% this week
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <FaHospital />
              </div>
              <div className="stat-label">Accepted</div>
              <div className="stat-value">{acceptedCount}</div>
              <div className="stat-trend trend-up">
                <FaArrowUp className="trend-icon" /> 8% this week
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon danger">
                <FaUserMd />
              </div>
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{rejectedCount}</div>
              <div className="stat-trend trend-down">
                <FaArrowDown className="trend-icon" /> 3% this week
              </div>
            </div>
          </motion.div>

          {/* Appointments Table */}
          <motion.div 
            className="appointments-card"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="admin-appointments-section"
          >
            <div className="card-header">
              <h2 className="card-title">
                <FaCalendarCheck className="card-icon" /> All Appointments
              </h2>
              <div className="card-actions">
                <select 
                  className="card-filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button className="card-action-btn" onClick={refreshData}>
                  <FaSyncAlt className="card-action-icon" /> Refresh
                </button>
                <button className="card-action-btn" onClick={handlePrint}>
                  <FaPrint className="card-action-icon" /> Print
                </button>
                <button className="card-action-btn" onClick={handleExportCSV}>
                  <FaFileCsv className="card-action-icon" /> Export
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="appointments-table-wrapper">
              {loading ? (
                // Loading skeleton
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Visited</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="skeleton-row">
                        <td><div className="skeleton skeleton-cell" style={{ width: '100px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '150px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '120px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '100px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '80px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '80px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '40px' }}></div></td>
                        <td><div className="skeleton skeleton-cell" style={{ width: '100px' }}></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <FaCalendarAlt className="empty-state-icon" />
                  <h3 className="empty-state-title">No Appointments Found</h3>
                  <p className="empty-state-message">There are no appointments matching your filter criteria</p>
                  <button className="empty-state-btn">
                    <FaCalendarPlus /> Create New Appointment
                  </button>
                </div>
              ) : (
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Appointment #</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Visited</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>
                          <div className="appointment-number-cell">
                            <span className="appointment-number-badge">
                              {appointment.appointmentNumber || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="patient-info">
                            <div className="patient-avatar">
                              {getInitials(appointment.firstName, appointment.lastName)}
                            </div>
                            <div>
                              <div className="patient-name">
                                {`${appointment.firstName} ${appointment.lastName}`}
                              </div>
                              <div className="patient-email">
                                {appointment.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                        <td>{appointment.department}</td>
                        <td>{formatDate(appointment.appointment_date)}</td>
                        <td>
                          <select 
                            className={`status-select ${getStatusClass(appointment.status)}`}
                            value={appointment.status}
                            onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          {appointment.hasVisited ? 
                            <FaCheckCircle className="visited-yes" /> : 
                            <FaTimesCircle className="visited-no" />
                          }
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="action-btn view-btn" 
                              title="View Details"
                              onClick={() => setViewAppointment(appointment)}
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="action-btn edit-btn" 
                              title="Edit Appointment"
                              onClick={() => {
                                setEditAppointment(appointment);
                                setEditStatus(appointment.status);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="action-btn delete-btn" 
                              title="Delete Appointment"
                              onClick={() => handleDeleteAppointment(appointment._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="appointments-card-mobile">
              {loading ? (
                <div className="empty-state">
                  <div className="loading-spinner"></div>
                  <p>Loading appointments...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <FaCalendarAlt className="empty-state-icon" />
                  <h3 className="empty-state-title">No Appointments Found</h3>
                  <p className="empty-state-message">There are no appointments matching your filter criteria</p>
                  <button className="empty-state-btn">
                    <FaCalendarPlus /> Create New Appointment
                  </button>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card-mobile">
                    <div className="appointment-card-mobile-header">
                      <div className="patient-info">
                        <div className="patient-avatar">
                          {getInitials(appointment.firstName, appointment.lastName)}
                        </div>
                        <div>
                          <h3 className="appointment-card-mobile-title">
                            {`${appointment.firstName} ${appointment.lastName}`}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            {appointment.email}
                          </p>
                        </div>
                      </div>
                      {appointment.hasVisited ? 
                        <FaCheckCircle className="visited-yes" style={{ fontSize: '20px' }} /> : 
                        <FaTimesCircle className="visited-no" style={{ fontSize: '20px' }} />
                      }
                    </div>
                    <div className="appointment-card-mobile-body">
                      <div className="appointment-card-mobile-row">
                        <span className="appointment-card-mobile-label">Appointment #:</span>
                        <span className="appointment-card-mobile-value" style={{ fontWeight: 'bold', color: '#3939d9' }}>
                          {appointment.appointmentNumber || 'N/A'}
                        </span>
                      </div>
                      <div className="appointment-card-mobile-row">
                        <span className="appointment-card-mobile-label">Doctor:</span>
                        <span className="appointment-card-mobile-value">
                          {`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                        </span>
                      </div>
                      <div className="appointment-card-mobile-row">
                        <span className="appointment-card-mobile-label">Department:</span>
                        <span className="appointment-card-mobile-value">{appointment.department}</span>
                      </div>
                      <div className="appointment-card-mobile-row">
                        <span className="appointment-card-mobile-label">Date:</span>
                        <span className="appointment-card-mobile-value">{formatDate(appointment.appointment_date)}</span>
                      </div>
                    </div>
                    <div className="appointment-card-mobile-actions">
                      <select 
                        className={`status-select ${getStatusClass(appointment.status)}`}
                        value={appointment.status}
                        onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <div className="table-actions">
                        <button 
                          className="action-btn view-btn" 
                          title="View Details"
                          onClick={() => setViewAppointment(appointment)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-btn edit-btn" 
                          title="Edit Appointment"
                          onClick={() => {
                            setEditAppointment(appointment);
                            setEditStatus(appointment.status);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          title="Delete Appointment"
                          onClick={() => handleDeleteAppointment(appointment._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* View Appointment Modal */}
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
              <div><strong>Department:</strong> {viewAppointment.department}</div>
              <div><strong>Doctor:</strong> Dr. {viewAppointment.doctor?.firstName} {viewAppointment.doctor?.lastName}</div>
              <div><strong>Status:</strong> {viewAppointment.status}</div>
              <div><strong>Visited:</strong> {viewAppointment.hasVisited ? 'Yes' : 'No'}</div>
              <div><strong>Aadhaar:</strong> {viewAppointment.nic}</div>
              <div><strong>Address:</strong> {viewAppointment.address}</div>
            </div>
            <button className="appointment-modal-close" onClick={() => setViewAppointment(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {editAppointment && (
        <div className="appointment-modal-backdrop" onClick={() => setEditAppointment(null)}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Appointment</h2>
            <div className="appointment-modal-content">
              <div><strong>Appointment #:</strong> {editAppointment.appointmentNumber || 'N/A'}</div>
              <div><strong>Patient:</strong> {editAppointment.firstName} {editAppointment.lastName}</div>
              <div className="appointment-edit-field">
                <label>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="appointment-edit-helper">
                Use the dropdown above to update the appointment status.
              </div>
            </div>
            <div className="appointment-modal-actions">
              <button
                className="appointment-modal-save"
                onClick={() => {
                  handleUpdateStatus(editAppointment._id, editStatus);
                  setEditAppointment(null);
                }}
              >
                Save Changes
              </button>
              <button className="appointment-modal-close" onClick={() => setEditAppointment(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;