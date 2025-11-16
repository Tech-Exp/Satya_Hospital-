import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FaHeartbeat, FaWheelchair, FaBaby, FaBrain, FaXRay, FaFlask, 
  FaAmbulance, FaHospital, FaTooth, FaEye, FaLungs, FaSearch,
  FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import './Services.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Services = () => {
  const { translate: t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const highlightBadges = [
    '24/7 Emergency Support',
    'Specialists On Call',
    'Modern Diagnostics'
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Services data
  const services = [
    {
      id: 1,
      title: "Emergency Care",
      description: "24/7 emergency medical services with advanced life-saving equipment and experienced trauma specialists for immediate critical care.",
      image: "/Emergency.jpg",
      icon: <FaAmbulance />,
      category: "emergency",
      features: [
        "24/7 availability",
        "Advanced life support",
        "Specialized trauma team",
        "Critical care units"
      ]
    },
    {
      id: 2,
      title: "Maternity Services",
      description: "Comprehensive maternity care from prenatal to postnatal with dedicated obstetricians and modern delivery rooms for a safe birthing experience.",
      image: "/Maternity.jpg",
      icon: <FaBaby />,
      category: "maternity",
      features: [
        "Prenatal checkups",
        "Normal and cesarean deliveries",
        "Neonatal care",
        "Postnatal support"
      ]
    },
    {
      id: 3,
      title: "EAR, NOSE &  THROAT",
      description: "ENT stands for Ear, Nose, and Throat, also known as Otolaryngology. It is a medical specialty that focuses on the diagnosis, treatment, and management of disorders related to the ear, nose, throat, head, and neck.",
      image: "/ent.jpg",
      icon: <FaBrain />,
      category: "specialty",
      features: [
        "EAR diagnosis",
        "NOSE Diagonsis",
        "THROAT Diagonsis",
        "ENT treatment"
      ]
    },
    {
      id: 4,
      title: "Spine and Neurosurgery",
      description: "Spine and Neurosurgery is a medical specialty that focuses on the diagnosis, treatment, and surgical management of diseases and disorders affecting the brain, spinal cord, nerves, and spine.",
      image: "/spine.jpg",
      icon: <FaHeartbeat />,
      category: "specialty",
      features: [
        "Spinal fusion",
        "Minimally invasive surgery",
        "Deep brain stimulation (DBS)",
        "Stereotactic radiosurgery"
      ]
    },
    {
      id: 5,
      title: "Radiology & Imaging",
      description: "Advanced imaging services including X-ray, MRI, CT scan, and ultrasound for accurate diagnostics and treatment planning.",
      image: "/Radiology.jpg",
      icon: <FaXRay />,
      category: "diagnostics",
      features: [
        "X-ray services",
        "CT scans",
        "MRI scanning",
        "Ultrasound"
      ]
    },
    {
      id: 6,
      title: "Laboratory Services",
      description: "Comprehensive diagnostic laboratory tests with quick and accurate results to aid in proper diagnosis and treatment planning.",
      image: "/Labrotary.jpg",
      icon: <FaFlask />,
      category: "diagnostics",
      features: [
        "Blood tests",
        "Urine analysis",
        "Pathology",
        "Microbiology"
      ]
    },
    {
      id: 7,
      title: "Orthopedics",
      description: "Expert care for bone and joint conditions with advanced surgical and non-surgical treatments by specialized orthopedic surgeons.",
      image: "/Ortho.jpg",
      icon: <FaWheelchair />,
      category: "specialty",
      features: [
        "Robotic Knee Resurfacing",
        "Joint replacements",
        "Robotic Knee Surgery",
        "Arthroscopy"
      ]
    },
    {
      id: 8,
      title: "Paediatrics",
      description: "Paediatrics deals with the prevention, diagnosis, and treatment of childhood illnesses, infections, growth and developmental issues, and congenital conditions.",
      image: "/paediatrics.jpg",
      icon: <FaTooth />,
      category: "specialty",
      features: [
        "Regular checkups",
        "Infection management",
        "Respiratory support",
        "Gastroenterology"
      ]
    },
    {
      id: 9,
        title: "General and Laproscopic Surgery",
        description: "General surgery uses a range of techniques, including traditional open surgery which requires a large incision to directly access the surgical site. This approach is often necessary for complex cases, severe trauma, or when extensive scar tissue is present.",
        image: "/G & LS.jpg",
        icon: <FaTooth />,
        category: "specialty",
        features: [
          "Appendectomy",
          "Bariatric Surgery",
          "Cholecystectomy",
          "Diagnostic Laparoscopy"
        ]
    },
    {
      id: 10,
      title: "Dermatologists",
      description: "Dermatologists manage conditions such as acne, eczema, psoriasis, fungal infections, allergies, hair loss, nail disorders, and skin cancers.",
      image: "/Dermatologistcs.jpg",
      icon: <FaEye />,
      category: "specialty",
      features: [
        "Oral medications",
        "Antihistamines",
        "Laser therapy",
        "Chemical peels"
      ]
    },
        {
      id: 11,
      title: "Plastic Surgery",
      description: "Plastic surgery is a specialized field of medicine focused on altering, restoring, or reconstructing the human body. The term plastic comes from the Greek word plastikos, meaning to form or mold.",
      image: "/Plastic.jpg",
      icon: <FaEye />,
      category: "specialty",
      features: [
        "Breast Augmentation",
        "Liposuction",
        "Abdominoplasty",
        "Rhinoplasty"
      ]
    },
    {
      id: 12,
      title: "ONCO Surgery",
      description: "Surgical techniques vary based on the cancer type and stage, and include traditional open surgery, minimally invasive techniques like laparoscopy and robotics, and other methods like cryosurgery and laser surgery.",
      image: "/onco.jpg",
      icon: <FaEye />,
      category: "specialty",
      features: [
        "Preventive Surgery",
        "Diagnostic Surgery",
        "Restorative Surgery",
        "Radical Resection"
      ]
    },
    {
      id: 13,
      title: "Gastro & Laproscopic Surgery",
      description: "Gastro and laparoscopic surgery are minimally invasive surgical techniques that treat digestive system disorders and other conditions through small incisions.",
      image: "/gasro.jpg",
      icon: <FaEye />,
      category: "specialty",
      features: [
        "Gallbladder disease",
        "Chronic constipation",
        "Colorectal cancer",
        "Obesity"
      ]
    },
    {
      id: 14,
      title: "Medicine",
      description: "Treatments include supportive care, such as rest and fluids, and antiparasitic drugs for parasitic infections. The appropriate treatment depends on the specific disease, its cause, and its severity.",
      image: "/Medcine.jpg",
      icon: <FaEye />,
      category: "specialty",
      features: [
        "Antibiotics",
        "Antifungals",
        "Diabetes",
        "Antifungals"
      ]
    }
  ];

  // Filter services based on category and search term
  const filteredServices = services.filter(service => {
    const matchesCategory = filter === 'all' || service.category === filter;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>{t("Our Services | Satya Trauma & Maternity Center")}</title>
        <meta name="description" content={t("Explore the comprehensive healthcare services offered by Satya Trauma & Maternity Center, including emergency care, maternity services, specialized treatments, and more.")} />
      </Helmet>

      <div className="services-container">
        <motion.div 
          className="services-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="services-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("Holistic Healthcare, Heartfelt Care")}
          </motion.span>
          <h1>{t("Our Medical Services")}</h1>
          <p>
            {t("At Satya Trauma & Maternity Center, we offer a wide range of healthcare services delivered by experienced medical professionals using state-of-the-art technology. Our focus is on providing high-quality, patient-centered care for all your health needs.")}
          </p>
          <div className="services-header-highlights">
            {highlightBadges.map((badge) => (
              <span key={badge} className="highlight-chip">{t(badge)}</span>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="search-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input 
            type="text" 
            className="search-box" 
            placeholder={t("Search for services...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <motion.div 
          className="filter-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t("All Services")}
          </button>
          <button 
            className={`filter-button ${filter === 'emergency' ? 'active' : ''}`}
            onClick={() => setFilter('emergency')}
          >
            {t("Emergency")}
          </button>
          <button 
            className={`filter-button ${filter === 'maternity' ? 'active' : ''}`}
            onClick={() => setFilter('maternity')}
          >
            {t("Maternity")}
          </button>
          <button 
            className={`filter-button ${filter === 'specialty' ? 'active' : ''}`}
            onClick={() => setFilter('specialty')}
          >
            {t("Specialty Care")}
          </button>
          <button 
            className={`filter-button ${filter === 'diagnostics' ? 'active' : ''}`}
            onClick={() => setFilter('diagnostics')}
          >
            {t("Diagnostics")}
          </button>
        </motion.div>

        <div className="services-scroll-hint">
          <span>{t("Scroll to explore more departments")}</span>
        </div>

        <div className="services-grid" style={{overflow :"hidden"}} >
          {filteredServices.map((service, index) => (
            <motion.div 
              key={service.id} 
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="service-image">
                <img src={service.image} alt={t(service.title)} />
                <div className="service-icon">
                  {service.icon}
                </div>
              </div>
              <div className="service-content">
                <h3 className="service-title">{t(service.title)}</h3>
                <p className="service-description">{t(service.description)}</p>
                
                <div className="service-features">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <FaCheckCircle className="feature-icon" />
                      <span className="feature-text">{t(feature)}</span>
                    </div>
                  ))}
                </div>
                
                <a href="/appointment" className="service-link">
                  {t("Book Appointment")} <FaArrowRight />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ 
              textAlign: 'center', 
              padding: '50px 20px',
              color: '#555'
            }}
          >
            <FaSearch style={{ fontSize: '40px', color: '#3939d9', marginBottom: '20px' }} />
            <h3>{t("No services found")}</h3>
            <p>{t("Please try a different search term or filter")}</p>
          </motion.div>
        )}

        <section className="testimonials-section">
          <div className="testimonials-header">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              {t("What Our Patients Say")}
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("Hear from individuals who have experienced our services and care")}
            </motion.p>
          </div>

          <div className="testimonials-container"style={{overflow : "hidden"}}>
            <motion.div 
              className="testimonial-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="testimonial-content">
                {t("I had an excellent experience at Satya Hospital. The doctors were very attentive and the staff was extremely caring. The facilities are modern and clean. I highly recommend their maternity services.")}
              </p>
              <div className="testimonial-author">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Patient" 
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">Priya Sharma</span>
                  <span className="author-title">{t("Maternity Patient")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="testimonial-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="testimonial-content">
                {t("After my accident, I was rushed to Satya Trauma Center. The emergency team was quick and professional. The doctors explained everything clearly and my recovery has been remarkable thanks to their care.")}
              </p>
              <div className="testimonial-author">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Patient" 
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">Rajesh Patel</span>
                  <span className="author-title">{t("Emergency Care Patient")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="testimonial-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="testimonial-content">
                {t("The cardiology department at Satya Hospital is exceptional. My heart condition was diagnosed accurately, and the treatment plan has significantly improved my quality of life. I am grateful to the entire team.")}
              </p>
              <div className="testimonial-author">
                <img 
                  src="https://randomuser.me/api/portraits/men/67.jpg" 
                  alt="Patient" 
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">Amit Kumar</span>
                  <span className="author-title">{t("Cardiology Patient")}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="services-cta">
          <div className="cta-content"style={{overflow : "hidden"}}>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              {t("Need Medical Assistance?")}
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("Book an appointment with our specialists today. Our team is ready to provide you with the best medical care tailored to your needs.")}
            </motion.p>
            <motion.a 
              href="/appointment" 
              className="cta-button"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Schedule an Appointment")}
            </motion.a>
          </div>
        </section>
    </div>
    </>
  );
}

export default Services;