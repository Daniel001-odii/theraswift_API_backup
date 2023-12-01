"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let multer = require('multer');
let path = require('path');
//let me = require('./../../public/uploads')
let storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + path.extname(file.originalname));
    }
});
let upload = multer({
    storage: storage,
    limits: { fileSize: 20000000000000000 },
    fileFilter: function (req, file, cb) {
        checkfileTypq(file, cb);
    }
}).single('medecation_Img');
// function to check file types ::::::::::::::::::::::
function checkfileTypq(file, cb) {
    // allowed types
    let filetype = /jpeg|jpg|png/;
    // check allowed type 
    let exten = filetype.test(path.extname(file.originalname).toLowerCase());
    //check minetype
    //let minetype = filetype.test(file.minetype);
    if (exten) {
        return cb(null, true);
    }
    else {
        return cb('err: image only please');
    }
}
exports.default = upload;
