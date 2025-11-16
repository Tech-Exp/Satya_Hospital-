import React from 'react'
import { FaHeartbeat, FaUserMd, FaAward, FaHandHoldingMedical, FaHospitalUser, FaNotesMedical } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const Biography = ({ imageUrl }) => {
  const { translate } = useLanguage();
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <section className="about-container">
        <div className="about-header" >
          <motion.h1
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            style={{overflow : "hidden"}}
          >
            {translate("About Satya Hospital")}
          </motion.h1>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {translate("Providing exceptional healthcare services with compassion and expertise since 1995. At Satya Trauma & Maternity Center, we combine advanced medical technology with personalized care to ensure the best outcomes for our patients.")}
          </motion.p>
        </div>

        <div className="container">
          <div className="about-grid" style={{overflow : "hidden"}}>
            <motion.div 
              className="about-image"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              <img src={imageUrl} alt="Satya Hospital" />
            </motion.div>
            
            <motion.div 
              className="about-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 style={{overflow : "hidden",}}>{translate("Excellence in Healthcare")}</h2>
              <p>
                {translate("Founded with a vision to provide world-class healthcare services to the people of Kanpur and surrounding areas, Satya Trauma & Maternity Center has grown to become one of the most trusted healthcare institutions in the region.")}
              </p>
              <p>
                {translate("Our state-of-the-art facilities, coupled with a team of experienced medical professionals, ensure that patients receive the highest standard of care in a comfortable and supportive environment.")}
              </p>
              <p>
                {translate("We specialize in trauma care, maternity services, and a wide range of other medical specialties, catering to the diverse healthcare needs of our community.")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-content">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            {translate("Our Mission & Vision")}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {translate("To deliver exceptional healthcare services with compassion, integrity, and excellence, improving the health and well-being of the communities we serve. Our vision is to be the most trusted healthcare provider, recognized for our clinical excellence and patient-centered care.")}
          </motion.p>
        </div>
      </section>

      <section className="container">
        <div className="values-grid" style={{overflow : "hidden"}}>
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaHeartbeat />
            </div>
            <h3>{translate("Compassionate Care")}</h3>
            <p>{translate("We treat each patient with kindness, empathy, and respect, putting their needs at the center of everything we do.")}</p>
          </motion.div>
          
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaUserMd />
            </div>
            <h3>{translate("Clinical Excellence")}</h3>
            <p>{translate("We maintain the highest standards of medical practice, constantly innovating and improving our services.")}</p>
          </motion.div>
          
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaAward />
            </div>
            <h3>{translate("Integrity & Ethics")}</h3>
            <p>{translate("We adhere to the highest ethical standards in all our interactions, building trust with our patients and community.")}</p>
          </motion.div>
          
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaHandHoldingMedical />
            </div>
            <h3>{translate("Patient-Centered Approach")}</h3>
            <p>{translate("We design our services around the needs of our patients, ensuring personalized care for everyone.")}</p>
          </motion.div>
          
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaHospitalUser />
            </div>
            <h3>{translate("Community Focus")}</h3>
            <p>{translate("We are committed to improving the health and well-being of the communities we serve through education and outreach.")}</p>
          </motion.div>
          
          <motion.div 
            className="value-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ y: -10 }}
          >
            <div className="value-icon">
              <FaNotesMedical />
            </div>
            <h3>{translate("Continuous Improvement")}</h3>
            <p>{translate("We are dedicated to continually enhancing our services and facilities to provide the best possible care.")}</p>
          </motion.div>
        </div>
      </section>

      <section className="achievements-section">
        <div className="achievements-grid" style={{overflow : "hidden"}}>
          <motion.div 
            className="achievement-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <div className="achievement-number">25+</div>
            <div className="achievement-text">{translate("Years of Excellence")}</div>
          </motion.div>
          
          <motion.div 
            className="achievement-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="achievement-number">50+</div>
            <div className="achievement-text">{translate("Skilled Doctors")}</div>
          </motion.div>
          
          <motion.div 
            className="achievement-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="achievement-number">10K+</div>
            <div className="achievement-text">{translate("Successful Deliveries")}</div>
          </motion.div>
          
          <motion.div 
            className="achievement-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="achievement-number">98%</div>
            <div className="achievement-text">{translate("Patient Satisfaction")}</div>
          </motion.div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content" style={{overflow : "hidden"}}>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            {translate("Ready to Experience Our Care?")}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {translate("Book an appointment today and let our team of healthcare professionals take care of you and your loved ones.")}
          </motion.p>
          <motion.a 
            href="/appointment" 
            className="cta-button"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {translate("Book Appointment")}
          </motion.a>
        </div>
      </section>
    </>
  )
}

export default Biography