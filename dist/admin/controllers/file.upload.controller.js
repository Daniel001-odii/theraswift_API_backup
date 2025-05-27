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
exports.uploadAnyFileToFirebase = void 0;
const formidable_config_1 = require("../../config/formidable.config");
const firebase_upload_utility_1 = require("../../utils/firebase.upload.utility");
// upload HMO image and return upload URL...
const uploadAnyFileToFirebase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_config_1.initializeFormidable)();
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ message: "error uploading file", err });
            }
            // Extract the array of files
            const client_file = files['client_file'][0];
            if (!client_file || client_file.length === 0) {
                return res.status(400).json({ message: "No files found" });
            }
            ;
            const file_url = yield (0, firebase_upload_utility_1.uploadAnyFile)(client_file);
            res.status(201).json({ file_url });
        }));
    }
    catch (error) {
        res.status(500).json({ message: "error uploading file", error });
        console.log("error uploading file: ", error);
    }
});
exports.uploadAnyFileToFirebase = uploadAnyFileToFirebase;
