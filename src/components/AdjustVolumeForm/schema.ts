import * as yup from "yup";

export const schema = yup.object().shape({
  createNewWorkout: yup.boolean().default(false),
  maxSetsPerMicroCycle: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .min(2, "Mínimo de 2 séries")
    .max(24, "Máximo de 24 séries")
    .default(24),
  legPriority: yup.string().nullable(),
  modifications: yup.array().when("createNewWorkout", {
    is: true,
    then: (schema) =>
      schema.of(
        yup.object().shape({
          workoutName: yup.string().required("Nome do treino é obrigatório"),
          action: yup
            .string()
            .oneOf(["replace", "remove", "add"], "Selecione uma ação válida")
            .required("Ação é obrigatória"),
          fromExercise: yup.string().when("action", {
            is: (val: string) => val === "replace" || val === "remove",
            then: (schema) => schema.required("Exercício atual é obrigatório"),
            otherwise: (schema) => schema.notRequired(),
          }),
          toExercise: yup.string().when("action", {
            is: (val: string) => val === "replace" || val === "add",
            then: (schema) => schema.required("Novo exercício é obrigatório"),
            otherwise: (schema) => schema.notRequired(),
          }),
        })
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
