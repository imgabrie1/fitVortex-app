import React, { useContext, useEffect, useState } from "react";
import { View, Modal, Pressable, TouchableOpacity } from "react-native";
import AppText from "../AppText";
import { UserContext } from "@/contexts/User/UserContext";
import { MicroCycle, Workout } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { Button } from "../Button";
import { RegisterWorkoutForm } from "../RegisterWorkoutForm";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../RegisterWorkoutForm/schema";
import { AxiosError } from "axios";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SelectedMicroProps {
  microId: string;
  onBack: () => void;
}

const SelectedMicro = ({ microId, onBack }: SelectedMicroProps) => {
  const { getMicroCycleByID, toWorkOut, loadingForm } = useContext(UserContext);

  const [micro, setMicro] = useState<MicroCycle | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [registeringWorkout, setRegisteringWorkout] = useState<Workout | null>(
    null
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "exercises",
  });

  const getFormStorageKey = (microId: string) => `workoutFormValues_${microId}`;

  useEffect(() => {
    const loadFormValues = async () => {
      try {
        const savedValuesJSON = await AsyncStorage.getItem(
          getFormStorageKey(microId)
        );
        if (savedValuesJSON) {
          setFormValues(JSON.parse(savedValuesJSON));
        }
      } catch (e) {
        console.error("Failed to load form values from storage", e);
      }
    };

    loadFormValues();
  }, [microId]);

  const watchedValues = watch();

  useEffect(() => {
    if (registeringWorkout) {
      const currentValues = formValues[registeringWorkout.id] || {};
      reset({
        exercises: registeringWorkout.workoutExercises?.map((we) => {
          const existingExercise = currentValues.exercises?.find(
            (ex: any) => ex.exerciseId === we.exercise.id
          );
          if (existingExercise) {
            return existingExercise;
          }

          const targetSets = we.targetSets || 1;
          const sets = Array.from({ length: targetSets }, () => ({
            reps: undefined,
            weight: undefined,
          }));

          return {
            exerciseId: we.exercise.id,
            notes: "",
            sets: sets,
          };
        }),
      });
    }
  }, [registeringWorkout, reset]);

  useEffect(() => {
    if (registeringWorkout) {
      setFormValues((prev) => {
        const newValues = {
          ...prev,
          [registeringWorkout.id]: watchedValues,
        };
        try {
          AsyncStorage.setItem(
            getFormStorageKey(microId),
            JSON.stringify(newValues)
          );
        } catch (e) {
          console.error("Failed to save form values to storage", e);
        }
        return newValues;
      });
    }
  }, [JSON.stringify(watchedValues), registeringWorkout]);

  const onSubmit = async (data: any) => {
    if (!registeringWorkout) return;

    const exercisesPayload = data.exercises.map((exercise: any) => ({
      exerciseID: exercise.exerciseId,
      sets: exercise.sets.map((set: any) => ({
        reps: set.reps,
        weight: set.weight,
      })),
      notes: exercise.notes,
    }));

    const finalPayload = {
      exercises: exercisesPayload,
    };

    try {
      await toWorkOut(microId, registeringWorkout.id, finalPayload);
      handleFormSubmit();
    } catch (err: any) {
      const currentError = err as AxiosError;
      const msg =
        currentError?.response?.data ||
        err?.message ||
        "Erro ao registrar treino";
      throw new Error(String(msg));
    }
  };

  const toNumber = (v?: string | number | null) => {
    if (v == null) return 0;
    const n = typeof v === "number" ? v : Number.parseFloat(String(v));
    return Number.isFinite(n) ? n : 0;
  };

  const groupSetsByExercise = (sets: any[] = []) => {
    return sets.reduce<Record<string, any[]>>((acc, s) => {
      const exId = s?.exercise?.id ?? "unknown";
      if (!acc[exId]) acc[exId] = [];
      acc[exId].push(s);
      return acc;
    }, {});
  };

  const normalizeCycleItems = (micro: any) => {
    if (!micro?.cycleItems || !Array.isArray(micro.cycleItems)) return [];
    const map = new Map<string, any>();

    micro.cycleItems.forEach((ci: any) => {
      if (Array.isArray(ci.sets) && ci.sets.length > 0) {
        if (!map.has(ci.id)) map.set(ci.id, ci);
      }

      const inner = ci.microCycle?.cycleItems;
      if (Array.isArray(inner)) {
        inner.forEach((innerCi: any) => {
          if (!map.has(innerCi.id)) map.set(innerCi.id, innerCi);
        });
      } else {
        if (!map.has(ci.id) && (Array.isArray(ci.sets) || ci.workout)) {
          map.set(ci.id, ci);
        }
      }
    });

    return map.size > 0 ? Array.from(map.values()) : micro.cycleItems;
  };

  const loadMicro = async () => {
    try {
      setLoading(true);
      const data = await getMicroCycleByID(microId);
      setMicro(data);
      const normalized = normalizeCycleItems(data);

      const savedOrderJSON = await AsyncStorage.getItem(
        `workoutOrder_${microId}`
      );
      if (savedOrderJSON) {
        const savedOrderIds = JSON.parse(savedOrderJSON) as string[];
        normalized.sort((a: any, b: any) => {
          const indexA = savedOrderIds.indexOf(a.id);
          const indexB = savedOrderIds.indexOf(b.id);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1) {
            return -1;
          }
          if (indexB !== -1) {
            return 1;
          }
          return 0;
        });
      }

      setWorkouts(normalized);
    } catch (err) {
      console.error("Erro ao buscar ou reordenar Micro Ciclo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMicro();
  }, [microId]);

  const handleFormSubmit = () => {
    if (registeringWorkout) {
      setFormValues((prev) => {
        const newValues = { ...prev };
        delete newValues[registeringWorkout.id];
        try {
          AsyncStorage.setItem(
            getFormStorageKey(microId),
            JSON.stringify(newValues)
          );
        } catch (e) {
          console.error("Failed to clear form values from storage", e);
        }
        return newValues;
      });
    }
    setRegisteringWorkout(null);
    loadMicro();
  };

  const handleDragEnd = async ({ data }: { data: any[] }) => {
    setWorkouts(data);
    try {
      const orderIds = data.map((item) => item.id);
      await AsyncStorage.setItem(
        `workoutOrder_${microId}`,
        JSON.stringify(orderIds)
      );
    } catch (err) {
      console.error("Erro ao salvar a ordem dos treinos:", err);
    }
  };


  const totalSets = workouts.reduce((acc, ci) => {
    if (Array.isArray(ci.sets)) {
      return acc + ci.sets.length;
    }
    return acc;
  }, 0);

  const renderItem = ({ item: ci, drag, isActive }: RenderItemParams<any>) => {
    const workoutName = ci.workout.name;
    const workoutExercises = ci.workout?.workoutExercises ?? [];
    const sets = Array.isArray(ci.sets) ? ci.sets : [];
    const setsByExercise = groupSetsByExercise(sets);
    const hasSets = sets.length > 0;

    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.blocks,
          { marginTop: 12, backgroundColor: isActive ? "#333" : "#222" },
        ]}
      >
        <View style={styles.infoWorkoutWrap}>
          <AppText style={styles.name}>{workoutName}</AppText>
          <AppText style={styles.info}>
            Exercícios no treino: {workoutExercises.length}
          </AppText>
        </View>

        {hasSets ? (
          <View style={{ marginTop: 8 }}>
            <AppText style={[styles.info, { fontWeight: "600" }]}>
              Séries registradas:
            </AppText>

            {Object.entries(setsByExercise).map(([exId, arr]) => {
              const exName = arr[0]?.exercise?.name ?? "Exercício";
              return (
                <View key={exId} style={{ marginTop: 8 }}>
                  <AppText style={[styles.name, { fontSize: 14 }]}>
                    {exName}
                  </AppText>

                  {arr.map((s: any) => {
                    const weight = toNumber(s.weight).toFixed(2);
                    return (
                      <View key={s.id} style={styles.repsWeightInfo}>
                        <AppText style={styles.info}>
                          • reps: {s.reps ?? "—"} — peso: {weight}
                        </AppText>
                        {s.notes ? (
                          <AppText style={styles.info}>
                            notas: {s.notes}
                          </AppText>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            <Button
              text="Registrar Treino"
              onPress={() => setRegisteringWorkout(ci.workout)}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!micro) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.nameAndBackWrap}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="white"
            onPress={onBack}
          />
          <AppText style={styles.name}>
            {micro.microCycleName?.toUpperCase()}
          </AppText>
          <View style={{ width: 24 }} />
        </View>

        {/* info treino */}
        <View style={styles.blockHeader}>
          <AppText style={styles.infoHeader}>
            Dias de treino: {micro.trainingDays ?? "—"}
          </AppText>
          {micro.volumes ? (
            <AppText style={styles.infoHeader}>
              SÉRIES POR MICRO: {totalSets}
            </AppText>
          ) : null}
        </View>

        {/* ciclo de treinos */}
        <DraggableFlatList
          data={workouts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          containerStyle={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {registeringWorkout && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={registeringWorkout !== null}
            onRequestClose={() => setRegisteringWorkout(null)}
          >
            <View style={styles.containerModal}>
              <View style={styles.nameAndBackWrap}>
                <Pressable onPress={() => setRegisteringWorkout(null)}>
                  <MaterialIcons name="arrow-back" size={24} color="white" />
                </Pressable>
                <AppText style={styles.name}>Registrar Treino</AppText>
                <View style={{ width: 24 }} />
              </View>
              <RegisterWorkoutForm
                workout={registeringWorkout}
                control={control}
                errors={errors}
                fields={fields}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                loadingForm={loadingForm}
              />
            </View>
          </Modal>
        )}
      </View>
      <View
      style={{marginBottom: 20}}
      >
      </View>
    </GestureHandlerRootView>
  );
};

export default SelectedMicro;
