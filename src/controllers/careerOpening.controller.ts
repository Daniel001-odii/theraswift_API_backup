import { Request, Response } from 'express';
import CareerOpening from '../models/CareerOpening.model';
import { ICareerOpening } from "../interface/generalInterface";

export const createCareerOpening = async (req: Request, res: Response): Promise<void> => {
  try {
    const { position, location, description, requirements, contactEmail } = req.body;

    const careerOpening: ICareerOpening = new CareerOpening({
      position,
      location,
      description,
      requirements,
      contactEmail
    });

    await careerOpening.save();

    res.status(201).json(careerOpening);
  } catch (error) {
    console.log(`Error uploading career opening: ${error}`);
    res.status(500).json({ message: 'Error uploading career opening' });
  }
};

export const getCareerOpenings = async (req: Request, res: Response): Promise<void> => {
  try {
    const careerOpenings: ICareerOpening[] = await CareerOpening.find();

    res.status(200).json(careerOpenings);
  } catch (error) {
    console.log(`Error retrieving career openings: ${error}`);
    res.status(500).json({ message: 'Error retrieving career openings' });
  }
};
