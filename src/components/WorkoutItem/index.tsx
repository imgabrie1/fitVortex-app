import { themas } from "@/global/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { memo } from "react";
import { TouchableOpacity, View } from "react-native";
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

const WorkoutItem = memo(({
  item,
  drag,
  isActive,
  onMenuPress,
  menuVisible,
  menuOrigin,
  onAddExercise,
  onEditWorkout,
  onDeleteWorkout,
  onRegisterWorkout
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
        <View style={styles.nameAndMenuWrap}>
          <AppText style={styles.name}>{workoutName}</AppText>
          <TouchableOpacity
            onPress={(e) => onMenuPress(e, item.id)}
          >
            <MaterialIcons
              name="menu"
              size={18}
              color={themas.Colors.text}
            />
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
});

export default WorkoutItem;