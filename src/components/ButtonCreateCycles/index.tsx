import React from "react";
import { TouchableOpacity } from "react-native";
import { style } from "./styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { themas } from "@/global/themes";

interface Props {
  onPress?: () => void;
}

const ButtonCreateCycles: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={style.containerButton} onPress={onPress}>
      <FontAwesome5 name="plus" size={20} color={themas.Colors.text} />
    </TouchableOpacity>
  );
};

export default ButtonCreateCycles;