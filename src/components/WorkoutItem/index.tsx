import { themas } from "@/global/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import AnimatedMenu from "../AnimatedMenu";
import AppText from "../AppText";
import { styles } from "./styles";
import { Button } from "../Button";

interface WorkoutItemProps {
  item: any;
  drag: () => void;
  isActive: boolean;
  onMenuPress: (e: any, itemId: string) => void;
  menuVisible: string | null;
  menuOrigin: { x: number; y: number } | undefined;
  onAddExercise: (workoutName: string) => void;
  onEditWorkout: (item: any) => void;
  onDeleteWorkout: (item: any) => void;
  onRegisterWorkout: (workout: any) => void;
}

const WorkoutItem = memo(
  ({
    item,
    drag,
    isActive,
    onMenuPress,
    menuVisible,
    menuOrigin,
    onAddExercise,
    onEditWorkout,
    onDeleteWorkout,
    onRegisterWorkout,
  }: WorkoutItemProps) => {
    const workoutName = item.workout.name;
    const workoutExercises = item.workout?.workoutExercises ?? [];
    const sets = Array.isArray(item.sets) ? item.sets : [];
    const hasSets = sets.length > 0;

    const groupSetsByExercise = (sets: any[] = []) => {
      return sets.reduce<Record<string, any[]>>((acc, s) => {
        const exId = s?.exercise?.id ?? "unknown";
        if (!acc[exId]) acc[exId] = [];
        acc[exId].push(s);
        return acc;
      }, {});
    };

    const toNumber = (v?: string | number | null) => {
      if (v == null) return 0;
      const n = typeof v === "number" ? v : Number.parseFloat(String(v));
      return Number.isFinite(n) ? n : 0;
    };

    const setsByExercise = groupSetsByExercise(sets);

    const getExercisePosition = (exerciseId: string) => {
      const workoutExercise = workoutExercises.find(
        (we: any) => we.exercise.id === exerciseId
      );
      return workoutExercise?.position ?? 0;
    };

    const sortedSetsByExercise = Object.entries(setsByExercise).sort(
      ([exIdA], [exIdB]) => {
        const posA = getExercisePosition(exIdA);
        const posB = getExercisePosition(exIdB);
        return posA - posB;
      }
    );

    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.blocks,
          {
            marginTop: 12,
            backgroundColor: isActive
              ? themas.Colors.secondary
              : themas.Colors.blocks,
          },
        ]}
      >
        <View style={styles.infoWorkoutWrap}>
          <View style={styles.nameAndMenuWrap}>
            <AppText style={styles.name}>{workoutName}</AppText>
            <TouchableOpacity onPress={(e) => onMenuPress(e, item.id)}>
              <MaterialIcons name="menu" size={18} color={themas.Colors.text} />
            </TouchableOpacity>

            <AnimatedMenu
              visible={menuVisible === item.id}
              origin={menuOrigin}
              style={styles.editAndDeleteWrap}
              onAddExercise={() => onAddExercise(item.workout.name)}
              onEdit={() => onEditWorkout(item)}
              onDelete={() => onDeleteWorkout(item)}
            />
          </View>
          <AppText style={styles.info}>
            Exercícios no treino: {workoutExercises.length}
          </AppText>
        </View>

        {hasSets ? (
          <View style={{ marginTop: 8 }}>
            <View>
              <AppText style={[styles.info, { fontWeight: "600" }]}>
                Séries registradas:
              </AppText>
            </View>

            {/* Container principal dos exercícios em linha */}
            <View style={styles.exercisesContainer}>
              {sortedSetsByExercise.map(([exId, arr]) => {
                const exName = arr[0]?.exercise?.name ?? "Exercício";
                const exImage = arr[0]?.exercise?.imageURL;

                return (
                  <View key={exId} style={styles.exerciseItem}>
                    {/* Imagem do exercício */}
                    {exImage && (
                      <Image
                        source={{ uri: exImage }}
                        style={styles.exerciseImage}
                        resizeMode="cover"
                        fadeDuration={0}
                      />
                    )}

                    {/* Nome do exercício */}
                    <AppText style={styles.exerciseName}>{exName}</AppText>

                    {/* Séries e reps */}
                    <View style={styles.setsContainer}>
                      {arr.map((s: any, index: number) => {
                        const weight = toNumber(s.weight).toFixed(1);
                        return (
                          <View key={s.id} style={styles.setItem}>
                            <AppText style={[styles.setInfo, styles.set]}>
                              Série {index + 1}
                            </AppText>
                            <AppText style={styles.setInfo}>
                              {s.reps ?? "—"} reps
                            </AppText>
                            <AppText style={styles.setInfo}>
                              {weight} kg
                            </AppText>
                            {s.notes ? (
                              <AppText style={styles.notes}>{s.notes}</AppText>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            {workoutExercises.length <= 0 ? (
              <Button
                text="Adicionar Exercícios"
                onPress={() => onAddExercise(workoutName)}
              />
            ) : (
              <Button
                text="Registrar Treino"
                onPress={() => onRegisterWorkout(item.workout)}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default WorkoutItem;
