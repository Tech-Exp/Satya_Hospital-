import express from "express";
import { 
    bookAppointment, 
    bookMultipleAppointments, 
    deleteAppointment, 
    getAllAppointments, 
    getPatientAppointments,
    getDoctorAppointments, 
    updateAppointmentStatus,
    updateAppointmentStatusByDoctor,
    directBookAppointment
} from "../controller/appointmentController.js";
import { 
    isAdminAuthenticated, 
    isPatientAuthenticated, 
    isDoctorAuthenticated,
    isAuthenticated 
} from "../middlewares/auth.js";

const router = express.Router();

// Direct booking endpoint - no authentication required
router.post("/direct-book", directBookAppointment);

// Authenticated routes
router.post("/book", isPatientAuthenticated, bookAppointment);
router.post("/book-multiple", isPatientAuthenticated, bookMultipleAppointments);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/patient", isPatientAuthenticated, getPatientAppointments);
router.get("/doctor", isDoctorAuthenticated, getDoctorAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.put("/status/:id", isDoctorAuthenticated, updateAppointmentStatusByDoctor);
// Both admin and patients can delete appointments, but with different permissions
router.delete("/delete/:id", isAuthenticated, deleteAppointment);


export default router;