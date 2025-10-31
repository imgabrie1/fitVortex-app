import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Modal,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from "react-native";
import AppText from "../AppText";
import { UserContext } from "@/contexts/User/UserContext";
import { Exercise, MicroCycle, Workout } from "@/contexts/User/interface";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
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
import CustomAlertTwoOptions from "../AlertTwoOptions";
import FiltersByMuscle from "../FiltersByMuscle";
import { formatMuscleLabel } from "@/utils/formatMuscleLabel";
import { themas } from "@/global/themes";
import ExerciseItem from "../ExerciseItem";
import WorkoutItem from "../WorkoutItem";
import BackAndTitle from "../BackAndTitle";

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
    updateWorkoutOrder,
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
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
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
  const [menuOrigin, setMenuOrigin] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const onBackModal = () => {
    setRegisteringWorkout(null);
    setSelectedWorkoutName(null);
    setSelectedWorkoutImage(null);
  };

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

  const checkIfExerciseExistsInWorkout = useCallback(
    (exerciseId: string): boolean => {
      if (!targetWorkoutName) return false;

      const targetWorkout = workouts.find(
        (w) => w.workout.name === targetWorkoutName
      );

      if (!targetWorkout?.workout?.workoutExercises) return false;

      return targetWorkout.workout.workoutExercises.some(
        (we: any) => we.exercise.id === exerciseId
      );
    },
    [targetWorkoutName, workouts]
  );

  const getFormStorageKey = useCallback(
    (microId: string) => `workoutFormValues_${microId}`,
    []
  );

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
        exercises: registeringWorkout.workoutExercises
          ?.slice()
          .sort((a: any, b: any) => a.position - b.position)
          .map((we: any) => {
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

  const toNumber = useCallback((v?: string | number | null) => {
    if (v == null) return 0;
    const n = typeof v === "number" ? v : Number.parseFloat(String(v));
    return Number.isFinite(n) ? n : 0;
  }, []);

  const normalizeCycleItems = useCallback((micro: any) => {
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
  }, []);

  const loadMicro = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMicroCycleByID(microId);
      setMicro(data);
      const normalized = normalizeCycleItems(data);

      normalized.sort((a: any, b: any) => a.position - b.position);

      setWorkouts(normalized);
    } catch (err) {
      console.error("Erro ao buscar ou reordenar Micro Ciclo:", err);
    } finally {
      setLoading(false);
    }
  }, [microId]);

  useEffect(() => {
    loadMicro();
  }, [microId]);

  const handleFormSubmit = useCallback(() => {
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
  }, [registeringWorkout, microId]);

  const handleDragEnd = async ({ data }: { data: any[] }) => {
    setWorkouts(data);
    try {
      const orderedIds = data.map((item) => item.id);
      await updateWorkoutOrder(microId, orderedIds);
    } catch (err) {
      console.error("Erro ao salvar a ordem dos treinos:", err);
      loadMicro();
    }
  };

  const loadExercises = useCallback(
    async (pageNumber: number, limit: number = 10) => {
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
    },
    [loadingMore, hasMore]
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadExercises(page);
    }
  }, [loadingMore, hasMore, page, loadExercises]);

  useEffect(() => {
    loadExercises(1);
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

      const newExercise = data.exercises[0];

      const exerciseAlreadyExists = workoutsToUpdate.some((workoutItem) =>
        workoutItem.workout.workoutExercises.some(
          (we: any) => we.exercise.id === newExercise.exerciseId
        )
      );

      if (exerciseAlreadyExists) {
        Alert.alert("Aviso", "Este exercício já existe no treino.");
        setLoading(false);
        return;
      }

      const updatePromises = workoutsToUpdate.map(async (workoutItem) => {
        const exerciseExistsInThisWorkout =
          workoutItem.workout.workoutExercises.some(
            (we: any) => we.exercise.id === newExercise.exerciseId
          );

        if (exerciseExistsInThisWorkout) {
          console.warn("Exercício já existe neste workout, pulando...");
          return;
        }

        const existingExercises = workoutItem.workout.workoutExercises.map(
          (we: any) => ({
            exerciseId: we.exercise.id,
            targetSets: we.targetSets,
          })
        );

        const finalExercises = [...existingExercises, newExercise];
        const payload = { exercises: finalExercises };

        await addExerciseInWorkout(payload, workoutItem.workout.id);

        setWorkouts((prev) =>
          prev.map((w) =>
            w.workout.id === workoutItem.workout.id
              ? {
                  ...w,
                  workout: {
                    ...w.workout,
                    workoutExercises: [
                      ...w.workout.workoutExercises,
                      {
                        exercise: { id: newExercise.exerciseId },
                        targetSets: newExercise.targetSets,
                      },
                    ],
                  },
                }
              : w
          )
        );
      });

      await Promise.all(updatePromises);

      setAddExerciseModalVisible(false);
      setAlertVisible(true);
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
      Alert.alert("Erro", "Não foi possível adicionar o exercício.");
    } finally {
      setLoading(false);
    }
  };

  const totalSets = workouts.reduce((acc, ci) => {
    if (Array.isArray(ci.sets)) return acc + ci.sets.length;
    return acc;
  }, 0);

  const handleEditWorkout = useCallback((ci: any) => {
    try {
      console.log("Editar treino:", ci.workout.name);
      // editar nome apenas (provavelmente)
    } catch (err) {
      console.error("Erro ao deletar treino:", err);
    } finally {
      setMenuVisible(null);
    }
  }, []);

  const handleDeleteWorkout = useCallback(async (ci: any) => {
    try {
      console.log("Excluir treino:", ci.workout.name);
      // criar no backend essa opção
    } catch (err) {
      console.error("Erro ao deletar treino:", err);
    } finally {
      setMenuVisible(null);
    }
  }, []);

  const handleClearFilter = useCallback(() => {
    setFilteredExercises(null);
    setActiveFilter(null);
    setStage(2);
  }, []);

  const handleMenuPress = useCallback((e: any, itemId: string) => {
    const { pageX, pageY } = e.nativeEvent;
    setMenuOrigin({ x: pageX, y: pageY });
    setMenuVisible((prev) => (prev === itemId ? null : itemId));
  }, []);

  const handleAddExerciseToWorkout = useCallback((workoutName: string) => {
    setTargetWorkoutName(workoutName);
    setStage(2);
    setMenuVisible(null);
  }, []);

  const handleRegisterWorkout = useCallback((workout: any) => {
    setRegisteringWorkout(workout);
    setSelectedWorkoutName(workout.name);
    setSelectedWorkoutImage(workout.imageUrl || null);
  }, []);

  const handleAddExercisePress = useCallback((exercise: Exercise) => {
    setSelectedExercise(exercise);
    setAddExerciseModalVisible(true);
  }, []);

  const renderWorkoutItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<any>) => (
      <WorkoutItem
        item={item}
        drag={drag}
        isActive={isActive}
        onMenuPress={handleMenuPress}
        menuVisible={menuVisible}
        menuOrigin={menuOrigin}
        onAddExercise={handleAddExerciseToWorkout}
        onEditWorkout={handleEditWorkout}
        onDeleteWorkout={handleDeleteWorkout}
        onRegisterWorkout={handleRegisterWorkout}
      />
    ),
    [
      menuVisible,
      menuOrigin,
      handleMenuPress,
      handleAddExerciseToWorkout,
      handleEditWorkout,
      handleDeleteWorkout,
      handleRegisterWorkout,
    ]
  );

  if (stage === 1) {
    if (!micro) return null;

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
          <View style={styles.container}>
            {/* ciclo de treinos */}
            <DraggableFlatList
              data={workouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item) => item.id}
              onDragEnd={handleDragEnd}
              containerStyle={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={50}
              windowSize={5}
              initialNumToRender={3}
              removeClippedSubviews={true}
              ListHeaderComponent={
                <>
                  <BackAndTitle onBack={onBack} title={micro.microCycleName} />

                  {/* info treino */}
                  <View style={styles.blockHeader}>
                    <AppText style={styles.infoHeader}>
                      Dias de treino: {micro.trainingDays ?? "—"}
                    </AppText>
                    {micro.volumes ? (
                      <AppText style={styles.infoHeader}>
                        Séries por Micro: {totalSets}
                      </AppText>
                    ) : null}
                  </View>
                </>
              }
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
                  <ScrollView>
                    <View style={styles.teste}>
                      <BackAndTitle
                        title={`${selectedWorkoutName ?? "Treino"}`}
                        onBack={onBackModal}
                      />
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
                        fadeDuration={0}
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
                  </ScrollView>
                </View>
              </Modal>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={{ marginBottom: 20 }} />
      </GestureHandlerRootView>
    );
  }

  //----------------- TELA DE ADICIONAR EXERCICIO (STAGE 2) -----------------
  if (stage === 2) {
    const handleBackFromStage2 = () => {
      setFilteredExercises(null);
      setActiveFilter(null);
      setStage(1);
    };

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredExercises ?? exercises}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <ExerciseItem
              item={item}
              onAddExercise={handleAddExercisePress}
              exerciseExists={checkIfExerciseExistsInWorkout(item.id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          initialNumToRender={6}
          removeClippedSubviews={true}
          ListHeaderComponent={
            <>
              <View>
                <View style={styles.nameAndFilter}>
                  <BackAndTitle
                    onBack={handleBackFromStage2}
                    title={"ADICIONAR EXERCÍCIO"}
                  />
                  <Pressable
                    onPress={() => setStage(4)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    delayLongPress={0}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor: pressed
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      padding: 8,
                      borderRadius: 8,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    })}
                  >
                    <FontAwesome6
                      style={styles.filter}
                      name="filter"
                      size={20}
                      color={themas.Colors.secondary}
                    />
                  </Pressable>
                </View>
              </View>
              {activeFilter && (
                <View style={styles.activeFilterDeleteWrapper}>
                  <View style={styles.activeFilter}>
                    <AppText>{formatMuscleLabel(activeFilter)}</AppText>
                  </View>
                  <View style={styles.activeFilter}>
                    <Pressable
                      onPress={handleClearFilter}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      delayLongPress={0}
                    >
                      <FontAwesome6 name="xmark" size={15} color="white" />
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          }
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
        {alertVisible && (
          <CustomAlertTwoOptions
            title="Exercício Adicionado!"
            message="Quer adicionar mais exercícios nesse treino?"
            buttonTextOne="Adicionar"
            buttonTextTwo="OK"
            visible={alertVisible}
            onPress={() => setAlertVisible(false)}
            onClose={() => {
              setTargetWorkoutName(null);
              loadMicro();
              setStage(1);
              setAlertVisible(false);
            }}
          />
        )}
      </View>
    );
  }

  if (stage === 4) {
    const handleSelectPrimaryMuscle = async (muscleLabel: string) => {
      try {
        setLoading(true);
        setActiveFilter(muscleLabel);
        const filtersPrimaryMuscle = `primaryMuscle=${encodeURIComponent(
          muscleLabel
        )}`;
        const { data } = await getAllExercise(1, 10, filtersPrimaryMuscle);

        setFilteredExercises(data);
        setPage(2);
        setHasMore(true);
        setStage(2);
      } catch (err) {
        console.error("Erro ao filtrar exercícios:", err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={() => setStage(2)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          delayLongPress={0}
          style={{ marginVertical: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <FiltersByMuscle
          getAllExercise={getAllExercise}
          onSelectMuscle={handleSelectPrimaryMuscle}
        />
      </View>
    );
  }
};

export default SelectedMicro;
