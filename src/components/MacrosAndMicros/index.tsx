import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import AppText from "../AppText";
import { styles } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import { MacroCycle, MicroCycle } from "@/contexts/User/interface";

const MacrosButton = () => {
  const { user, getAllMacroCycles, getAllMicroCycles } =
    useContext(UserContext);
  const [stage, setStage] = useState<1 | 2>(1);
  const [selectedMacro, setSelectedMacro] = useState<MacroCycle | null>(null);
  const [macros, setMacros] = useState<MacroCycle[]>([]);
  const [micros, setMicros] = useState<MicroCycle[]>([]);

  useEffect(() => {
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

    loadMacros();
  }, [user, getAllMacroCycles]);

  useEffect(() => {
    const loadMicros = async () => {
      if (user) {
        try {
          const data: MicroCycle[] = await getAllMicroCycles();
          setMicros(data);
        } catch (error) {
          console.error("Erro ao buscar Micro Ciclos:", error);
        }
      }
    };

    loadMicros();
  }, [user, getAllMicroCycles]);

  // --- Tela de Micro Ciclos ---
  if (stage === 2 && selectedMacro) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <AppText style={styles.name}>
          {selectedMacro.macroCycleName.toUpperCase()}
        </AppText>

        {micros.length > 0 ? (
          micros.map((micro) => (
            <View key={micro.id} style={styles.blocks}>
              <AppText style={styles.name}>{micro.microCycleName.toLocaleUpperCase()}</AppText>
              <AppText>DIAS DE TREINO: {micro.trainingDays}</AppText>
            </View>
          ))
        ) : (
          <AppText>Nenhum Micro Ciclo encontrado.</AppText>
        )}

        {/* Botão para voltar */}
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => {
            setStage(1);
            setSelectedMacro(null);
          }}
        >
          <AppText style={{ color: "white" }}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- Tela de Macro Ciclos ---
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {macros.length > 0 ? (
        macros.map((macro) => {
          const endDate = new Date(macro.endDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });

          return (
            <TouchableOpacity
              key={macro.id}
              style={styles.blocks}
              onPress={() => {
                setSelectedMacro(macro);
                setStage(2);
              }}
            >
              <AppText style={styles.name}>
                {macro.macroCycleName.toUpperCase()}
              </AppText>
              <View style={styles.infosWrap}>
                <AppText style={styles.info}>
                  Término previsto: {endDate}
                </AppText>
                <AppText style={styles.info}>
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
  );
};

export default MacrosButton;
