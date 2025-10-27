import * as yup from "yup";


export const schema = yup.object().shape({
  prompt: yup.string().nullable().default(""),
  createNewWorkout: yup.boolean().default(false)

});

