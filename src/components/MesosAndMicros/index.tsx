import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import AppText from "../AppText";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import {
  Exercise,
  MesoCycle,
  MicroCycle,
  newMesoWithAI,
} from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import SelectedMicro from "../SelectedMicro";
import CreateAndEditCycles from "../CreateAndEditCycles";
import CreateWorkoutForm from "../CreateWorkout";
import ItemOptionsMenu from "../ItemOptionsMenu";
import { Button } from "../Button";
import BackAndTitle from "../BackAndTitle";
import { themas } from "@/global/themes";
import AdjustVolumeForm from "../AdjustVolumeForm";
import CustomAlertOneOption from "../AlertOneOptions";
import CustomAlertTwoOptions from "../AlertTwoOptions";

const MesosAndMicros = ({ initialParams }: { initialParams?: any }) => {
  const {
    user,
    getAllMesoCycles,
    getMesoCycleByID,
    createMesoCycle,
    createMicroCycle,
    addMicroInMeso,
    deleteCycles,
    createWorkout,
    addWorkoutInMicro,
    adjustVolume,
    editCycles,
    loadingForm,
  } = useContext(UserContext);

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [selectedMeso, setSelectedMeso] = useState<MesoCycle | null>(null);
  const [selectedMicro, setSelectedMicro] = useState<MicroCycle | null>(null);
  const [selectedMicroId, setSelectedMicroId] = useState<string | null>(null);
  const [initialCycleItemId, setInitialCycleItemId] = useState<string | null>(
    null,
  );
  const [restoreTrigger, setRestoreTrigger] = useState<number | null>(null);

  useEffect(() => {
    if (initialParams?.restore && initialParams?.microId) {
      setStage(3);
      setSelectedMicroId(initialParams.microId);
      if (initialParams.cycleItemId) {
        setInitialCycleItemId(initialParams.cycleItemId);
      }
      if (initialParams.timestamp) {
        setRestoreTrigger(initialParams.timestamp);
      }
    }
  }, [initialParams]);

  const [mesos, setMesos] = useState<MesoCycle[]>([]);
  const [micros, setMicros] = useState<MicroCycle[]>([]);
  const [isCreateWorkoutModalVisible, setCreateWorkoutModalVisible] =
    useState(false);
  const [isAjustVolumeModalVisible, setAjustVolumeModalVisible] =
    useState(false);
  const [AdjustVolumeAlertVisible, setAdjustVolumeAlertVisible] =
    useState(false);
  const [deleteCycleAlertVisible, setDeleteCycleAlertVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "meso" | "micro";
  } | null>(null);
  const [cycleNameToDelete, setCycleNameToDelete] = useState<{
    cycleName: string;
  } | null>(null);
  const [alertCreateWorkout, setAlertCreateWorkout] = useState(false);
  const [isCycleModalVisible, setCycleModalVisible] = useState(false);
  const [editingCycle, setEditingCycle] = useState<{
    id: string;
    type: "meso" | "micro";
    data: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (stage === 3) {
          setStage(2);
          setSelectedMicro(null);
          setSelectedMicroId(null);
          return true;
        }
        if (stage === 2) {
          setStage(1);
          setSelectedMeso(null);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [stage]),
  );

  const loadMesos = async () => {
    if (user) {
      setLoading(true);
      try {
        const data: MesoCycle[] = await getAllMesoCycles();
        setMesos(data);
      } catch (error) {
        console.error("Erro ao buscar Meso Ciclos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMesos();
  }, [user]);

  const loadMicros = async () => {
    if (selectedMeso) {
      setLoading(true);
      try {
        const data = await getMesoCycleByID(selectedMeso.id);
        const extractedMicros = data.microCycles || [];

        const getNumber = (name: string) => {
          const match = name.match(/(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        };

        const sortedMicros = [...extractedMicros].sort(
          (a, b) => getNumber(a.microCycleName) - getNumber(b.microCycleName),
        );

        setMicros(sortedMicros);
      } catch (error) {
        console.error(
          "Erro ao buscar Micro Ciclos:",
          JSON.stringify(error, null, 2),
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMicros();
  }, [selectedMeso]);

  const ableToRenderAdjustButton = () => {
    if (stage !== 2 || micros.length === 0) return false;

    const allWorkoutsComplete = micros.every((micro) => {
      const cycleItemsCount = micro.cycleItems?.length || 0;
      return cycleItemsCount === micro.trainingDays;
    });

    if (!allWorkoutsComplete) return false;

    const allSetsFilled = micros.every((micro) => {
      return (
        micro.cycleItems?.every((cycleItem) => {
          return cycleItem.sets?.length > 0;
        }) ?? false
      );
    });

    return allSetsFilled;
  };

  const shouldShowCreateWorkoutButton = () => {
    if (stage !== 2 || micros.length === 0) return false;

    const hasMissingWorkouts = micros.some((micro) => {
      const cycleItemsCount = micro.cycleItems?.length || 0;
      return cycleItemsCount < micro.trainingDays;
    });

    return hasMissingWorkouts;
  };

  const handleCreate = async (data: any) => {
    try {
      if (stage === 1) {
        const newMeso: any = await createMesoCycle(data);

        await loadMesos();

        setSelectedMeso(newMeso);
        setStage(2);

        await loadMicros();
      } else if (stage === 2 && selectedMeso) {
        const { microCycleName, trainingDays } = data;
        const microQuantity = selectedMeso.microQuantity;

        for (let i = 1; i <= microQuantity; i++) {
          const newMicroName = `${microCycleName} ${i}`;
          const microPayload = {
            microCycleName: newMicroName,
            trainingDays: trainingDays,
          };
          const microCreated = await createMicroCycle(microPayload);
          await addMicroInMeso(selectedMeso.id, microCreated.id);
        }
        loadMicros();
      }
      setCycleModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar ciclo:", JSON.stringify(error, null, 2));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    if (!cycleNameToDelete) return;

    try {
      if (itemToDelete.type === "meso") {
        try {
          await deleteCycles("mesocycle", itemToDelete.id);
        } catch (error) {
          await deleteCycles("mesocycle", itemToDelete.id);
        }
        await loadMesos();
      } else {
        await deleteCycles("microcycle", itemToDelete.id);
        await loadMicros();
      }
    } catch (error) {
      console.error(
        "Falha ao deletar o ciclo após duas tentativas:",
        JSON.stringify(error, null, 2),
      );
      Alert.alert(
        "Erro ao Deletar",
        "Não foi possível deletar o ciclo. Verifique o console para mais detalhes.",
      );
    } finally {
      setItemToDelete(null);
      setCycleNameToDelete(null);
      setDeleteCycleAlertVisible(false);
    }
  };

  const handleEdit = async (
    data: any,
    editing: { id: string; type: "meso" | "micro" },
  ) => {
    try {
      await editCycles(
        editing.type === "meso" ? "mesocycle" : "microcycle",
        editing.id,
        data,
      );

      if (editing.type === "meso") {
        await loadMesos();
      } else {
        await loadMicros();
      }
    } catch (error) {
      console.error("Erro ao editar ciclo:", error);
    } finally {
      setEditingCycle(null);
      setCycleModalVisible(false);
    }
  };

  const handleCreateWorkout = async (data: any) => {
    if (!selectedMeso || micros.length === 0) return;

    try {
      setCreateWorkoutModalVisible(false);

      const newWorkout = await createWorkout(data);

      if (newWorkout?.id) {
        await Promise.all(
          micros.map((micro) => addWorkoutInMicro(micro.id, newWorkout.id)),
        );

        await loadMicros();

        setAlertCreateWorkout(true);
      }
    } catch (error) {
      console.error("Erro ao criar ou adicionar treino:", error);
    }
  };

  const allMicroCycleIds = micros.map((micro) => micro.id);

  const handleAdjustVolume = async (mesoID: string, payload: any) => {
    try {
      setLoading(true);
      setAjustVolumeModalVisible(false);

      const adjustPayload: newMesoWithAI = {
        createNewWorkout: payload.createNewWorkout || false,
        modifications:
          payload.modifications && payload.modifications.length > 0
            ? payload.modifications
            : undefined,
        maxSetsPerMicroCycle: payload.maxSetsPerMicroCycle || 24,
        legPriority: payload.legPriority || undefined,
      };

      const newMesoCycle = await adjustVolume(mesoID, adjustPayload);

      await loadMesos();

      setAdjustVolumeAlertVisible(true);

      return newMesoCycle;
    } catch (error) {
      console.error("Erro ao ajustar volume:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutDataMap = () => {
    const workoutDataMap: Record<string, Exercise[]> = {};
    if (micros.length > 0) {
      const lastMicro = micros[micros.length - 1];
      if (lastMicro.cycleItems) {
        lastMicro.cycleItems.forEach((ci) => {
          if (ci.workout && ci.workout.name && ci.workout.workoutExercises) {
            workoutDataMap[ci.workout.name] = ci.workout.workoutExercises.map(
              (we) => we.exercise,
            );
          }
        });
      }
    }
    return workoutDataMap;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={themas.Colors.secondary} />
      </View>
    );
  }

  if (stage === 3 && selectedMicroId) {
    return (
      <SelectedMicro
        microId={selectedMicroId}
        allMicrosId={allMicroCycleIds}
        initialCycleItemId={initialCycleItemId}
        restoreTrigger={restoreTrigger}
        onBack={() => {
          setStage(2);
          setSelectedMicro(null);
          setSelectedMicroId(null);
          setInitialCycleItemId(null);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, marginTop: 15 }}>
      {stage === 1 && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mesosTitles}>
            <AppText style={styles.name}>Meso Ciclos</AppText>
          </View>

          {mesos.length > 0 ? (
            mesos.map((meso, index) => {
              const startDate = meso.startDate
                ? new Date(meso.startDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    timeZone: "UTC",
                  })
                : "—";

              const endDate = meso.endDate
                ? new Date(meso.endDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    timeZone: "UTC",
                  })
                : "—";

              const isLastCreated = index === mesos.length - 1;

              return (
                <View key={meso.id} style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={[
                      styles.blocks,
                      isLastCreated && styles.blockSelected,
                    ]}
                    onPress={() => {
                      setSelectedMeso(meso);
                      setStage(2);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.nameAndMenuWrap}>
                      <AppText style={styles.name}>
                        {meso.macroCycleName.toUpperCase()}
                      </AppText>

                      <ItemOptionsMenu
                        onEdit={() => {
                          setEditingCycle({
                            id: meso.id,
                            type: "meso",
                            data: {
                              macroCycleName: meso.macroCycleName,
                              startDate: meso.startDate,
                              endDate: meso.endDate,
                              microQuantity: meso.microQuantity,
                            },
                          });
                          setCycleModalVisible(true);
                        }}
                        onDelete={() => {
                          setItemToDelete({ id: meso.id, type: "meso" });
                          setCycleNameToDelete({
                            cycleName: meso.macroCycleName,
                          });
                          setDeleteCycleAlertVisible(true);
                        }}
                      />
                    </View>

                    <View style={styles.infosWrap}>
                      <AppText
                        style={[
                          styles.info,
                          isLastCreated && styles.infoSelected,
                        ]}
                      >
                        Início: {startDate}
                      </AppText>
                      <AppText
                        style={[
                          styles.info,
                          isLastCreated && styles.infoSelected,
                        ]}
                      >
                        Término: {endDate}
                      </AppText>
                      <AppText
                        style={[
                          styles.info,
                          isLastCreated && styles.infoSelected,
                        ]}
                      >
                        Micro Ciclos: {meso.microQuantity}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <AppText>Nenhum Meso Ciclo encontrado.</AppText>
            </View>
          )}
        </ScrollView>
      )}

      {stage === 2 && selectedMeso && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <BackAndTitle
            onBack={() => {
              setStage(1);
              setSelectedMeso(null);
            }}
            title={`${selectedMeso?.macroCycleName}`}
          />

          {micros.length > 0 ? (
            micros.map((micro) => {
              const isCompleted =
                (micro.cycleItems?.length || 0) === micro.trainingDays &&
                micro.cycleItems?.every(
                  (item) => item.sets && item.sets.length > 0,
                );

              return (
                <View key={micro.id} style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={[styles.blocks, isCompleted && styles.blockSelected]}
                    onPress={() => {
                      setSelectedMicroId(micro.id);
                      setStage(3);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.nameAndMenuWrap}>
                      <AppText style={styles.name}>
                        {micro.microCycleName.toUpperCase()}
                      </AppText>

                      <ItemOptionsMenu
                        onEdit={() => {
                          setEditingCycle({
                            id: micro.id,
                            type: "micro",
                            data: {
                              microCycleName: micro.microCycleName,
                              trainingDays: micro.trainingDays,
                            },
                          });
                          setCycleModalVisible(true);
                        }}
                        onDelete={() => {
                          setItemToDelete({ id: micro.id, type: "micro" });
                          setCycleNameToDelete({
                            cycleName: micro.microCycleName,
                          });
                          setDeleteCycleAlertVisible(true);
                        }}
                      />
                    </View>

                    {micro.trainingDays > (micro.cycleItems?.length || 0) ? (
                      <AppText style={styles.info}>
                        Crie mais{" "}
                        {micro.trainingDays - (micro.cycleItems?.length || 0)}{" "}
                        Treinos
                      </AppText>
                    ) : null}

                    <AppText
                      style={[styles.info, isCompleted && styles.textSelected]}
                    >
                      TREINOS: {micro.cycleItems?.length || 0}
                    </AppText>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <AppText>Nenhum Micro Ciclo encontrado.</AppText>
            </View>
          )}
        </ScrollView>
      )}

      {stage === 1 && (
        <View style={styles.buttonWrapper}>
          <Button
            text="Novo Meso Ciclo"
            styleButton={styles.buttonStyled}
            onPress={() => setCycleModalVisible(true)}
          />
        </View>
      )}

      {stage === 2 && (
        <>
          {micros.length <= 0 && (
            <Button
              text="Criar Micro Ciclo"
              onPress={() => setCycleModalVisible(true)}
            />
          )}

          {micros.length > 0 && (
            <>
              {ableToRenderAdjustButton() ? (
                <Button
                  text="Ajustar Volume"
                  onPress={() => setAjustVolumeModalVisible(true)}
                />
              ) : (
                shouldShowCreateWorkoutButton() && (
                  <Button
                    text="Criar dia de Treino"
                    onPress={() => setCreateWorkoutModalVisible(true)}
                    loading={loadingForm}
                  />
                )
              )}
            </>
          )}
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateWorkoutModalVisible}
        onRequestClose={() => setCreateWorkoutModalVisible(false)}
      >
        <CreateWorkoutForm
          onClose={() => {
            setCreateWorkoutModalVisible(false);
          }}
          onSubmit={handleCreateWorkout}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCycleModalVisible}
        onRequestClose={() => {
          setCycleModalVisible(false);
          setEditingCycle(null);
        }}
      >
        <CreateAndEditCycles
          type={
            editingCycle ? editingCycle.type : stage === 1 ? "meso" : "micro"
          }
          onClose={() => {
            setCycleModalVisible(false);
            setEditingCycle(null);
          }}
          onSubmit={(data) => {
            if (editingCycle) {
              handleEdit(data, editingCycle);
            } else {
              handleCreate(data);
            }
          }}
          initialData={editingCycle?.data}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAjustVolumeModalVisible}
        onRequestClose={() => setAjustVolumeModalVisible(false)}
      >
        <AdjustVolumeForm
          onClose={() => setAjustVolumeModalVisible(false)}
          onSubmit={(data) => {
            if (selectedMeso) {
              handleAdjustVolume(selectedMeso.id, data);
            }
          }}
          availableWorkoutNames={Object.keys(getWorkoutDataMap())}
          availableWorkouts={getWorkoutDataMap()}
        />
      </Modal>

      {AdjustVolumeAlertVisible && (
        <CustomAlertOneOption
          title="Volume Ajustado!"
          message="Novo Meso Ciclo com novo volume criado!"
          visible={AdjustVolumeAlertVisible}
          onClose={() => {
            setStage(1);
            setAdjustVolumeAlertVisible(false);
          }}
        />
      )}

      {alertCreateWorkout && (
        <CustomAlertOneOption
          visible={alertCreateWorkout}
          onClose={() => setAlertCreateWorkout(false)}
          title="Treino Criado"
          message="Treino foi criado e adicionado em todos os Micro Ciclos deste Meso Ciclo"
        />
      )}

      {deleteCycleAlertVisible && (
        <CustomAlertTwoOptions
          visible={deleteCycleAlertVisible}
          onPress={handleDelete}
          onClose={() => {
            setDeleteCycleAlertVisible(false);
            setItemToDelete(null);
            setCycleNameToDelete(null);
          }}
          title={`Excluir ${
            itemToDelete?.type === "meso" ? "Meso:" : "Micro:"
          } ${cycleNameToDelete?.cycleName}?`}
          message={`Você tem certeza que deseja excluir este ${
            itemToDelete?.type === "meso" ? "meso" : "micro"
          } ciclo?`}
          buttonTextOne="Excluir"
          buttonTextTwo="Cancelar"
        />
      )}
    </View>
  );
};

export default MesosAndMicros;
