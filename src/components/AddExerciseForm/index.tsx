import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppText from "../AppText";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { schema } from "./schema";
import { styles } from "./styles";
import BackAndTitle from "../BackAndTitle";
import { UserContext } from "@/contexts/User/UserContext";
import { themas } from "@/global/themes";

interface AddExercisesProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
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
      targetSets: 2,
      is_unilateral: selectedExercise?.default_unilateral || false,
    },
  });

  const { loadingForm } = useContext(UserContext);

  const createUnilateralValue = watch("is_unilateral");
  const targetSetsValue = Number(watch("targetSets")) || 0;

  const toggleUnilateral = () => {
    setValue("is_unilateral", !createUnilateralValue);
  };

  const incrementSets = () => {
    setValue("targetSets", targetSetsValue + 1, { shouldValidate: true });
  };

  const decrementSets = () => {
    if (targetSetsValue > 1) {
      setValue("targetSets", targetSetsValue - 1, { shouldValidate: true });
    }
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
          render={({ field: { value } }) => (
            <View style={styles.stepperWrapper}>
              <AppText style={styles.stepperLabel}>Séries</AppText>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  onPress={decrementSets}
                  style={[
                    styles.stepperButton,
                    Number(value) <= 1 && styles.stepperButtonDisabled,
                  ]}
                  disabled={Number(value) <= 1}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={26}
                    color={
                      Number(value) <= 1
                        ? themas.Colors.gray
                        : themas.Colors.text
                    }
                  />
                </TouchableOpacity>

                <View style={styles.stepperValueWrapper}>
                  <AppText style={styles.stepperValue}>
                    {Number(value) || 0}
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={incrementSets}
                  style={styles.stepperButton}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="keyboard-arrow-up"
                    size={26}
                    color={themas.Colors.text}
                  />
                </TouchableOpacity>
              </View>

              {errors.root?.message ? (
                <AppText style={styles.stepperError}>
                  {String(errors.root.message)}
                </AppText>
              ) : null}
            </View>
          )}
        />

        {/* Card de resumo — mesma linguagem do modalVolumeResult da calculadora */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <AppText style={styles.summaryLabel}>Resumo</AppText>
            <AppText
              style={[
                styles.summaryBadge,
                createUnilateralValue
                  ? styles.summaryBadgeUnilateral
                  : styles.summaryBadgeBilateral,
              ]}
            >
              {createUnilateralValue ? "UNILATERAL" : "BILATERAL"}
            </AppText>
          </View>

          <AppText style={styles.summaryValue}>
            {targetSetsValue} série{targetSetsValue === 1 ? "" : "s"}
            {createUnilateralValue
              ? ` × 2 lados = ${targetSetsValue * 2} execuções`
              : ""}
          </AppText>
        </View>

        <View style={styles.toggleContainer}>
          <AppText style={styles.toggleLabel}>Vai ser unilateral?</AppText>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              createUnilateralValue && styles.toggleButtonActive,
            ]}
            onPress={toggleUnilateral}
            activeOpacity={0.8}
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
            const newExercise = {
              exerciseId: selectedExercise?.id,
              targetSets: Number(formData.targetSets),
              is_unilateral: formData.is_unilateral,
            };
            onSubmit(newExercise);
          })}
          styleButton={styles.styledButton}
          loading={loadingForm}
        />
      </View>
    </View>
  );
};

export default AddExerciseForm;
