import { initializeFormidable } from "../../config/formidable.config";
import { Response } from "express";
import { uploadAnyFile } from "../../utils/firebase.upload.utility";

// upload HMO image and return upload URL...
export const uploadAnyFileToFirebase = async(req: any, res: Response) => {
    try {
      const form = initializeFormidable();
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          return res.status(500).json({ message: "error uploading file", err });
        }
  
        // Extract the array of files
        const client_file = files['client_file'][0];
        if (!client_file || client_file.length === 0) {
          return res.status(400).json({ message: "No files found" });
        };

        const file_url = await uploadAnyFile(client_file);
        
        res.status(201).json({ file_url });

      });
    } catch (error) {
      res.status(500).json({ message: "error uploading file", error });
      console.log("error uploading file: ", error);
    }
  };