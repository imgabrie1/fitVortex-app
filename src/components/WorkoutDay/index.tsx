import React, { useContext, useEffect, useState } from "react";
import { Image, View, ScrollView } from "react-native";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import AppText from "../AppText";
import {
  WorkoutWithSets,
  WorkoutExerciseWithSets,
  Set,
} from "@/contexts/User/interface";

const WorkoutDay = () => {
  const { user, getAllWorkouts } = useContext(UserContext);
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([]);

  useEffect(() => {
    const loadWorkouts = async () => {
      if (user) {
        try {
          const data: WorkoutWithSets[] = await getAllWorkouts();
          setWorkouts(data);
        } catch (error) {
          console.error("Erro ao buscar treinos:", error);
        }
      }
    };

    loadWorkouts();
  }, [user, getAllWorkouts]);

  // CORREÇÃO: Filtrar workouts que têm pelo menos UM exercício com séries executadas
  const workoutsWithExecutedSets = workouts.filter((workout) => {
    return workout.workoutExercises.some((exercise) => 
      exercise.sets && exercise.sets.length > 0
    );
  });

  // Ou alternativa: filtrar workouts que têm séries totais executadas > 0
  const workoutsWithVolume = workouts.filter((workout) => {
    const totalExecutedSets = workout.workoutExercises.reduce(
      (total, exercise) => total + (exercise.sets?.length || 0),
      0
    );
    return totalExecutedSets > 0;
  });

  const workoutsAbleToRender = workoutsWithVolume.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {workoutsAbleToRender ? (
        workoutsWithVolume.map((workout: WorkoutWithSets, workoutIndex: number) => {
          // Calcular séries EXECUTADAS (não as targetSets)
          const totalExecutedSeries = workout.workoutExercises.reduce(
            (acc: number, exercise: WorkoutExerciseWithSets) =>
              acc + (exercise.sets?.length || 0),
            0
          );

          // Calcular séries PLANEJADAS (targetSets)
          const totalPlannedSeries = workout.workoutExercises.reduce(
            (acc: number, exercise: WorkoutExerciseWithSets) =>
              acc + (exercise.targetSets || 0),
            0
          );

          const date = new Date(workout.createdAt);
          const formattedDate = date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            timeZone: "UTC",
          });
          const formattedTime = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <View key={`${workout.id}-${workoutIndex}`} style={styles.card}>
              <View style={styles.headerInfo}>
                <View style={styles.nameWhenWrap}>
                  <AppText style={styles.nameWorkout}>{workout.name}</AppText>
                  <AppText style={styles.dayText}>
                    {formattedDate} às {formattedTime}
                  </AppText>
                </View>

                <View style={styles.setsDurationWrap}>
                  <View style={styles.bottomInfoWrap}>
                    <AppText style={styles.bottomInfo}>Duração: </AppText>
                    <AppText style={styles.bottomInfoValue}>
                      em produção...
                    </AppText>
                  </View>

                  <View style={styles.bottomInfoWrap}>
                    <AppText style={styles.bottomInfo}>
                      Séries executadas:{" "}
                    </AppText>
                    <AppText style={styles.bottomInfoValue}>
                      {totalExecutedSeries}/{totalPlannedSeries}
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={styles.exercisesContainer}>
                {workout.workoutExercises.map(
                  (
                    exercise: WorkoutExerciseWithSets,
                    exerciseIndex: number
                  ) => {
                    // Pular exercícios que não têm séries executadas
                    if (!exercise.sets || exercise.sets.length === 0) {
                      return null;
                    }

                    const repsArray = exercise.sets.map((s: Set) => s.reps);

                    let repsText = "— reps";
                    if (repsArray.length > 0) {
                      const minReps = Math.min(...repsArray);
                      const maxReps = Math.max(...repsArray);

                      repsText =
                        minReps === maxReps
                          ? `${maxReps} reps`
                          : `${maxReps} - ${minReps} reps`;
                    }

                    return (
                      <View
                        key={`${exercise.id}-${workoutIndex}-${exerciseIndex}`}
                        style={styles.exerciseCard}
                      >
                        <Image
                          source={{ uri: exercise.exercise.imageURL }}
                          style={styles.exerciseImage}
                          resizeMode="cover"
                        />
                        <AppText style={styles.nameExercise}>
                          {exercise.exercise.name}
                        </AppText>
                        <View style={styles.infoSetsWrap}>
                          <AppText style={styles.infoSets}>
                            {exercise.sets.length} de {exercise.targetSets} séries{" • "}
                          </AppText>
                          <AppText style={styles.infoSets}>{repsText}</AppText>
                        </View>
                      </View>
                    );
                  }
                )}
              </View>
              <View style={styles.separatorWrapper}>
                <View style={styles.separator} />
              </View>
            </View>
          );
        })
      ) : (
        <AppText style={{}}>Nenhum treino executado encontrado.</AppText>
      )}
    </ScrollView>
  );
};

export default WorkoutDay;