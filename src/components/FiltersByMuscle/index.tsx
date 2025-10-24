import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { formatMuscleLabel } from "@/utils/formatMuscleLabel";
import { useMuscleFilters } from "@/utils/useMuscleFilters";
import AppText from "../AppText";
import { themas } from "@/global/themes";

interface FiltersByMuscleProps {
  onSelectMuscle: (muscleLabel: string) => void;
  getAllExercise: (
    page?: number,
    limit?: number,
    filters?: string
  ) => Promise<any>;
}

const FiltersByMuscle = ({
  onSelectMuscle,
  getAllExercise,
}: FiltersByMuscleProps) => {
  const { muscles, loading } = useMuscleFilters(getAllExercise);

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#fff" />
        <AppText style={{ marginTop: 10 }}>
          Carregando filtros...
        </AppText>
      </View>
    );
  }

  if (muscles.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <AppText>Nenhum filtro disponível</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={muscles}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            flex: 1,
            margin: 6,
            padding: 12,
            borderWidth: 1,
            borderColor: themas.Colors.lightGray,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => onSelectMuscle(item.label)}
        >
          <AppText >{formatMuscleLabel(item.label)}</AppText>
        </TouchableOpacity>
      )}
    />
  );
};

export default FiltersByMuscle;
