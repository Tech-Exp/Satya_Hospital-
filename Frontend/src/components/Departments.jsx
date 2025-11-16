import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Departments = () => {
  const departmentsArray = [
    {
      name : "Pediatrics",
      imageUrl : "/Departments/Pediatrics.avif",
    },
    {
      name : "OBS & Gynaecology",
      imageUrl : "/OBS.jpg",
    },
    {
      name : "Medicine",
      imageUrl : "/Medcine.jpg",
    },
    {
      name : "Orthopedics",
      imageUrl : "/Departments/Orthopedics.avif",
    },
    {
      name : "ENT",
      imageUrl : "/ent.jpg",
    },
    {
      name : "Dermatology",
      imageUrl : "/Departments/Dermatology.avif",
    },
    {
      name : "Oncology",
      imageUrl : "/Departments/Oncology.avif",
    },
    {
      name : "Radiology",
      imageUrl : "/Departments/Radiology.avif",
    },
    {
      name : "Spine & Neurosurgery",
      imageUrl : "/spine.jpg",
    },
    {
      name : "Gastroenterology",
      imageUrl : "/Departments/Gastroenterology.avif",
    },
    {
      name : "Plastic Surgery",
      imageUrl : "/Plastic.jpg",
    },
    { 
      name : "Gastro & Laproscopic Surgery",
      imageUrl : "/gasro.jpg",
    },
  ];
  const responsive = {
    extraLarge: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1 // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    small: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  return (
    <div className='container departments'>
      <h2 style={{ textAlign: 'center', margin: '20px 0', fontStyle: 'italic' }}>Our Departments</h2>
      <Carousel responsive={responsive} removeArrowOnDeviceType={["medium", "small"]} infinite={true} autoPlay={true} autoPlaySpeed={2000} transitionDuration={500}>
        {
          departmentsArray.map((depart, index) => {
            return (
              <div className='card' key={index}>
                <div className="depart-name">{depart.name}</div>
                <img src={depart.imageUrl} alt={depart.name} />
              </div>
          )
          })
        }
      </Carousel>
    </div>
  )
}

export default Departments
