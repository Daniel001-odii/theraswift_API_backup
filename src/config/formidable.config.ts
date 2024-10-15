// import * as formidable from "formidable";
import formidable from 'formidable'
// import formidable, { errors as formidableErrors } from "formidable";

export const initializeFormidable = () => {
  const form = formidable({
    multiples: true,
  });

  return form;
};
