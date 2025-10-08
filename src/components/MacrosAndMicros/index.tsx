import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AppText from "../AppText";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import { MacroCycle, MicroCycle } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import SelectedMicro from "../SelectedMIcro";
import ButtonCreateCycles from "../ButtonCreateCycles";
import CreateCycles from "../CreateCycles";
import { themas } from "@/global/themes";

const MacrosAndMicros = () => {
  const {
    user,
    getAllMacroCycles,
    getMacroCycleByID,
    createMacroCycle,
    createMicroCycle,
    addMicroInMacro,
    deleteCycles,
  } = useContext(UserContext);

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [selectedMacro, setSelectedMacro] = useState<MacroCycle | null>(null);
  const [selectedMicro, setSelectedMicro] = useState<MicroCycle | null>(null);
  const [selectedMicroId, setSelectedMicroId] = useState<string | null>(null);
  const [macros, setMacros] = useState<MacroCycle[]>([]);
  const [micros, setMicros] = useState<MicroCycle[]>([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

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
        await createMacroCycle(data);
        loadMacros();
      } else if (stage === 2 && selectedMacro) {
        const microCreated = await createMicroCycle({ ...data });
        await addMicroInMacro(selectedMacro.id, microCreated.id);
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
        deleteCycles("macrocycle", cycleID);
        loadMacros();
      } else if (stage === 2 && selectedMacro) {
        deleteCycles("microcycle", cycleID);
        loadMicros();
      }
    } catch (error) {
      console.error("Erro ao deletar ciclo:", JSON.stringify(error, null, 2));
    }
  };

  // -- tela de infos de micro (stage 3) --
  if (stage === 3 && selectedMicroId) {
    return (
      <SelectedMicro
        microId={selectedMicroId}
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
              <AppText style={styles.name}>MACROCICLOS:</AppText>
            </View>

            {macros.map((macro, index) => {
              const endDate = macro.endDate
                ? new Date(macro.endDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
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

                  {menuVisible === macro.id && (
                    <View style={styles.editAndDeleteWrap}>
                      <TouchableOpacity
                        onPress={() => {
                          console.log("Editar macro:", macro.macroCycleName);
                          setMenuVisible(null);
                        }}
                        style={{ paddingVertical: 4 }}
                      >
                        <AppText style={{ color: "#fff" }}>Editar</AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleDelete(macro.id);
                          setMenuVisible(null);
                        }}
                        style={{ paddingVertical: 4 }}
                      >
                        <AppText style={{ color: "#fff" }}>Excluir</AppText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* ------------------ STAGE 2: MICROS ------------------ */}
        {stage === 2 && selectedMacro && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.nameAndBackWrap}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="white"
                onPress={() => {
                  setStage(1);
                  setSelectedMacro(null);
                }}
              />
              <AppText style={styles.name}>
                {selectedMacro?.macroCycleName?.toUpperCase()}
              </AppText>
              <View style={{ width: 24 }} />
            </View>

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

                  {menuVisible === micro.id && (
                    <View style={styles.editAndDeleteWrap}>
                      <TouchableOpacity
                        onPress={() => {
                          console.log("nome micro:", micro.microCycleName);
                          console.log("id micro:", micro.id);
                          setMenuVisible(null);
                        }}
                        style={{ paddingVertical: 4 }}
                      >
                        <AppText style={{ color: "#fff" }}>Editar</AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          console.log(micro.microCycleName)
                          handleDelete(micro.id);
                          setMenuVisible(null);
                        }}
                        style={{ paddingVertical: 4 }}
                      >
                        <AppText style={{ color: "#fff" }}>Excluir</AppText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <AppText>Nenhum Micro Ciclo encontrado.</AppText>
            )}
          </ScrollView>
        )}

        {/* Botão de criar ciclo */}
        <ButtonCreateCycles onPress={() => setCreateModalVisible(true)} />

        {/* Modal de criação */}
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
