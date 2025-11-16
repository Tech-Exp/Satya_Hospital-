import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaUserMd, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaIdCard, FaHospital } from "react-icons/fa";
import './Doctors.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [departments, setDepartments] = useState([]);

  const { translate } = useLanguage();
  const t = translate;

  const headerHighlights = [
    'Trusted Specialists',
    'Personalized Care Plans',
    'Multidisciplinary Team'
  ];
  
  console.log("Doctors component rendering");

  useEffect(() => {
    const fetchDoctors = async() => {
      try {
        setLoading(true);
        console.log("Fetching doctors data...");
        const {data} = await axios.get("http://localhost:4000/api/v1/user/doctors");
        
        console.log("Doctors data received:", data);
        
        if (data && data.doctors) {
          console.log("Setting doctors state:", data.doctors);
          setDoctors(data.doctors);
          
          // Extract unique departments
          const uniqueDepartments = [...new Set(data.doctors
            .filter(doctor => doctor.doctorDepartment)
            .map(doctor => doctor.doctorDepartment))];
          
          console.log("Setting departments:", ['All', ...uniqueDepartments]);
          setDepartments(['All', ...uniqueDepartments]);
        } else {
          console.log("No doctors data found in response");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Filter doctors by department
  const filteredDoctors = selectedDepartment === 'All' 
    ? doctors 
    : doctors.filter(doctor => doctor.doctorDepartment === selectedDepartment);

  return (
    <>
      <Helmet>
        <title>{t("Our Doctors | Satya Hospital")}</title>
        <meta name="description" content={t("Meet our team of experienced doctors at Satya Hospital")}/>
      </Helmet>
      
      <div className="doctors-page">
        <div className="doctors-header">
          <motion.span
            className="doctors-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t("Compassion Meets Expertise")}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("Our Medical Specialists")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("Meet our team of experienced doctors dedicated to providing you with the best healthcare")}
          </motion.p>
          <div className="doctors-header-highlights">
            {headerHighlights.map((badge) => (
              <span key={badge} className="doctors-highlight-chip">{t(badge)}</span>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="department-filter"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {departments.map((dept, index) => (
            <motion.button
              key={index}
              className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
              onClick={() => setSelectedDepartment(dept)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dept === 'All' ? t('All') : t(dept) || dept}
            </motion.button>
          ))}
        </motion.div>

        <div className="doctors-scroll-hint">
          <span>{t("Scroll to meet more doctors")}</span>
        </div>
        
        {loading ? (
          <div className="doctors-loading">
            <div className="loading-spinner"></div>
            <p>{t("Loading doctors...")}</p>
          </div>
        ) : (
          <motion.div 
            className="doctors-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.slice(0, 9).map((doctor, index) => (
                <motion.div 
                  key={index}
                  className="doctor-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={index < 3 ? { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' } : {}}
                >
                  <div className="doctor-image">
                    {doctor.docPhoto ? (
                      <img 
                        src={doctor.docPhoto.url || `http://localhost:4000/${doctor.docPhoto.replace(/\\/g, '/')}`} 
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        onError={(e) => {
                          console.log("Image error, using fallback");
                          e.target.onerror = null;
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                        }}
                      />
                    ) : (
                      <div className="doctor-initials">
                        {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="doctor-info" style={{textAlign : "center", textWrap : "wrap"}}>
                    <h3>{t("Dr.")} {doctor.firstName} {doctor.lastName}</h3>
                    <div className="doctor-specialty">
                      <span className="doctor-detail-icon">
                        <FaHospital />
                      </span>
                      <span className="doctor-specialty-text">{doctor.doctorDepartment || t("Specialist")}</span>
                    </div>
                    <div className="doctor-details">
                      <div className="detail-item">
                        <span className="doctor-detail-icon small">
                          <FaEnvelope />
                        </span>
                        <span className="detail-text">{doctor.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="doctor-detail-icon small">
                          <FaPhone />
                        </span>
                        <span className="detail-text">{doctor.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="doctor-detail-icon small">
                          <FaVenusMars />
                        </span>
                        <span className="detail-text">{t(doctor.gender || 'N/A')}</span>
                      </div>
                    </div>
                    
                    <motion.button 
                      className="book-appointment-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = "/appointment"}
                    >
                      {t("Book Appointment")}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="no-doctors">
                <FaUserMd size={50} />
                <h3>{t("No doctors found in this department")}</h3>
                <p>{t("Please try selecting a different department")}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Doctors;