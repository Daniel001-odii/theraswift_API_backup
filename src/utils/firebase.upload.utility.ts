import { bucket } from "../config/firebase.config";

export const uploadHMOImages = async (file:any) => {
    try{
        const file_path = file.filepath;
        const remote_file_path = `HMO_images/${file.originalFilename}`;

        await bucket.upload(file_path, { destination: remote_file_path });
        const options:any = {
            action: 'read',
            expires: '01-01-2100'
        };

        const signed_url: any = await bucket.file(remote_file_path).getSignedUrl(options);
        const image_url = signed_url[0];

        return { success: true, url:image_url};
    }catch(error:any){
        return { success: false, error: error.message };
    }
};

