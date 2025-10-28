import React from "react";
import { View, Modal, Pressable, TouchableOpacity } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppText from "../AppText";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { schema } from "./schema";
import { styles } from "./styles";
import { Exercise } from "@/contexts/User/interface";
import BackAndTitle from "../BackAndTitle";

interface AddExercisesProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  // selectedExercise?: Exercise | null;
  selectedExercise?: any;
}

const AddExerciseForm = ({
  onClose,
  onSubmit,
  selectedExercise,
}: AddExercisesProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: {
      targetSets: undefined,
      default_unilateral: selectedExercise?.default_unilateral || false,
    },
  });

  const createUnilateralValue = watch("default_unilateral");

  const toggleUnilateral = () => {
    setValue("default_unilateral", !createUnilateralValue);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <BackAndTitle
          onBack={onClose}
          title={`Adicionar ${selectedExercise?.name ?? "Exercício"}`}
        />

        <Controller
          control={control}
          name={"targetSets"}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="Séries"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.root?.message}
            />
          )}
        />

        <View style={styles.toggleContainer}>
          <AppText style={styles.toggleLabel}>Vai ser unilateral?</AppText>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              createUnilateralValue && styles.toggleButtonActive,
            ]}
            onPress={toggleUnilateral}
          >
            <View
              style={[
                styles.toggleCircle,
                createUnilateralValue && styles.toggleCircleActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        <AppText style={styles.toggleDescription}>
          {createUnilateralValue ? "Unilateral" : "Bilateral"}
        </AppText>

        <Button
          text="Adicionar ao Treino"
          onPress={handleSubmit((formData) => {
            const payload = {
              exercises: [
                {
                  exerciseId: selectedExercise?.id,
                  targetSets: Number(formData.targetSets),
                  default_unilateral: formData.default_unilateral,
                },
              ],
            };
            onSubmit(payload);
          })}
          styleButton={styles.styledButton}
        />
      </View>
    </View>
  );
};

export default AddExerciseForm;
