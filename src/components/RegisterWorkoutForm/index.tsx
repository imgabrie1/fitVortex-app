import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Controller } from "react-hook-form";
import { Button } from "@/components/Button";
import AppText from "@/components/AppText";
import { styles } from "./styles";
import { themas } from "@/global/themes";
import { UserContext } from "@/contexts/User/UserContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface RegisterWorkoutFormProps {
  workout: any;
  control: any;
  errors: any;
  fields: any[];
  handleSubmit: any;
  onSubmit: any;
  isEditMode?: boolean;
}

export const RegisterWorkoutForm = ({
  workout,
  control,
  errors,
  fields,
  handleSubmit,
  onSubmit,
  isEditMode = false,
}: RegisterWorkoutFormProps) => {
  const { loadingForm } = useContext(UserContext);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
  );
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const prevCompletedSetsRef = useRef<Set<string>>(new Set());

  const findNextExerciseToExpand = () => {
    for (let i = 0; i < fields.length; i++) {
      const exerciseId = fields[i].exerciseId;
      if (!expandedExercises.has(exerciseId)) {
        return exerciseId;
      }
    }
    return null;
  };

  const areAllSetsCompleted = (exerciseId: string) => {
    const isUnilateral = getUnilateral(exerciseId);
    const targetSets = getTargetSets(exerciseId);
    const numberOfSets =
      typeof targetSets === "number"
        ? targetSets
        : parseInt(targetSets, 10) || 0;
    const actualNumberOfSets = isUnilateral ? numberOfSets * 2 : numberOfSets;

    for (let i = 0; i < actualNumberOfSets; i++) {
      const setKey = `${exerciseId}-${i}`;
      if (!completedSets.has(setKey)) {
        return false;
      }
    }
    return true;
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.clear();
        newSet.add(exerciseId);
      }

      return newSet;
    });
  };

  const openExercise = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.clear();
      newSet.add(exerciseId);
      return newSet;
    });
  };

  const closeExercise = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const toggleSetDone = (exerciseId: string, setIndex: number) => {
    const setKey = `${exerciseId}-${setIndex}`;

    setCompletedSets((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(setKey)) {
        newSet.delete(setKey);
      } else {
        newSet.add(setKey);
      }

      return newSet;
    });
  };

  useEffect(() => {
    const prevCompletedSets = prevCompletedSetsRef.current;

    fields.forEach((item) => {
      const exerciseId = item.exerciseId;
      const isExpanded = expandedExercises.has(exerciseId);

      if (isExpanded && areAllSetsCompleted(exerciseId)) {
        closeExercise(exerciseId);

        const currentIndex = fields.findIndex(
          (f) => f.exerciseId === exerciseId
        );
        if (currentIndex < fields.length - 1) {
          const nextExerciseId = fields[currentIndex + 1].exerciseId;

          setTimeout(() => {
            openExercise(nextExerciseId);
          }, 300);
        }
      }
    });

    prevCompletedSetsRef.current = new Set(completedSets);
  }, [completedSets, fields]);

  const isSetDone = (exerciseId: string, setIndex: number) => {
    const setKey = `${exerciseId}-${setIndex}`;
    return completedSets.has(setKey);
  };

  const isExerciseExpanded = (exerciseId: string) => {
    return expandedExercises.has(exerciseId);
  };

  const workoutData = workout.workout || workout;

  const getExerciseName = (exerciseId: string) => {
    const exerciseName = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId
    )?.exercise?.name;
    return exerciseName || `Exercício`;
  };

  const getExerciseImg = (exerciseId: string) => {
    const exerciseImg = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId
    )?.exercise?.imageURL;
    return exerciseImg || `Erro ao carregar imagem`;
  };

  const getTargetSets = (exerciseId: string) => {
    const targetSets = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId
    )?.targetSets;
    return targetSets || 0;
  };

  const getUnilateral = (exerciseId: string) => {
    const workoutExercise = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId
    );
    if (!workoutExercise) return false;
    if (typeof (workoutExercise as any).is_unilateral === "boolean") {
      return (workoutExercise as any).is_unilateral as boolean;
    }
    return workoutExercise.exercise?.default_unilateral || false;
  };

  useEffect(() => {
    if (expandedExercises.size === 0 && fields.length > 0) {
      const firstExerciseId = fields[0].exerciseId;
      openExercise(firstExerciseId);
    }
  }, [fields]);

  return (
    <View style={styles.container}>
      {fields.map((item, index) => {
        const exerciseId = item.exerciseId;
        const isExpanded = isExerciseExpanded(exerciseId);
        const isUnilateral = getUnilateral(exerciseId);
        const targetSets = getTargetSets(exerciseId);
        const numberOfSets =
          typeof targetSets === "number"
            ? targetSets
            : parseInt(targetSets, 10) || 0;

        const actualNumberOfSets = isUnilateral
          ? numberOfSets * 2
          : numberOfSets;

        const completedSetsCount = Array.from({
          length: actualNumberOfSets,
        }).filter((_, setIndex) => isSetDone(exerciseId, setIndex)).length;

        const allSetsCompleted = completedSetsCount === actualNumberOfSets;

        return (
          <View key={item.id}>
            <TouchableOpacity onPress={() => toggleExercise(exerciseId)}>
              <View style={styles.infoHeaderExercise}>
                <Image
                  source={{ uri: getExerciseImg(exerciseId) }}
                  style={styles.img}
                  resizeMode="cover"
                />
                <View style={styles.nameAndSetsWrapp}>
                  <AppText style={styles.exerciseName}>
                    {getExerciseName(exerciseId)}
                    {isUnilateral && " (Unilateral)"}
                    {allSetsCompleted && " — Feito!"}
                  </AppText>
                  <AppText style={styles.targetSets}>
                    {`${completedSetsCount}/${actualNumberOfSets} concluídos`}
                    {isUnilateral && ` (${actualNumberOfSets} lados)`}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.infoHeaderExerciseNotes}>
              {isExpanded && (
                <View>
                  <Controller
                    control={control}
                    name={`exercises.${index}.notes`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Notas..."
                        placeholderTextColor={themas.Colors.lightGray}
                        cursorColor={themas.Colors.secondary}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="default"
                        style={styles.notes}
                      />
                    )}
                  />
                  <View style={styles.headerSets}>
                    <View style={styles.columnSeries}>
                      <AppText style={styles.setRepsWeight}>Séries</AppText>
                    </View>
                    <View style={styles.columnWeightAndReps}>
                      <AppText style={styles.setRepsWeight}>Kg</AppText>
                    </View>
                    <View style={styles.columnWeightAndReps}>
                      <AppText style={styles.setRepsWeight}>Reps</AppText>
                    </View>
                    <View style={styles.columnAction} />
                  </View>
                  {Array.from({ length: actualNumberOfSets }).map(
                    (_, setIndex) => {
                      const isUnilateralSet = isUnilateral;
                      const isRightSide = isUnilateralSet && setIndex % 2 === 0;
                      const isLeftSide = isUnilateralSet && setIndex % 2 === 1;

                      const realSetIndex = isUnilateralSet
                        ? Math.floor(setIndex / 2)
                        : setIndex;

                      const isDone = isSetDone(exerciseId, setIndex);

                      return (
                        <View key={setIndex}>
                          <View
                            style={[
                              styles.setRow,
                              {
                                backgroundColor:
                                  setIndex % 2 === 0
                                    ? themas.Colors.background
                                    : themas.Colors.alternativeBlocks,
                              },
                            ]}
                          >
                            <View style={styles.columnSeries}>
                              {isUnilateralSet ? (
                                <View>
                                  <AppText
                                    style={[
                                      styles.setLabel,
                                      isRightSide
                                        ? styles.setUniRight
                                        : styles.setUniLeft,
                                    ]}
                                  >
                                    {isRightSide ? "D" : "E"}
                                  </AppText>
                                </View>
                              ) : (
                                <View>
                                  <AppText style={styles.setLabel}>
                                    {setIndex + 1}
                                  </AppText>
                                </View>
                              )}
                            </View>

                            <View style={styles.columnWeightAndReps}>
                              <Controller
                                control={control}
                                name={`exercises.${index}.sets.${setIndex}.weight`}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <TextInput
                                    placeholder="—"
                                    placeholderTextColor={themas.Colors.gray}
                                    cursorColor={themas.Colors.secondary}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={String(value ?? "")}
                                    keyboardType="numeric"
                                    style={styles.inputRepsWeight}
                                    selectTextOnFocus={true}
                                  />
                                )}
                              />
                            </View>

                            <View style={styles.columnWeightAndReps}>
                              <Controller
                                control={control}
                                name={`exercises.${index}.sets.${setIndex}.reps`}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <TextInput
                                    placeholder="—"
                                    placeholderTextColor={themas.Colors.gray}
                                    cursorColor={themas.Colors.secondary}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={String(value ?? "")}
                                    keyboardType="numeric"
                                    style={styles.inputRepsWeight}
                                    selectTextOnFocus={true}
                                  />
                                )}
                              />
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.doneButton,
                                isDone && styles.alternativeDoneButton,
                              ]}
                              onPress={() =>
                                toggleSetDone(exerciseId, setIndex)
                              }
                            >
                              <MaterialIcons
                                name="done"
                                size={24}
                                color={themas.Colors.text}
                              />
                            </TouchableOpacity>
                          </View>
                          {errors.exercises?.[index]?.sets?.[setIndex]
                            ?.reps && (
                            <AppText style={{}}>
                              {
                                errors.exercises[index].sets[setIndex].reps
                                  .message
                              }
                            </AppText>
                          )}
                          {errors.exercises?.[index]?.sets?.[setIndex]
                            ?.weight && (
                            <AppText style={{}}>
                              {
                                errors.exercises[index].sets[setIndex].weight
                                  .message
                              }
                            </AppText>
                          )}
                        </View>
                      );
                    }
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}
      <Button
        text={isEditMode ? "Atualizar Treino" : "Salvar Treino"}
        onPress={handleSubmit(onSubmit)}
        styleButton={styles.button}
        loading={loadingForm}
      />
    </View>
  );
};
