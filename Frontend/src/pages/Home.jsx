import React from 'react';
import Hero from '../components/Hero';
import Biography from '../components/Biography';
import Departments from '../components/Departments';
import HomeMessageSection from '../components/HomeMessageSection';
import AppointmentCTA from '../components/AppointmentCTA';
import PromotionalCard from '../components/PromotionalCard';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Satya Hospital - Trauma & Maternity Centre | Kanpur</title>
        <meta name="description" content="Welcome to Satya Trauma & Maternity Centre, Kanpur. We provide comprehensive healthcare services with experienced doctors and state-of-the-art facilities." />
      </Helmet>
    
      {/* Promotional Card Popup */}
      <PromotionalCard />
    
      <Hero 
        title={"Welcome to Satya Trauma & Maternity Centre || Satya Hospital, Kanpur"}
        imageUrl={"/image.png"} 
      />
      <Biography imageUrl={"/image.png"} />
      <Departments />
      <HomeMessageSection />
    </>
  )
}

export default Home
