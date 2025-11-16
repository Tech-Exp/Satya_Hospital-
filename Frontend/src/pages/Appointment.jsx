import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../main';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Hero from "../components/Hero";
import AppointmentForm from '../components/AppointmentForm';
import DirectAppointmentForm from '../components/DirectAppointmentForm';
import './Appointment.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Appointment = () => {
  const { isAuthenticated } = useContext(Context);
  const [showDirectForm, setShowDirectForm] = useState(true);
  const { translate } = useLanguage();

  useEffect(() => {
    // If user is authenticated, we'll show the regular appointment form
    if (isAuthenticated) {
      setShowDirectForm(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>{translate("Book an Appointment | Satya Hospital")}</title>
        <meta name="description" content={translate("Schedule your appointment with our specialists at Satya Hospital")} />
      </Helmet>
      
      <Hero title={translate("Schedule Your Appointment || Satya Hospital, Kanpur")} imageUrl={"/image.png"}/>
      
      <div className="appointment-container">
        {isAuthenticated ? (
          // Show regular appointment form for authenticated users
          <AppointmentForm />
        ) : (
          // Show embedded direct appointment form for non-authenticated users
          <motion.div 
            className="direct-appointment-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="appointment-header">
              <h2>{translate("Book Your Appointment")}</h2>
              <p>{translate("Fill out the form below to schedule an appointment with our specialists")}</p>
            </div>
            
            <DirectAppointmentForm 
              isOpen={showDirectForm} 
              onClose={() => setShowDirectForm(false)}
              embedded={true}
            />
          </motion.div>
        )}
      </div>
    </>
  )
}

export default Appointment
