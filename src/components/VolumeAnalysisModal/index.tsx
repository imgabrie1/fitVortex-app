import React, { useEffect, useMemo, useState } from "react";
import { View, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "../AppText";
import { themas } from "@/global/themes";
import { analyzeVolume } from "@/utils/volumeAnalysis";
import {
  getMuscleSection,
  getMuscleSubsection,
  MuscleSection,
  SECTION_ORDER,
} from "@/utils/muscleSections";
import { styles } from "./styles";

interface VolumeAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  cycleItems: any[];
}

const VolumeAnalysisModal = ({
  visible,
  onClose,
  cycleItems,
}: VolumeAnalysisModalProps) => {
  const { seriesDiretas, volumeDeSets, cargaVolumePorMusculo } = useMemo(
    () => analyzeVolume(cycleItems || []),
    [cycleItems],
  );

  const [activeSection, setActiveSection] = useState<MuscleSection>("Tronco");

  const filterBySection = (
    data: Record<string, number>,
    section: MuscleSection,
  ): Record<string, number> => {
    const filtered: Record<string, number> = {};
    Object.entries(data).forEach(([muscle, value]) => {
      if (getMuscleSection(muscle) === section) {
        filtered[muscle] = value;
      }
    });
    return filtered;
  };

  const sectionsWithData = useMemo(() => {
    const sections = new Set<MuscleSection>();
    const allMuscles = new Set<string>([
      ...Object.keys(seriesDiretas),
      ...Object.keys(volumeDeSets),
      ...Object.keys(cargaVolumePorMusculo),
    ]);
    allMuscles.forEach((muscle) => sections.add(getMuscleSection(muscle)));
    return SECTION_ORDER.filter((s) => sections.has(s));
  }, [seriesDiretas, volumeDeSets, cargaVolumePorMusculo]);

  useEffect(() => {
    if (
      sectionsWithData.length > 0 &&
      !sectionsWithData.includes(activeSection)
    ) {
      setActiveSection(sectionsWithData[0]);
    }
  }, [sectionsWithData, activeSection]);

  const renderSection = (
    title: string,
    data: Record<string, number>,
    borderColor: string,
    emptyMessage: string,
  ) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

    const grouped: Record<string, Array<[string, number]>> = {};
    entries.forEach(([muscle, value]) => {
      const sub = getMuscleSubsection(muscle);
      if (!grouped[sub]) grouped[sub] = [];
      grouped[sub].push([muscle, value]);
    });

    return (
      <View style={[styles.sectionCard, { borderColor }]}>
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>{title}</AppText>
          <AppText
            style={[styles.sectionBadge, { backgroundColor: borderColor }]}
          >
            {entries.length}
          </AppText>
        </View>

        {entries.length === 0 ? (
          <AppText style={styles.emptyText}>{emptyMessage}</AppText>
        ) : (
          Object.entries(grouped).map(([sub, items]) => (
            <View key={sub} style={styles.subsection}>
              <AppText style={styles.subsectionTitle}>
                {sub.toUpperCase()}
              </AppText>
              {items.map(([muscle, value]) => (
                <View key={muscle} style={styles.row}>
                  <AppText style={styles.rowLabel} numberOfLines={1}>
                    {muscle}
                  </AppText>
                  <AppText style={styles.rowValue}>{value.toFixed(1)}</AppText>
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    );
  };

  const filteredSeriesDiretas = filterBySection(seriesDiretas, activeSection);
  const filteredVolumeDeSets = filterBySection(volumeDeSets, activeSection);
  const filteredCarga = filterBySection(cargaVolumePorMusculo, activeSection);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText style={styles.title}>Análise de Volume</AppText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={themas.Colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsContainer}>
            {sectionsWithData.map((section) => {
              const isActive = activeSection === section;
              return (
                <TouchableOpacity
                  key={section}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveSection(section)}
                  activeOpacity={0.7}
                >
                  <AppText
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                  >
                    {section}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderSection(
              "Séries Diretas",
              filteredSeriesDiretas,
              themas.Colors.secondary,
              "Nenhuma série direta nesta seção.",
            )}
            {renderSection(
              "Volume de Séries (Equiv. + Pais)",
              filteredVolumeDeSets,
              themas.Colors.green,
              "Nenhum volume de séries nesta seção.",
            )}
            {renderSection(
              "Volume de Carga (reps × kg)",
              filteredCarga,
              "#4CAF50",
              "Nenhum treino gravado nesta seção.",
            )}
          </ScrollView>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <AppText style={styles.okButtonText}>OK</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VolumeAnalysisModal;
