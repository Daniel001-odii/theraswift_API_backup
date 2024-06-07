import { ObjectId } from "bson";
import mongoose from "mongoose";


/**
 * validates mongoose id
 * @param {string} id
 */
export const isValidId = (id: string | number | ObjectId) =>
    id && mongoose.Types.ObjectId.isValid(id);
  