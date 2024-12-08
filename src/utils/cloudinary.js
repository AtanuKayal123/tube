import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_cloud_name,
    api_key: process.env.CLOUDINARY_api_key,
    api_secret: process.env.CLOUDINARY_api_secret,
});

const uploadOnCloudinary = async(localFilePath) =>  {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type: "auto"
            }
        );

        console.log("File uploaded on cloudinary. File src:" + response.url);
        // Once the file is uploaded, we would like to delete it from server 
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading file:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async(publicId) => {
    try {
        if (!publicId) return null;
        const response = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from cloudinary. File src:" + response.url);
        return response;
    } 
    catch (error) {
        console.error("Error deleting file:", error);
        return null;
    }
}

export  { uploadOnCloudinary, deleteFromCloudinary };