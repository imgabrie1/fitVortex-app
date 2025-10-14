import * as yup from "yup";

export const schema = yup.object({
  targetSets: yup
    .number()
    .required("Informe o número de séries")
    .min(1, "Mínimo 1 série")
});
