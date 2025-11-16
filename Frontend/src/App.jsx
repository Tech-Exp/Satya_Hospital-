import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctors from "./pages/AdminDoctors";
import AdminMessages from "./pages/AdminMessages";
import AddDoctor from "./pages/AddDoctor";
import AddAdmin from "./pages/AddAdmin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedPatientRoute from "./components/ProtectedPatientRoute";
import ProtectedDoctorRoute from "./components/ProtectedDoctorRoute";
import NotAuthenticated from "./pages/NotAuthenticated";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { Context } from "./main";
import Footer from "./components/Footer";
import AppointmentCTA from "./components/AppointmentCTA";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useContext(Context);
  // Start with loading set to false to show content immediately
  const [loading, setLoading] = useState(false);
  
  // Function to clear user state - can be used across the application
  window.clearUserState = () => {
    console.log("Clearing user state");
    setIsAuthenticated(false);
    setUser({});
  };
  
  // Authentication check that tries all user types
  useEffect(() => {
    // Set initial state - assume not authenticated
    setIsAuthenticated(false);
    setUser({});
    
    // Try to fetch user data for all types
    const checkAuth = async () => {
      // Try patient first
      try {
        const patientResponse = await fetch("http://localhost:4000/api/v1/user/patient/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        
        if (patientResponse.ok) {
          const data = await patientResponse.json();
          console.log("Authenticated as patient:", data.user);
          setIsAuthenticated(true);
          setUser(data.user);
          return; // Exit if authenticated as patient
        }
      } catch (error) {
        console.log("Not authenticated as patient");
      }
      
      // Try doctor next
      try {
        const doctorResponse = await fetch("http://localhost:4000/api/v1/user/doctor/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        
        if (doctorResponse.ok) {
          const data = await doctorResponse.json();
          console.log("Authenticated as doctor:", data.user);
          setIsAuthenticated(true);
          setUser(data.user);
          return; // Exit if authenticated as doctor
        }
      } catch (error) {
        console.log("Not authenticated as doctor");
      }
      
      // Try admin last
      try {
        const adminResponse = await fetch("http://localhost:4000/api/v1/user/admin/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        
        if (adminResponse.ok) {
          const data = await adminResponse.json();
          console.log("Authenticated as admin:", data.user);
          setIsAuthenticated(true);
          setUser(data.user);
          return; // Exit if authenticated as admin
        }
      } catch (error) {
        console.log("Not authenticated as admin");
      }
      
      // If we get here, user is not authenticated as any type
      console.log("Not authenticated as any user type");
    };
    
    // Run auth check but don't wait for it
    checkAuth();
  }, []);
  // Always render the app immediately without waiting for authentication
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/not-authenticated" element={<NotAuthenticated />} />
        
        {/* Public Appointment Route */}
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/patient/dashboard" element={
          <ProtectedPatientRoute>
            <PatientDashboard />
          </ProtectedPatientRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedDoctorRoute>
            <DoctorDashboard />
          </ProtectedDoctorRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedAdminRoute>
            <AdminDoctors />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedAdminRoute>
            <AdminMessages />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/doctor/add" element={
          <ProtectedAdminRoute>
            <AddDoctor />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedAdminRoute>
            <AddAdmin />
          </ProtectedAdminRoute>
        } />
      </Routes>
      <Footer />
      <AppointmentCTA />
      <ToastContainer position="top-center" />
    </Router>
  )
}

export default App
