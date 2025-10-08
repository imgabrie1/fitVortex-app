import React from "react";
import { View, Modal, Pressable } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { macroSchema, microSchema } from "./schema";
import { styles } from "./styles";
import AppText from "../AppText";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";

interface CreateCyclesProps {
  type: "macro" | "micro";
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateCycles = ({ type, onClose, onSubmit }: CreateCyclesProps) => {
  const isMacro = type === "macro";
  const schema = isMacro ? macroSchema : microSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: isMacro
      ? { macroCycleName: "", startDate: "", endDate: "", microQuantity: undefined }
      : { microCycleName: "", trainingDays: undefined },
  });

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.nameAndBackWrap}>
          <Pressable onPress={onClose}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <AppText style={styles.name}>
            CRIAR {isMacro ? "MACRO" : "MICRO"} CICLO
          </AppText>
          <View style={{ width: 24 }} />
        </View>

        <Controller
          control={control}
          name={isMacro ? "macroCycleName" : "microCycleName"}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="Nome do Ciclo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={
                errors[isMacro ? "macroCycleName" : "microCycleName"]
                  ?.message as string
              }
            />
          )}
        />

        {isMacro && (
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
            <Controller
              control={control}
              name="microQuantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Quantidades de Micros (ex: semanas de treino num macro ciclo)"
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

        {!isMacro && (
          <Controller
            control={control}
            name="trainingDays"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                title="Dias com treino no Micro (Ex: Dias com treino na semana)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ""}
                error={errors.trainingDays?.message as string}
                keyboardType="numeric"
              />
            )}
          />
        )}

        <Button
          text="Criar Ciclo"
          onPress={handleSubmit(onSubmit)}
          styleButton={styles.styledButton}
        />
      </View>
    </View>
  );
};

export default CreateCycles;
