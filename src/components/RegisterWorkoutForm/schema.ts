import * as yup from "yup";

export const schema = yup.object().shape({
  exercises: yup.array().of(
    yup.object().shape({
      exerciseId: yup.string().required(),
      notes: yup.string().optional(),
      sets: yup
        .array()
        .of(
          yup.object().shape({
            reps: yup
              .number()
              .transform((value) => (isNaN(value) ? undefined : value))
              .required("Reps são obrigatórias")
              .min(1, "Pelo menos 1 repetição"),
            weight: yup
              .number()
              .transform((value) => (isNaN(value) ? undefined : value))
              .required("Peso é obrigatório")
              .min(0, "Peso não pode ser negativo"),
          })
        )
        .min(1, "Pelo menos uma série é necessária"),
    })
  ),
});