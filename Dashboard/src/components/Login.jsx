import React, { useContext, useState } from 'react'
import { Context } from '../main';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigateTo = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
     const response = await axios.post("http://localhost:4000/api/v1/user/login", 
        { email, password },
        { 
          withCredentials: true,
          headers : { "Content-Type": "application/json" },
         }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      
        <div className="container form-component">
      <h2>Admin Login Form</h2>
      <img src='/logo.png' alt='Logo Image' className='logo'/>
      <h1>Welcome To Satya Hospital</h1>
      <p>Only admins are allowed to access this Dashboard</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)}  />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  /> 
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit" style={{cursor:"pointer"}}>Login</button>
          </div>
        </form>
    </div>

    </>
  )
}

export default Login
