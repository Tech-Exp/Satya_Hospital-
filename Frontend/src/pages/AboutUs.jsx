import React from 'react';
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import { Helmet } from 'react-helmet';
import './AboutUs.css';

const Aboutus = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Satya Trauma & Maternity Center</title>
        <meta name="description" content="Learn about Satya Trauma & Maternity Center's history, mission, values, and our commitment to providing exceptional healthcare services in Kanpur." />
      </Helmet>
      
      <Hero 
        title="About Satya Trauma & Maternity Centre" 
        imageUrl="/image.png"
      />
      
      <Biography imageUrl="/satya.webp"/>
    </>
  );
};

export default Aboutus
