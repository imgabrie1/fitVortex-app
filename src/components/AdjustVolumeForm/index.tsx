import React from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../Input";
import { Button } from "../Button";
import BackAndTitle from "../BackAndTitle";
import { schema } from "./schema";
import { View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";

interface AdjustVolumeProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AdjustVolumeForm = ({ onClose, onSubmit }: AdjustVolumeProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: { prompt: "", createNewWorkout: false },
  });

  const createNewWorkoutValue = watch("createNewWorkout");

  const toggleCreateNewWorkout = () => {
    setValue("createNewWorkout", !createNewWorkoutValue);
  };

  return (
    <View style={styles.container}>
      <BackAndTitle onBack={onClose} title={"Ajustar Volume"} />

      <Controller
        control={control}
        name="prompt"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            title="O que precisa ser ajustado?"
            placeholder="Descreva as mudanças desejadas..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.prompt?.message as string}
          />
        )}
      />

      <View style={styles.toggleContainer}>
        <AppText style={styles.toggleLabel}>Criar com novos treinos?</AppText>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            createNewWorkoutValue && styles.toggleButtonActive,
          ]}
          onPress={toggleCreateNewWorkout}
        >
          <View
            style={[
              styles.toggleCircle,
              createNewWorkoutValue && styles.toggleCircleActive,
            ]}
          />
        </TouchableOpacity>
      </View>

      <AppText style={styles.toggleDescription}>
        {createNewWorkoutValue
          ? "Novos treinos, Novos volumes"
          : "Mesmos treinos, Novos volumes"}
      </AppText>

      <Button text="Ajustar Volume" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};



export default AdjustVolumeForm;
