import React, { useContext, useState } from 'react';
import { Context } from "../main";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

const AddNewDoctor = () => {

  const { isAuthenticated, /*setIsAuthenticated*/ } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docPhoto, setDocPhoto] = useState("");
  const [docPhotoPreview, setDocPhotoPreview] = useState("");

  const departmentsArray = [
    "Pediatrics",
    "Orthopadics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Tharapy",
    "Dermatology",
    "ENT",
  ];


  const navigateTo = useNavigate();

  const handlePhoto = async (e) => {
    const file= e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocPhotoPreview(reader.result);
      setDocPhoto(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    if (!isValidAadhaar(nic)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("nic", nic);
      formData.append("gender", gender);
      formData.append("password", password);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("docPhoto", docPhoto);
      formData.append("dob", dob);

       await axios.post("http://localhost:4000/api/v1/user/doctor/addnew", 
        formData,
        { withCredentials: true,
          headers : { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
                toast.success(res.data.message);
                navigateTo("/");
              });
    } catch (error) {
      toast.error(error.response.data.message);
      // setIsAuthenticated(false);
    }
  };

   if(!isAuthenticated){
    return <Navigate to={"/login"}/>
  }

  return (
    <>
      <section className="page">
         <div className='container form-component add-doctor-form'>
      <img src='/logo.png' alt='Logo Image' className='logo'/>
      <h1 className='form-title'>Add New Doctor</h1>
      <form onSubmit={handleAddNewDoctor}>

        <div className="first-wrapper">
          <div>
            <img src={docPhotoPreview ? `${docPhotoPreview}` : "/docTemp.jpg"} alt='Doctor Avatar' />
            <input type='file' onChange={handlePhoto} style={{ cursor: "pointer", border:"none"}} />
            <center><button type="submit" className="btn btn-primary" style={{cursor: "pointer"}}>Add New Doctor</button></center>
          </div>
          <div>
            <input type="text" placeholder='First Name' value={firstName} onChange={ (e)=> setFirstName(e.target.value)}/>
            <input type="text" placeholder='Last Name' value={lastName} onChange={ (e)=> setLastName(e.target.value)}/>
            <input type="email" placeholder='Email ID' value={email} onChange={ (e)=> setEmail(e.target.value)}/>
            <input type="tel" placeholder='Phone Number' value={phone} onChange={ (e)=> setPhone(e.target.value)}/>
            <input type="text" placeholder='Aadhaar Number' value={nic} onChange={ (e)=> setNic(e.target.value)}/>
            <input type="date" placeholder='Date of Birth' value={dob} onChange={(e) => setDob(e.target.value)}/>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option vlaue="Female">Female</option>
            </select>
            <input type="password" placeholder='Enter Password' value={password} onChange={ (e)=> setPassword(e.target.value)}/>
            <select value={doctorDepartment} onChange={(e)=> setDoctorDepartment(e.target.value)}>
              <option vlaue=" ">Select Department</option>
              {
                departmentsArray.map((element, index)=> {
                  return(
                    <option value={element}  key={index}>{element}</option>
                  )
                })
              }
            </select>
              {/* <button type="submit" className="btn btn-primary" style={{cursor: "pointer"}}>Add New Doctor</button> */}
          </div>
        </div>
      </form>
    </div>
    </section>
  </>
  )
};

export default AddNewDoctor;
