// import multer from 'multer';
// import express from 'express';
 
// // Set up multer for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'uploads/');
//     },
//     filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         callback(null, file.fieldname + '-' + uniqueSuffix);
//     },
// });

// const fileFilter = (req: express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         callback(null, true);
//     } else {
//         callback(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
//     }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;

let multer = require('multer');

let path = require('path');

//let me = require('./../../public/uploads')

let storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req: any, file: any, cb: any){
        cb(null, file.fieldname+'_'+Date.now()+'_'+path.extname(file.originalname));
    }
})

let upload = multer({
    storage: storage,
    limits: {fileSize: 20000000000000000},
    fileFilter: function(req: any, file: any, cb: any){

        checkfileTypq(file, cb);
    }
}).single('medecation_Img');


// function to check file types ::::::::::::::::::::::

function checkfileTypq(file: any, cb: any){

    // allowed types
    let filetype = /jpeg|jpg|png/;

    // check allowed type 
    let exten = filetype.test(path.extname(file.originalname).toLowerCase());

    //check minetype

    //let minetype = filetype.test(file.minetype);

    if (exten) {

        return cb(null, true);
        
    }else{
        return cb('err: image only please');
    }

}

export default upload;