import express from "express";
import { dbConnection } from "./database/dbconnections.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import paymentRouter from "./router/paymentRouter.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
  
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Serve static files from a public directory
const publicDir = path.join(__dirname, "public");
app.use('/public', express.static(publicDir));
// Create a specific route to serve the logo
app.get('/logo', (req, res) => {
  res.sendFile(path.join(publicDir, 'logo.png'));
});

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/payment", paymentRouter);


// Connect to database and handle connection errors
(async () => {
  try {
    await dbConnection();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    console.warn("Application will continue running with limited functionality");
    // Don't exit the process - let the app continue running
  }
})();

app.use(errorMiddleware);
export default app;
