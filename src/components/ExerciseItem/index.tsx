import React, { memo } from "react";
import { View, Image, TouchableOpacity, Alert } from "react-native";
import AppText from "../AppText";
import { Exercise } from "@/contexts/User/interface";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";
import { styles } from "./styles";
import { Button } from "../Button";

interface ExerciseItemProps {
  item: Exercise;
  onAddExercise: (exercise: Exercise) => void;
  exerciseExists: boolean;
  targetSetsInWorkout?: number | null;
}

const ExerciseItem = memo(
  ({
    item,
    onAddExercise,
    exerciseExists,
    targetSetsInWorkout,
  }: ExerciseItemProps) => {
    const handlePress = () => {
      if (exerciseExists) {
        Alert.alert("Aviso", "Este exercício já está no treino.");
      } else {
        onAddExercise(item);
      }
    };

    return (
      <View style={[styles.card, exerciseExists && styles.cardSelected]}>
        {exerciseExists && (
          <View style={styles.checkBadge}>
            <MaterialIcons name="check" size={14} color="#000" />
          </View>
        )}

        <Image
          source={{ uri: item.imageURL }}
          style={[styles.imagemURl, exerciseExists && styles.imagemSelected]}
          resizeMode="cover"
          fadeDuration={0}
        />

        <AppText style={styles.nameExercise} numberOfLines={2}>
          {item.name}
        </AppText>

        {exerciseExists ? (
          <View style={styles.checkButtonWrapper}>
            <AppText style={styles.setsInWorkoutText}>
              {targetSetsInWorkout != null
                ? `${targetSetsInWorkout} série${targetSetsInWorkout === 1 ? "" : "s"}`
                : "No treino"}
            </AppText>
          </View>
        ) : (
          <Button
            text="Adicionar"
            styleButton={styles.styledButton}
            onPress={handlePress}
            fontSize={13}
          />
        )}
      </View>
    );
  },
);

export default ExerciseItem;
