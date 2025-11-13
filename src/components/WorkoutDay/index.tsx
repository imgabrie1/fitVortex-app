import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, ActivityIndicator, Image } from "react-native";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import AppText from "../AppText";
import {
  WorkoutWithSets,
  WorkoutExerciseWithSets,
  Set,
} from "@/contexts/User/interface";

interface WorkoutDayProps {
  hasScrollView?: boolean;
  contentContainerStyle?: any;
  ListHeaderComponent?: React.ReactElement | null;
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ hasScrollView = true, contentContainerStyle, ListHeaderComponent = null }) => {
  const { user, getAllWorkouts } = useContext(UserContext);
  const [workouts, setWorkouts] = useState<WorkoutWithSets[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadWorkouts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      if (user) {
        const data = await getAllWorkouts(page, 10);
        if (data && data.data && data.data.length > 0) {
          setWorkouts((prevWorkouts) => [...prevWorkouts, ...data.data]);
          setPage((prevPage) => prevPage + 1);
          if (data.page >= data.lastPage) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [user]);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const renderItem = ({ item: workout }: { item: WorkoutWithSets }) => {
    const totalExecutedSeries = workout.workoutExercises.reduce(
      (acc: number, exercise: WorkoutExerciseWithSets) =>
        acc + (exercise.sets?.length || 0),
      0
    );

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
      <View style={styles.card}>
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
              <AppText style={styles.bottomInfoValue}>em produção...</AppText>
            </View>

            <View style={styles.bottomInfoWrap}>
              <AppText style={styles.bottomInfo}>Séries executadas: </AppText>
              <AppText style={styles.bottomInfoValue}>
                {totalExecutedSeries}/{totalPlannedSeries}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          {workout.workoutExercises.map(
            (exercise: WorkoutExerciseWithSets, exerciseIndex: number) => {
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
                  key={`${exercise.id}-${workout.id}-${exerciseIndex}`}
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
  };

  return (
    <FlatList
      data={workouts.filter(workout => workout.workoutExercises.reduce((total, exercise) => total + (exercise.sets?.length || 0), 0) > 0)}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      style={styles.container}
      contentContainerStyle={[{ paddingBottom: 20, paddingTop: 20 }, contentContainerStyle]}
      onEndReached={loadWorkouts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<AppText style={{}}>Nenhum treino executado encontrado.</AppText>}
    />
  );
};

export default WorkoutDay;