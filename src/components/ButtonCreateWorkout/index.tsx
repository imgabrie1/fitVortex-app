import React from "react";
import { TouchableOpacity } from "react-native";
import { style } from "./styles";
import { themas } from "@/global/themes";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
  onPress?: () => void;
}

const ButtonCreateWorkout: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={style.containerButton} onPress={onPress}>
      <MaterialCommunityIcons name="dumbbell" size={20} color={themas.Colors.text} />
    </TouchableOpacity>
  );
};

export default ButtonCreateWorkout;