import express from "express";
import { 
    addNewAdmin, 
    addNewDoctor, 
    getAllDoctors, 
    getUserDetails, 
    logoutAdmin, 
    logoutPatient,
    logoutDoctor,
    patientRegister, 
    deleteDoctor,
} from "../controller/usercontroller.js";
import { login } from "../controller/usercontroller.js";
import { 
    isAdminAuthenticated, 
    isPatientAuthenticated,
    isDoctorAuthenticated 
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/doctor/me", isDoctorAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);

export default router;
