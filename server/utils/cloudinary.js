import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { toBase64 } from "../lib/helper.js";
const uploadFilesToCloudinary = async (files = []) => {
  console.log("img",files)
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        toBase64(file), 
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading file to Cloudinary:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    return formattedResults;
  } catch (err) {
    console.error("Error uploading files to Cloudinary:", err);
    throw new Error("Error uploading files to Cloudinary", err);
  }
};

const deleteFilesFromCloudinary=(publicIds)=>{
    console.log("files deleted")
}

export { deleteFilesFromCloudinary, uploadFilesToCloudinary };
