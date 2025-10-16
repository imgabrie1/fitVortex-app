import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { macroSchema, microSchema } from "./schema";
import { styles } from "./styles";
import AppText from "../AppText";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";

interface CreateCyclesProps {
  type: "macro" | "micro";
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateCycles = ({ type, onClose, onSubmit }: CreateCyclesProps) => {
  const isMacro = type === "macro";
  const schema = isMacro ? macroSchema : microSchema;

  const [stage, setStage] = useState<1 | 2 | 3>(1);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: isMacro
      ? {
          macroCycleName: "",
          startDate: "",
          endDate: "",
          microQuantity: undefined,
        }
      : { microCycleName: "", trainingDays: undefined },
  });

  const nextStage = async () => {
    if (!isMacro) return;

    let valid = false;

    if (stage === 1) valid = await trigger("macroCycleName");
    else if (stage === 2) valid = await trigger(["startDate", "endDate"]);
    else if (stage === 3) valid = await trigger("microQuantity");

    if (valid && stage < 3) setStage((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const prevStage = () => {
    if (stage > 1) setStage((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.nameAndBackWrap}>
        <Pressable onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <AppText style={styles.name}>
          CRIAR {isMacro ? "MACRO" : "MICRO"} CICLO
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      {isMacro ? (
        <>
          {stage === 1 && (
            <Controller
              control={control}
              name="macroCycleName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Nome do Ciclo"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.macroCycleName?.message as string}
                />
              )}
            />
          )}

          {stage === 2 && (
            <>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    title="Data de Início"
                    mask="99-99-9999"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.startDate?.message as string}
                    keyboardType="numeric"
                  />
                )}
              />
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    title="Data de Término"
                    mask="99-99-9999"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.endDate?.message as string}
                    keyboardType="numeric"
                  />
                )}
              />
            </>
          )}

          {stage === 3 && (
            <Controller
              control={control}
              name="microQuantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Quantidades de Micros"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? String(value) : ""}
                  error={errors.microQuantity?.message as string}
                  keyboardType="numeric"
                />
              )}
            />
          )}

          <View
            style={styles.buttonsWrapper}
          >
            {stage > 1 && <Button text="Voltar" onPress={prevStage} styleButton={styles.styledButtonRed} />}
            {stage < 3 && <Button text="Próximo" onPress={nextStage} styleButton={styles.styledButton} />}
            {stage === 3 && <Button text="Criar Ciclo" onPress={handleSubmit(onSubmit)} styleButton={styles.styledButton} />}
          </View>
        </>
      ) : (
        <>
          <Controller
            control={control}
            name="microCycleName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                title="Nome do Ciclo"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.microCycleName?.message as string}
              />
            )}
          />
          <Controller
            control={control}
            name="trainingDays"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                title="Dias com treino no Micro"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ""}
                error={errors.trainingDays?.message as string}
                keyboardType="numeric"
              />
            )}
          />
          <Button text="Criar Ciclo" onPress={handleSubmit(onSubmit)} styleButton={styles.styledButton} />
        </>
      )}
    </View>
  );
};

export default CreateCycles;
