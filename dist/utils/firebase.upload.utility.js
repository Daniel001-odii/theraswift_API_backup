"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAnyFile = exports.uploadHMOImages = void 0;
const firebase_config_1 = require("../config/firebase.config");
const uploadHMOImages = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file_path = file.filepath;
        const remote_file_path = `HMO_images/${file.originalFilename}`;
        yield firebase_config_1.bucket.upload(file_path, { destination: remote_file_path });
        const options = {
            action: 'read',
            expires: '01-01-2100'
        };
        const signed_url = yield firebase_config_1.bucket.file(remote_file_path).getSignedUrl(options);
        const image_url = signed_url[0];
        return { success: true, url: image_url };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
exports.uploadHMOImages = uploadHMOImages;
const uploadAnyFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file_path = file.filepath;
        // Extract the file extension to use as the type
        const extension = file.originalFilename.split('.').pop(); // get the file extension
        const remote_file_path = `${extension}/${file.originalFilename}`; // use the extension as the folder name
        yield firebase_config_1.bucket.upload(file_path, { destination: remote_file_path });
        const options = {
            action: 'read',
            expires: '01-01-2100'
        };
        const signed_url = yield firebase_config_1.bucket.file(remote_file_path).getSignedUrl(options);
        const image_url = signed_url[0];
        return { success: true, url: image_url };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
exports.uploadAnyFile = uploadAnyFile;
