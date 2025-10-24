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
}

const ExerciseItem = memo(
  ({ item, onAddExercise, exerciseExists }: ExerciseItemProps) => {
    const handlePress = () => {
      if (exerciseExists) {
        Alert.alert("Aviso", "Este exercício já está no treino.");
      } else {
        onAddExercise(item);
      }
    };

    return (
      <View style={styles.addExerciseUl}>
        <Image
          source={{ uri: item.imageURL }}
          style={styles.imagemURl}
          resizeMode="cover"
          fadeDuration={0}
        />
        <AppText style={styles.nameExercise}>{item.name}</AppText>
        {exerciseExists ? (
          <TouchableOpacity onPress={handlePress}>
            <MaterialIcons
              name="check"
              size={28}
              color={themas.Colors.secondary}
            />
          </TouchableOpacity>
        ) : (
          <Button
            text="Adicionar"
            styleButton={styles.styledButton}
            fontSize={12}
            onPress={handlePress}
          />
        )}
      </View>
    );
  }
);

export default ExerciseItem;
