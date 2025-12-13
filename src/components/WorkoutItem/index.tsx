import { themas } from "@/global/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { memo, useContext, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import AnimatedMenu from "../AnimatedMenu";
import AppText from "../AppText";
import { styles } from "./styles";
import { Button } from "../Button";
import { UserContext } from "@/contexts/User/UserContext";

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
  onSkipWorkout: (workout: any) => void;
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
    onSkipWorkout,
  }: WorkoutItemProps) => {
    const { loadingForm } = useContext(UserContext);
    const [isExpanded, setIsExpanded] = useState(false);

    const workoutName = item.workout.name;
    const workoutExercises = item.workout?.workoutExercises ?? [];
    const sets = Array.isArray(item.sets) ? item.sets : [];
    const isSkipped = item.isSkipped;
    const hasSets = sets.length > 0;

    const openOptions = () => {
      setIsExpanded((prev) => !prev);
    };

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

    const getBlockBackgroundColor = () => {
      if (hasSets && !isSkipped) {
        return themas.Colors.primary;
      }
      if (isSkipped) {
        return themas.Colors.red;
      }
      return themas.Colors.blocks;
    };

    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.blocks,
          {
            marginTop: 12,
            backgroundColor: getBlockBackgroundColor(),
          },
        ]}
      >
        <TouchableOpacity style={styles.infoWorkoutWrap} onPress={openOptions}>
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
        </TouchableOpacity>

        {isExpanded && hasSets && !isSkipped && (
          <View style={styles.setsWrapp}>
            <View style={styles.setsBorder}>
              <AppText style={[styles.info, { fontWeight: "600" }]}>
                Séries registradas:
              </AppText>
            </View>

            {/* container principal dos exercícios */}
            <View style={styles.exercisesContainer}>
              {sortedSetsByExercise.map(([exId, arr]) => {
                const exName = arr[0]?.exercise?.name ?? "Exercício";
                const exImage = arr[0]?.exercise?.imageURL;

                return (
                  <View key={exId} style={styles.exerciseItem}>
                    {/* imagem do exercício */}
                    {exImage && (
                      <Image
                        source={{ uri: exImage }}
                        style={styles.exerciseImage}
                        resizeMode="cover"
                        fadeDuration={0}
                      />
                    )}

                    <View style={styles.infoWorkoutWrapp}>
                      {/* nome do exercício */}
                      <AppText style={styles.exerciseName}>{exName}</AppText>

                      {/* séries e reps */}
                      <View style={styles.setsContainer}>
                        {arr
                          .slice()
                          .sort((a, b) => a.id.localeCompare(b.id))
                          .map((s: any, index: number) => {
                            const weight = toNumber(s.weight);
                            weight % 1 === 0
                              ? weight.toString()
                              : weight.toFixed(2).replace(/\.?0+$/, "");
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
                                  <AppText style={styles.notes}>
                                    {s.notes}
                                  </AppText>
                                ) : null}
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {isExpanded && !hasSets && (
          <View style={{ marginTop: 12 }}>
            {workoutExercises.length <= 0 ? (
              <Button
                text="Adicionar Exercícios"
                onPress={() => onAddExercise(workoutName)}
              />
            ) : (
              <View style={styles.teste}>
                <Button
                  text="Registrar Treino"
                  onPress={() => onRegisterWorkout(item)}
                />
                <Button
                  text="Pular Treino"
                  onPress={() => onSkipWorkout(item)}
                  loading={loadingForm}
                />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default WorkoutItem;
