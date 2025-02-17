import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadPDF = (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "pdfs",
    resource_type: "auto", 
    use_filename: true,   
    unique_filename: false
  });
};

export default cloudinary;
