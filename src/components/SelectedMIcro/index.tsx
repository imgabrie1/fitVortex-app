import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import AppText from "../AppText";
import { UserContext } from "@/contexts/User/UserContext";
import { MicroCycle } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";

interface SelectedMicroProps {
  microId: string;
  onBack: () => void;
}

const SelectedMicro = ({ microId, onBack }: SelectedMicroProps) => {
  const { getMicroCycleByID } = useContext(UserContext);

  const [micro, setMicro] = useState<MicroCycle | null>(null);
  const [loading, setLoading] = useState(false);

  // --- HELPERS ---
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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMicroCycleByID(microId);
        if (mounted) setMicro(data);
      } catch (err) {
        console.error("Erro ao buscar Micro Ciclo:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [microId]);

  if (!micro) return null;

  const normalizedCycleItems = normalizeCycleItems(micro);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
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

      <View style={styles.blockHeader}>
        <AppText style={styles.infoHeader}>
          Dias de treino: {micro.trainingDays ?? "—"}
        </AppText>
        {micro.volumes ? (
          <AppText style={styles.infoHeader}>
            SÉRIES POR MICRO: {micro.volumes.length ?? 0}
          </AppText>
        ) : null}
      </View>

      {normalizedCycleItems && normalizedCycleItems.length > 0 ? (
        normalizedCycleItems.map((ci: any) => {
          const workoutName = ci.workout.name;
          const workoutExercises = ci.workout?.workoutExercises ?? [];
          const sets = Array.isArray(ci.sets) ? ci.sets : [];
          const setsByExercise = groupSetsByExercise(sets);

          return (
            <View key={ci.id} style={[styles.blocks, { marginTop: 12 }]}>
              <View style={styles.infoWorkoutWrap}>
                <AppText style={styles.name}>{workoutName}</AppText>
                <AppText style={styles.info}>
                  Exercícios no treino: {workoutExercises.length}
                </AppText>
                {workoutExercises.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <AppText style={[styles.info, { fontWeight: "600" }]}>
                      Detalhes dos exercícios:
                    </AppText>
                    {workoutExercises.map((we: any, idx: number) => (
                      <AppText key={we.id ?? idx} style={styles.info}>
                        • Séries (previstas): {we.targetSets ?? "—"}
                      </AppText>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ marginTop: 8 }}>
                <AppText style={[styles.info, { fontWeight: "600" }]}>
                  Séries registradas:
                </AppText>

                {Object.keys(setsByExercise).length === 0 && (
                  <AppText style={styles.info}>Nenhum set registrado</AppText>
                )}

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
                          <View
                            key={s.id}
                            style={{ marginLeft: 8, marginTop: 4 }}
                          >
                            <AppText style={styles.info}>
                              • reps: {s.reps ?? "—"} — peso: {weight}
                            </AppText>
                            {s.notes ? (
                              <AppText style={[styles.info, { fontSize: 12 }]}>
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
            </View>
          );
        })
      ) : (
        <AppText style={{ marginTop: 12 }}>
          Nenhum cycle item encontrado.
        </AppText>
      )}
    </ScrollView>
  );
};

export default SelectedMicro;
