import * as yup from "yup";

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;

export const macroSchema = yup.object().shape({
  macroCycleName: yup.string().required("Nome do macro ciclo é obrigatório"),
  startDate: yup
    .string()
    .required("Data de início é obrigatória")
    .matches(dateRegex, "Data de início deve estar no formato DD-MM-AAAA"),
  endDate: yup
    .string()
    .required("Data de fim é obrigatória")
    .matches(dateRegex, "Data de fim deve estar no formato DD-MM-AAAA"),
    microQuantity: yup
    .number()
    .required("deve ter uma quantidades de micros em seu macro")
});

export const microSchema = yup.object().shape({
  microCycleName: yup.string().required("Nome do micro ciclo é obrigatório"),
  trainingDays: yup
    .number()
    .required("Dias de treino são obrigatórios")
    .min(1, "Pelo menos 1 dia de treino"),
});
