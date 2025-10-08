import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Modal } from "react-native";
import AppText from "../AppText";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import { MacroCycle, MicroCycle } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import SelectedMicro from "../SelectedMIcro";
import ButtonCreateCycles from "../ButtonCreateCycles";
import CreateCycles from "../CreateCycles";

const MacrosAndMicros = () => {
  const { user, getAllMacroCycles, getMacroCycleByID, createMacroCycle, createMicroCycle, addMicroInMacro } = useContext(UserContext);

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [selectedMacro, setSelectedMacro] = useState<MacroCycle | null>(null);
  const [selectedMicro, setSelectedMicro] = useState<MicroCycle | null>(null);
  const [selectedMicroId, setSelectedMicroId] = useState<string | null>(null);
  const [macros, setMacros] = useState<MacroCycle[]>([]);
  const [micros, setMicros] = useState<MicroCycle[]>([]);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

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
        const microCreated = await createMicroCycle({ ...data});
        await addMicroInMacro(selectedMacro.id, microCreated.id)
        loadMicros();
      }
      setCreateModalVisible(false);
    } catch (error) {
      console.error("Erro ao criar ciclo:", JSON.stringify(error, null, 2));
    }
  };

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

  return (
    <View style={{ flex: 1 }}>
      {stage === 1 && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.macrosTitles}>
            <AppText style={styles.name}>MACROCICLOS:</AppText>
          </View>
          {macros.length > 0 ? (
            macros.map((macro, index) => {
              const endDate = macro.endDate
                ? new Date(macro.endDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "—";

              const isLastCreated = index === macros.length - 1;

              return (
                <TouchableOpacity
                  key={macro.id}
                  style={[styles.blocks, isLastCreated && styles.blockSelected]}
                  onPress={() => {
                    setSelectedMacro(macro);
                    setStage(2);
                  }}
                >
                  <AppText style={styles.name}>
                    {macro.macroCycleName.toUpperCase()}
                  </AppText>
                  <View style={styles.infosWrap}>
                    <AppText
                      style={[styles.info, isLastCreated && styles.infoSelected]}
                    >
                      Término previsto: {endDate}
                    </AppText>
                    <AppText
                      style={[styles.info, isLastCreated && styles.infoSelected]}
                    >
                      Micro Ciclos: {macro.microQuantity}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <AppText>Nenhum Macro Ciclo encontrado.</AppText>
          )}
        </ScrollView>
      )}

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
              <TouchableOpacity
                key={micro.id}
                style={styles.blocks}
                onPress={() => {
                  setSelectedMicroId(micro.id);
                  setStage(3);
                }}
              >
                <AppText style={styles.name}>
                  {micro.microCycleName.toLocaleUpperCase()}
                </AppText>
                <AppText style={styles.info}>
                  DIAS DE TREINO: {micro.trainingDays}
                </AppText>
              </TouchableOpacity>
            ))
          ) : (
            <AppText>Nenhum Micro Ciclo encontrado.</AppText>
          )}
        </ScrollView>
      )}

      <ButtonCreateCycles onPress={() => setCreateModalVisible(true)} />

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
  );
};

export default MacrosAndMicros;
