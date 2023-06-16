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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCareerOpenings = exports.createCareerOpening = void 0;
const CareerOpening_model_1 = __importDefault(require("../models/CareerOpening.model"));
const createCareerOpening = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { position, location, description, requirements, contactEmail } = req.body;
        const careerOpening = new CareerOpening_model_1.default({
            position,
            location,
            description,
            requirements,
            contactEmail
        });
        yield careerOpening.save();
        res.status(201).json(careerOpening);
    }
    catch (error) {
        console.log(`Error uploading career opening: ${error}`);
        res.status(500).json({ message: 'Error uploading career opening' });
    }
});
exports.createCareerOpening = createCareerOpening;
const getCareerOpenings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const careerOpenings = yield CareerOpening_model_1.default.find();
        res.status(200).json(careerOpenings);
    }
    catch (error) {
        console.log(`Error retrieving career openings: ${error}`);
        res.status(500).json({ message: 'Error retrieving career openings' });
    }
});
exports.getCareerOpenings = getCareerOpenings;
