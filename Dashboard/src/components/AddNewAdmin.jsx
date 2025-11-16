import React, { useContext, useState } from 'react';
import { Context } from "../main";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const isValidAadhaar = (value) => /^\d{12}$/.test(value);

const AddNewAdmin = () => {

  const { isAuthenticated, /*setIsAuthenticated*/ } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

    const handleAddNewAdmin = async (e) => {
    e.preventDefault();

    if (!isValidAadhaar(nic)) {
      toast.error('Please enter a valid 12-digit Aadhaar number')
      return
    }

    try {
       await axios.post("http://localhost:4000/api/v1/user/admin/addnew", 
        { firstName, lastName, email, phone, nic, dob, gender, password },
        { withCredentials: true,
          headers : { "Content-Type": "application/json" },
         }
      )
      .then((res) => {
                toast.success(res.data.message);
                // setIsAuthenticated(true);
                navigateTo("/");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setNic("");
                setDob("");
                setGender("");
                setPassword("");
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
         <div className='container form-component add-admin-form'>
      <img src='/logo.png' alt='Logo Image' className='logo'/>
      <h1 className='form-title'>Add New Admin</h1>
      <form onSubmit={handleAddNewAdmin}>
        <div>
            <input type="text" placeholder='First Name' value={firstName} onChange={ (e)=> setFirstName(e.target.value)}/>
            <input type="text" placeholder='Last Name' value={lastName} onChange={ (e)=> setLastName(e.target.value)}/>
        </div>
        <div>
            <input type="email" placeholder='Email ID' value={email} onChange={ (e)=> setEmail(e.target.value)}/>
            <input
            type='tel'
            placeholder='Phone Number'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type='text'
            placeholder='Aadhaar Number'
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
        </div>
        <div>
            <input type="date" placeholder='Date of Birth' value={dob} onChange={(e) => setDob(e.target.value)}/>
        </div>
        <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option vlaue="Female">Female</option>
            </select>
            <input type="password" placeholder='Enter Password' value={password} onChange={ (e)=> setPassword(e.target.value)}/>
        </div>
        <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
              <button type="submit" className="btn btn-primary" style={{cursor: "pointer"}}>Add New Admin</button>
        </div>
      </form>
    </div>
    </section>
  </>
  )
};

export default AddNewAdmin;
