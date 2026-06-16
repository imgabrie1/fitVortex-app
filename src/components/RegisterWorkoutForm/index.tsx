import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Controller } from "react-hook-form";
import { Button } from "@/components/Button";
import AppText from "@/components/AppText";
import { styles } from "./styles";
import { themas } from "@/global/themes";
import { UserContext } from "@/contexts/User/UserContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RegisterWorkoutFormProps {
  workout: any;
  control: any;
  errors: any;
  fields: any[];
  handleSubmit: any;
  onSubmit: any;
  isEditMode?: boolean;
  cycleItemId: string;
  previousWorkoutValues?: any;
  setValue: any;
  getValues: any;
  microId: string;
  onSkipSuccess?: () => void;
}

export const RegisterWorkoutForm = ({
  workout,
  control,
  errors,
  fields,
  handleSubmit,
  onSubmit,
  isEditMode = false,
  cycleItemId,
  previousWorkoutValues,
  setValue,
  getValues,
  microId,
  onSkipSuccess,
}: RegisterWorkoutFormProps) => {
  const { loadingForm, setActiveWorkout, activeWorkout, skipWorkout } =
    useContext(UserContext);

  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [workingOut, setWorkingOut] = useState(false);
  const prevCompletedSetsRef = useRef<Set<string>>(new Set());
  const autoAdvancedRef = useRef<Set<string>>(new Set());
  const [storedPreviousValues, setStoredPreviousValues] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const workoutData = workout.workout || workout;

  useEffect(() => {
    const handlePreviousValues = async () => {
      const key = `previousWorkoutValues_${cycleItemId}`;
      if (previousWorkoutValues) {
        try {
          await AsyncStorage.setItem(
            key,
            JSON.stringify(previousWorkoutValues),
          );
        } catch (error) {
          console.error("Failed to save previous workout values", error);
        }
      } else {
        try {
          const stored = await AsyncStorage.getItem(key);
          if (stored) {
            setStoredPreviousValues(JSON.parse(stored));
          }
        } catch (error) {
          console.error("Failed to load previous workout values", error);
        }
      }
    };
    handlePreviousValues();
  }, [previousWorkoutValues, cycleItemId]);

  useEffect(() => {
    const loadCompletedSets = async () => {
      try {
        const savedSets = await AsyncStorage.getItem(
          `completedSets_${cycleItemId}`,
        );
        if (savedSets) {
          setCompletedSets(new Set(JSON.parse(savedSets)));
        }
      } catch (error) {
        console.error("Failed to load completed sets", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCompletedSets();
  }, [cycleItemId]);

  useEffect(() => {
    if (isLoaded) {
      try {
        AsyncStorage.setItem(
          `completedSets_${cycleItemId}`,
          JSON.stringify(Array.from(completedSets)),
        );
      } catch (error) {
        console.error("Failed to save completed sets", error);
      }
    }
    setWorkingOut(completedSets.size > 0);

    if (completedSets.size > 0) {
      const newActiveWorkoutState = {
        microId,
        cycleItemId,
        workoutName: workoutData.name,
      };

      if (
        !activeWorkout ||
        activeWorkout.cycleItemId !== cycleItemId ||
        activeWorkout.microId !== microId
      ) {
        setActiveWorkout(newActiveWorkoutState);
      }
    } else {
      if (activeWorkout) {
        setActiveWorkout(null);
      }
    }
  }, [completedSets, isLoaded, cycleItemId, microId]);

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

  const toggleMoreOptions = () => {
    isExpanded ? setIsExpanded(false) : setIsExpanded(true);
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

  const handleSkipWorkout = async () => {
    if (!skipWorkout) {
      Alert.alert("Erro", "Função de pular treino não encontrada no contexto.");
      return;
    }

    try {
      await skipWorkout(microId, workout.id, workout);

      await AsyncStorage.removeItem(`completedSets_${cycleItemId}`);
      setCompletedSets(new Set());

      if (onSkipSuccess) {
        onSkipSuccess();
      } else {
        Alert.alert("Sucesso", "Treino pulado com sucesso!");
      }
    } catch (error: any) {
      Alert.alert("Aviso", error.message || "Não foi possível pular o treino.");
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    fields.forEach((item, index) => {
      const exerciseId = item.exerciseId;
      const isExpanded = expandedExercises.has(exerciseId);
      const allDone = areAllSetsCompleted(exerciseId);

      if (isExpanded && allDone && !autoAdvancedRef.current.has(exerciseId)) {
        autoAdvancedRef.current.add(exerciseId);

        closeExercise(exerciseId);

        if (index < fields.length - 1) {
          const nextExerciseId = fields[index + 1].exerciseId;
          setTimeout(() => {
            openExercise(nextExerciseId);
          }, 300);
        }
      } else if (!allDone && autoAdvancedRef.current.has(exerciseId)) {
        autoAdvancedRef.current.delete(exerciseId);
      }
    });
  }, [completedSets, isLoaded]);

  const isSetDone = (exerciseId: string, setIndex: number) => {
    const setKey = `${exerciseId}-${setIndex}`;
    return completedSets.has(setKey);
  };

  const isExerciseExpanded = (exerciseId: string) => {
    return expandedExercises.has(exerciseId);
  };

  const getExerciseName = (exerciseId: string) => {
    const exerciseName = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId,
    )?.exercise?.name;
    return exerciseName || `Exercício`;
  };

  const getExerciseImg = (exerciseId: string) => {
    const exerciseImg = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId,
    )?.exercise?.imageURL;
    return exerciseImg || `Erro ao carregar imagem`;
  };

  const getTargetSets = (exerciseId: string) => {
    const targetSets = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId,
    )?.targetSets;
    return targetSets || 0;
  };

  const getUnilateral = (exerciseId: string) => {
    const workoutExercise = workoutData.workoutExercises?.find(
      (we: any) => we.exercise?.id === exerciseId,
    );
    if (!workoutExercise) return false;
    if (typeof (workoutExercise as any).is_unilateral === "boolean") {
      return (workoutExercise as any).is_unilateral as boolean;
    }
    return workoutExercise.exercise?.default_unilateral || false;
  };

  const getPreviousSet = (exerciseId: string, setIndex: number) => {
    const effectivePreviousValues =
      previousWorkoutValues || storedPreviousValues;

    if (!effectivePreviousValues || !effectivePreviousValues.sets) return null;

    const previousSetsForExercise = effectivePreviousValues.sets.filter(
      (s: any) => s.exercise.id === exerciseId,
    );

    const result = previousSetsForExercise[setIndex];
    return result;
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
              <View
                style={[
                  styles.infoHeaderExercise,
                  allSetsCompleted && styles.teste2,
                ]}
              >
                <Image
                  source={{ uri: getExerciseImg(exerciseId) }}
                  style={styles.img}
                  resizeMode="cover"
                />
                <View style={styles.nameAndSetsWrapp}>
                  <AppText style={styles.exerciseName}>
                    {getExerciseName(exerciseId)}
                    {isUnilateral && " (Unilateral)"}
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
                <View style={styles.teste}>
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

                      const setsColor = (index: number) => {
                        return index % 2 === 0
                          ? themas.Colors.background
                          : themas.Colors.alternativeBlocks;
                      };

                      const prevSet = getPreviousSet(exerciseId, setIndex);
                      const formatValue = (val: any) => {
                        if (val === undefined || val === null || val === "")
                          return "—";
                        const num = Number(val);
                        return isNaN(num) ? String(val) : String(num);
                      };

                      const placeholderWeight = formatValue(prevSet?.weight);
                      const placeholderReps = formatValue(prevSet?.reps);

                      return (
                        <View
                          key={`${setIndex}-${placeholderWeight}-${placeholderReps}`}
                        >
                          <View
                            style={[
                              styles.setRow,
                              isDone
                                ? styles.isDoneLine
                                : { backgroundColor: setsColor(setIndex) },
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
                                    placeholder={placeholderWeight}
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
                                    placeholder={placeholderReps}
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
                              onPress={() => {
                                const weightPath = `exercises.${index}.sets.${setIndex}.weight`;
                                const repsPath = `exercises.${index}.sets.${setIndex}.reps`;

                                const currentWeight = getValues(weightPath);
                                const currentReps = getValues(repsPath);

                                if (
                                  (!currentWeight || currentWeight === "") &&
                                  prevSet?.weight !== undefined
                                ) {
                                  setValue(
                                    weightPath,
                                    String(Number(prevSet.weight)),
                                  );
                                }

                                if (
                                  (!currentReps || currentReps === "") &&
                                  prevSet?.reps !== undefined
                                ) {
                                  setValue(
                                    repsPath,
                                    String(Number(prevSet.reps)),
                                  );
                                }

                                toggleSetDone(exerciseId, setIndex);
                              }}
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
                    },
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.actionContainer}>
        <Button
          text={isEditMode ? "ATUALIZAR TREINO" : "FINALIZAR TREINO"}
          onPress={handleSubmit(onSubmit)}
          styleButton={styles.buttonMain}
          loading={loadingForm}
        />

        <View style={styles.moreOptionsContainer}>
          <TouchableOpacity
            onPress={toggleMoreOptions}
            style={styles.moreOptionsButton}
            activeOpacity={0.7}
          >
            <AppText style={styles.moreOptionsText}>
              {isExpanded ? "MENOS OPÇÕES" : "MAIS OPÇÕES"}
            </AppText>
            <MaterialIcons
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color={themas.Colors.secondary || "#6200EE"}
            />
          </TouchableOpacity>

          {isExpanded && (
            <TouchableOpacity
              style={styles.skipButton}
              activeOpacity={0.7}
              onPress={handleSkipWorkout}
              disabled={loadingForm}
            >
              <MaterialIcons name="skip-next" size={20} color="#B00020" />
              <AppText style={styles.skipButtonText}>PULAR TREINO</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
