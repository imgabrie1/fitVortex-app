import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import AppText from "../AppText";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import { MacroCycle, MicroCycle } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import SelectedMicro from "../SelectedMicro";
import CreateCycles from "../CreateCycles";
import { themas } from "@/global/themes";
import CreateWorkoutForm from "../CreateWorkout";
import AnimatedMenu from "../AnimatedMenu";
import { Button } from "../Button";
import BackAndTitle from "../BackAndTitle";

const MacrosAndMicros = () => {
  const {
    user,
    getAllMacroCycles,
    getMacroCycleByID,
    createMacroCycle,
    createMicroCycle,
    addMicroInMacro,
    deleteCycles,
    createWorkout,
    addWorkoutInMicro,
  } = useContext(UserContext);

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [selectedMacro, setSelectedMacro] = useState<MacroCycle | null>(null);
  const [selectedMicro, setSelectedMicro] = useState<MicroCycle | null>(null);
  const [selectedMicroId, setSelectedMicroId] = useState<string | null>(null);
  const [macros, setMacros] = useState<MacroCycle[]>([]);
  const [micros, setMicros] = useState<MicroCycle[]>([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isCreateWorkoutModalVisible, setCreateWorkoutModalVisible] =
    useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [menuOrigin, setMenuOrigin] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );

  const loadMacros = async () => {
    if (user) {
      try {
        const data: MacroCycle[] = await getAllMacroCycles();
        setMacros(data);
      } catch (error) {
        console.error("Erro ao buscar Macro Ciclos:", error);
      }
    }
  };

  useEffect(() => {
    loadMacros();
  }, [user]);

  const loadMicros = async () => {
    if (selectedMacro) {
      try {
        const data = await getMacroCycleByID(selectedMacro.id);
        const extractedMicros = (data.items ?? []).map(
          (item: any) => item.microCycle
        );
        setMicros(extractedMicros);
      } catch (error) {
        console.error("Erro ao buscar Micro Ciclos:", error);
      }
    }
  };

  useEffect(() => {
    loadMicros();
  }, [selectedMacro]);

  const handleCreate = async (data: any) => {
    try {
      if (stage === 1) {
        const newMacro: any = await createMacroCycle(data);

        await loadMacros();

        setSelectedMacro(newMacro);
        setStage(2);

        await loadMicros();
      } else if (stage === 2 && selectedMacro) {
        const { microCycleName, trainingDays } = data;
        const microQuantity = selectedMacro.microQuantity;

        for (let i = 1; i <= microQuantity; i++) {
          const newMicroName = `${microCycleName} ${i}`;
          const microPayload = {
            microCycleName: newMicroName,
            trainingDays: trainingDays,
          };
          const microCreated = await createMicroCycle(microPayload);
          await addMicroInMacro(selectedMacro.id, microCreated.id);
        }
        loadMicros();
      }
      setCreateModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar ciclo:", JSON.stringify(error, null, 2));
    }
  };

  const handleDelete = async (cycleID: string) => {
    try {
      if (stage === 1) {
        await deleteCycles("macrocycle", cycleID);
        loadMacros();
      } else if (stage === 2 && selectedMacro) {
        await deleteCycles("microcycle", cycleID);
        loadMicros();
      }
    } catch (error) {
      console.error("Erro ao deletar ciclo:", JSON.stringify(error, null, 2));
    }
  };

  const handleCreateWorkout = async (data: any) => {
    if (!selectedMacro || micros.length === 0) return;

    try {
      setCreateWorkoutModalVisible(false);

      const newWorkout = await createWorkout(data);

      if (newWorkout?.id) {
        await Promise.all(
          micros.map((micro) => addWorkoutInMicro(micro.id, newWorkout.id))
        );

        await loadMicros();

        Alert.alert("Sucesso!", "O dia de treino foi criado.");
      }
    } catch (error) {
      console.error("Erro ao criar ou adicionar treino:", error);
    }
  };

  const allMicroCycleIds = macros.flatMap((macro) =>
    macro.items.map((item) => item.microCycle.id)
  );

  // -- tela de infos de micro (stage 3) --
  if (stage === 3 && selectedMicroId) {
    return (
      <SelectedMicro
        microId={selectedMicroId}
        allMicrosId={allMicroCycleIds}
        onBack={() => {
          setStage(2);
          setSelectedMicro(null);
          setSelectedMicroId(null);
        }}
      />
    );
  }

  // -- tela principal --
  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(null)}>
      <View style={{ flex: 1 }}>
        {/* ------------------ STAGE 1: MACROS ------------------ */}
        {stage === 1 && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.macrosTitles}>
              <AppText style={styles.name}>Macro Ciclos</AppText>
            </View>

            {macros.length > 0 ? (
              macros.map((macro, index) => {
                const endDate = macro.endDate
                  ? new Date(macro.endDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      timeZone: "UTC",
                    })
                  : "—";

                const isLastCreated = index === macros.length - 1;

                return (
                  <View key={macro.id} style={{ position: "relative" }}>
                    <TouchableOpacity
                      style={[
                        styles.blocks,
                        isLastCreated && styles.blockSelected,
                      ]}
                      onPress={() => {
                        setSelectedMacro(macro);
                        setStage(2);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.nameAndMenuWrap}>
                        <AppText style={styles.name}>
                          {macro.macroCycleName.toUpperCase()}
                        </AppText>

                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            const { pageX, pageY } = e.nativeEvent;
                            setMenuOrigin({ x: pageX, y: pageY });
                            setMenuVisible((prev) =>
                              prev === macro.id ? null : macro.id
                            );
                          }}
                        >
                          <MaterialIcons
                            name="menu"
                            size={18}
                            color={themas.Colors.text}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.infosWrap}>
                        <AppText
                          style={[
                            styles.info,
                            isLastCreated && styles.infoSelected,
                          ]}
                        >
                          Término previsto: {endDate}
                        </AppText>
                        <AppText
                          style={[
                            styles.info,
                            isLastCreated && styles.infoSelected,
                          ]}
                        >
                          Micro Ciclos: {macro.microQuantity}
                        </AppText>
                      </View>
                    </TouchableOpacity>

                    <AnimatedMenu
                      visible={menuVisible === macro.id}
                      origin={menuOrigin}
                      style={styles.editAndDeleteWrap}
                      onEdit={() => {
                        console.log("Editar macro:", macro.macroCycleName);
                        setMenuVisible(null);
                      }}
                      onDelete={() => {
                        handleDelete(macro.id);
                        setMenuVisible(null);
                      }}
                    />
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
                <AppText>Nenhum Macro Ciclo encontrado.</AppText>
              </View>
            )}
          </ScrollView>
        )}

        {/* ------------------ STAGE 2: MICROS ------------------ */}
        {stage === 2 && selectedMacro && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <BackAndTitle
              onBack={() => {
                setStage(1);
                setSelectedMacro(null);
              }}
              title={`${selectedMacro?.macroCycleName}`}
            />

            {micros.length > 0 ? (
              micros.map((micro) => (
                <View key={micro.id} style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.blocks}
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

                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          const { pageX, pageY } = e.nativeEvent;
                          setMenuOrigin({ x: pageX, y: pageY });
                          setMenuVisible((prev) =>
                            prev === micro.id ? null : micro.id
                          );
                        }}
                      >
                        <MaterialIcons
                          name="menu"
                          size={18}
                          color={themas.Colors.text}
                        />
                      </TouchableOpacity>
                    </View>

                    <AppText style={styles.info}>
                      DIAS DE TREINO: {micro.trainingDays}
                    </AppText>
                  </TouchableOpacity>

                  <AnimatedMenu
                    visible={menuVisible === micro.id}
                    origin={menuOrigin}
                    style={styles.editAndDeleteWrap}
                    onEdit={() => {
                      console.log("Editar macro:", micro.microCycleName);
                      setMenuVisible(null);
                    }}
                    onDelete={() => {
                      handleDelete(micro.id);
                      setMenuVisible(null);
                    }}
                  />
                </View>
              ))
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

        {/* botão de criar ciclo */}
        {stage === 1 && (
          <Button
            text="Criar Macro Ciclo"
            onPress={() => setCreateModalVisible(true)}
          />
        )}
        {stage === 2 && micros.length <= 0 && (
          <View>
            <Button
              text="Criar Micro Ciclo"
              onPress={() => setCreateModalVisible(true)}
            />
          </View>
        )}
        {stage === 2 && micros.length > 0 && (
          <Button
            text="Criar dia de Treino"
            onPress={() => setCreateWorkoutModalVisible(true)}
          />
        )}

        {/* modal de criação de workout */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCreateWorkoutModalVisible}
          onRequestClose={() => setCreateWorkoutModalVisible(false)}
        >
          <CreateWorkoutForm
            onClose={() => setCreateWorkoutModalVisible(false)}
            onSubmit={handleCreateWorkout}
          />
        </Modal>

        {/* modal de criação */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCreateModalVisible}
          onRequestClose={() => setCreateModalVisible(false)}
        >
          <CreateCycles
            type={stage === 1 ? "macro" : "micro"}
            onClose={() => setCreateModalVisible(false)}
            onSubmit={handleCreate}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MacrosAndMicros;
