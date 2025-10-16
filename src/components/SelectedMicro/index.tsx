import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AppText from "../AppText";
import { UserContext } from "@/contexts/User/UserContext";
import {
  Exercise,
  iPatchWorkout,
  MicroCycle,
  Workout,
} from "@/contexts/User/interface";
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
import AddExerciseForm from "../AddExerciseForm";

interface SelectedMicroProps {
  microId: string;
  onBack: () => void;
  allMicrosId: any;
}

const SelectedMicro = ({
  microId,
  onBack,
  allMicrosId,
}: SelectedMicroProps) => {
  const {
    getMicroCycleByID,
    toWorkOut,
    loadingForm,
    addExerciseInWorkout,
    getAllExercise,
  } = useContext(UserContext);

  const [micro, setMicro] = useState<MicroCycle | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [registeringWorkout, setRegisteringWorkout] = useState<Workout | null>(
    null
  );
  const [selectedWorkoutName, setSelectedWorkoutName] = useState<string | null>(
    null
  );
  const [selectedWorkoutImage, setSelectedWorkoutImage] = useState<
    string | null
  >(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAddExerciseModalVisible, setAddExerciseModalVisible] =
    useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [targetWorkoutName, setTargetWorkoutName] = useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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
        if (savedValuesJSON) setFormValues(JSON.parse(savedValuesJSON));
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
        exercises: registeringWorkout.workoutExercises?.map((we: any) => {
          const existingExercise = currentValues.exercises?.find(
            (ex: any) => ex.exerciseId === we.exercise.id
          );
          if (existingExercise) return existingExercise;

          const targetSets = we.targetSets || 1;
          const sets = Array.from({ length: targetSets }, () => ({
            reps: undefined,
            weight: undefined,
          }));

          return {
            exerciseId: we.exercise.id,
            notes: "",
            sets,
          };
        }),
      });
    }
  }, [registeringWorkout, reset]);

  useEffect(() => {
    if (registeringWorkout) {
      setFormValues((prev) => {
        const newValues = { ...prev, [registeringWorkout.id]: watchedValues };
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

    const finalPayload = { exercises: exercisesPayload };

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
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
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
          console.error("Falha ao limpar valores", e);
        }
        return newValues;
      });
    }
    setRegisteringWorkout(null);
    setSelectedWorkoutName(null);
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

  const loadExercises = async (pageNumber: number, limit: number = 10) => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const data: any = await getAllExercise(pageNumber, limit);

      if (data?.data?.length) {
        setExercises((prev) => [...prev, ...data.data]);
        setPage(pageNumber + 1);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      if (
        err?.response?.status === 404 ||
        err?.response?.data === "No exercises"
      ) {
        setHasMore(false);
      } else {
        console.error("Erro ao carregar os exercícios:", err);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadExercises(page);
    }
  };

  useEffect(() => {
    loadExercises(page);
  }, []);

  const handleSubmitAddExercise = async (data: any) => {
    if (!targetWorkoutName) {
      console.error("Nenhum nome de treino alvo definido.");
      return;
    }

    setLoading(true);

    try {
      const workoutsToUpdate = workouts.filter(
        (w) => w.workout.name === targetWorkoutName
      );

      if (workoutsToUpdate.length === 0) {
        console.warn("Nenhum treino correspondente encontrado para atualizar.");
        setLoading(false);
        return;
      }

      const updatePromises = workoutsToUpdate.map(async (workoutItem) => {
        const existingExercises = workoutItem.workout.workoutExercises.map(
          (we: any) => ({
            exerciseId: we.exercise.id,
            targetSets: we.targetSets,
          })
        );

        const newExercise = data.exercises[0];
        const finalExercises = [...existingExercises, newExercise];

        const payload = { exercises: finalExercises };

        await addExerciseInWorkout(payload, workoutItem.workout.id);
      });

      await Promise.all(updatePromises);

      setAddExerciseModalVisible(false);
      setTargetWorkoutName(null);
      loadMicro();
      setStage(1);
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalSets = workouts.reduce((acc, ci) => {
    if (Array.isArray(ci.sets)) return acc + ci.sets.length;
    return acc;
  }, 0);

  if (stage === 1) {
    const renderItem = ({
      item: ci,
      drag,
      isActive,
    }: RenderItemParams<any>) => {
      const workoutName = ci.workout.name;
      const workoutImage = ci.workout?.imageUrl || null;
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
              {workoutExercises.length <= 0 ? (
                <Button
                  text="Adicionar Exercícios"
                  onPress={() => {
                    setTargetWorkoutName(workoutName);
                    setStage(2);
                  }}
                />
              ) : (
                <Button
                  text="Registrar Treino"
                  onPress={() => {
                    setRegisteringWorkout(ci.workout);
                    setSelectedWorkoutName(workoutName);
                    setSelectedWorkoutImage(workoutImage);
                  }}
                />
              )}
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
              visible={!!registeringWorkout}
              onRequestClose={() => {
                setRegisteringWorkout(null);
                setSelectedWorkoutName(null);
                setSelectedWorkoutImage(null);
              }}
            >
              <View style={styles.containerModal}>
                <View style={styles.nameAndBackWrap}>
                  <Pressable
                    onPress={() => {
                      setRegisteringWorkout(null);
                      setSelectedWorkoutName(null);
                      setSelectedWorkoutImage(null);
                    }}
                  >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                  </Pressable>

                  <AppText style={styles.name}>
                    {selectedWorkoutName ?? "Treino"}
                  </AppText>
                  <View style={{ width: 24 }} />
                </View>

                {selectedWorkoutImage && (
                  <Image
                    source={{ uri: selectedWorkoutImage }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 12,
                      marginBottom: 16,
                    }}
                    resizeMode="cover"
                  />
                )}

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
        <View style={{ marginBottom: 20 }} />
      </GestureHandlerRootView>
    );
  }

  //----------------- TELA DE ADICIONAR EXERCICIO (STAGE 2) -----------------
  if (stage === 2) {
    return (
      <View>
        <View style={{ marginTop: 30 }}>
          <View style={styles.nameAndBackWrap}>
            <Pressable onPress={onBack}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>
            <AppText style={styles.name}>ADICIONAR EXERCÍCIO</AppText>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          numColumns={3}
          // columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.addExerciseUl}>
              <Image
                source={{ uri: item.imageURL }}
                style={styles.imagemURl}
                resizeMode="cover"
              />
              <AppText style={styles.nameExercise}>{item.name}</AppText>
              <Button
                styleButton={styles.styledButton}
                text="Adicionar"
                fontSize={12}
                onPress={() => {
                  setSelectedExercise(item);
                  setAddExerciseModalVisible(true);
                }}
              />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? <ActivityIndicator size="large" /> : null
          }
          ListEmptyComponent={() => (
            <AppText>Nenhum Exercício Encontrado</AppText>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddExerciseModalVisible}
          onRequestClose={() => setAddExerciseModalVisible(false)}
        >
          <AddExerciseForm
            selectedExercise={selectedExercise}
            onClose={() => {
              setAddExerciseModalVisible(false);
              setSelectedExercise(null);
            }}
            onSubmit={handleSubmitAddExercise}
          />
        </Modal>
      </View>
    );
  }
};

export default SelectedMicro;
