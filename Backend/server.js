import app from "./app.js";
import cloudinary from "cloudinary";
/* Cores Imported and Used */
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

/* Cores Imported and Used till here */
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port number ${process.env.PORT}`);
})