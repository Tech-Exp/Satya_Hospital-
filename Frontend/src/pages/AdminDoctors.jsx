import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDoctors.css';

// Icons
import { 
  FaUserMd, FaEnvelope, FaPhone, FaBirthdayCake, 
  FaIdCard, FaVenusMars, FaHospital, FaUserPlus,
  FaEye, FaEdit, FaTrash, FaSearch, FaFilter
} from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { isAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();

  const resolveDoctorPhoto = (doctor) => {
    if (doctor.docPhoto?.url) return doctor.docPhoto.url;
    if (typeof doctor.docPhoto === 'string') {
      return `http://localhost:4000/${doctor.docPhoto.replace(/\\/g, '/')}`;
    }
    return '/doc.jpg';
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get unique departments from doctors
  const departments = doctors.length > 0 
    ? ['all', ...new Set(doctors.map(doctor => doctor.doctorDepartment))] 
    : ['all'];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
        setLoading(false);
      }
    };
    
    if (isAuthenticated && user?.role === "Admin") {
      fetchDoctors();
    }
  }, [isAuthenticated, user]);

  // Filter doctors by department
  const filteredDoctors = selectedDepartment === 'all'
    ? doctors
    : doctors.filter(doctor => doctor.doctorDepartment === selectedDepartment);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddDoctor = () => {
    navigate('/admin/doctor/add');
  };

  const handleDeleteDoctor = async (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/user/doctor/${doctorId}`, {
        withCredentials: true
      });
      toast.success(data.message || 'Doctor deleted successfully');
      setDoctors((prev) => prev.filter((doc) => doc._id !== doctorId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
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
        <title>Manage Doctors | Satya Hospital Admin</title>
        <meta name="description" content="Manage hospital doctors, view their details, and add new doctors to the system." />
      </Helmet>

      <div className="admin-doctors-container">
        <AdminSidebar />
        
        <motion.div 
          className="doctors-header"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="doctors-title">Hospital Doctors</h1>
          <div className="doctors-actions">
            <button className="doctor-action-btn doctor-action-primary" onClick={handleAddDoctor}>
              <FaUserPlus />
              Add New Doctor
            </button>
          </div>
        </motion.div>

        {/* Department filters */}
        {!loading && doctors.length > 0 && (
          <motion.div 
            className="doctor-filters"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="doctor-filter-label">
              <FaFilter /> Filter by:
            </div>
            {departments.map((dept, index) => (
              <div 
                key={index} 
                className={`doctor-filter-item ${selectedDepartment === dept ? 'active' : ''}`}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </div>
            ))}
          </motion.div>
        )}

        {/* Doctors grid */}
        <div className="doctors-grid">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <motion.div 
                key={index}
                className="doctor-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="doctor-skeleton-header">
                  <div className="doctor-skeleton-image"></div>
                </div>
                <div className="doctor-skeleton-body">
                  <div className="doctor-skeleton-name"></div>
                  <div className="doctor-skeleton-specialty"></div>
                  <div className="doctor-skeleton-info">
                    <div className="doctor-skeleton-info-item"></div>
                    <div className="doctor-skeleton-info-item"></div>
                    <div className="doctor-skeleton-info-item"></div>
                  </div>
                  <div className="doctor-skeleton-footer">
                    <div className="doctor-skeleton-action"></div>
                    <div className="doctor-skeleton-action"></div>
                    <div className="doctor-skeleton-action"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : filteredDoctors.length === 0 ? (
            <motion.div 
              className="empty-doctors"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              style={{ gridColumn: '1 / -1' }}
            >
              <FaUserMd className="empty-doctors-icon" />
              <h3 className="empty-doctors-title">No Doctors Found</h3>
              <p className="empty-doctors-message">
                {selectedDepartment === 'all' 
                  ? "There are no doctors registered in the system. Add a new doctor to get started."
                  : `There are no doctors in the ${selectedDepartment} department. Try selecting a different department or add a new doctor.`
                }
              </p>
              <button className="empty-doctors-btn" onClick={handleAddDoctor}>
                <FaUserPlus /> Add New Doctor
              </button>
            </motion.div>
          ) : (
            // Doctor cards
            filteredDoctors.map((doctor, index) => (
              <motion.div 
                className="doctor-card" 
                key={doctor._id || index}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="doctor-card-header" style={{textAlign :"center"}}>
                  <div className="doctor-department-badge">
                    {doctor.doctorDepartment}
                  </div>
                  <div className="doctor-image-container">
                    <img 
                      src={resolveDoctorPhoto(doctor)} 
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      className="doctor-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/doc.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="doctor-card-body">
                  <h3 className="doctor-name">Dr. {doctor.firstName} {doctor.lastName}</h3>
                  <p className="doctor-specialty">{doctor.doctorDepartment} Specialist</p>
                  <div className="doctor-info">
                    <div className="doctor-info-item">
                      <FaEnvelope className="doctor-info-icon" />
                      <span className="doctor-info-text">{doctor.email}</span>
                    </div>
                    <div className="doctor-info-item">
                      <FaPhone className="doctor-info-icon" />
                      <span className="doctor-info-text">{doctor.phone}</span>
                    </div>
                    <div className="doctor-info-item">
                      <FaBirthdayCake className="doctor-info-icon" />
                      <span className="doctor-info-text">{formatDate(doctor.dob)}</span>
                    </div>
                    <div className="doctor-info-item">
                      <FaVenusMars className="doctor-info-icon" />
                      <span className="doctor-info-text">{doctor.gender}</span>
                    </div>
                    <div className="doctor-info-item">
                      <FaIdCard className="doctor-info-icon" />
                      <span className="doctor-info-text">{doctor.nic}</span>
                    </div>
                  </div>
                </div>
                <div className="doctor-card-footer">
                  <button className="doctor-action doctor-view">
                    <FaEye /> View
                  </button>
                  <button className="doctor-action doctor-edit">
                    <FaEdit /> Edit
                  </button>
                  <button className="doctor-action doctor-delete" onClick={() => handleDeleteDoctor(doctor._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDoctors;