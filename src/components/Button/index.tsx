import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { style } from "./styles";

type Props = {
  text: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  styleButton?: StyleProp<ViewStyle>;
  fontSize?: number;
};

export const Button = ({
  text,
  onPress,
  loading,
  disabled,
  styleButton,
  fontSize,
}: Props) => {
  return (
    <TouchableOpacity
      style={[style.button, styleButton, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={[style.textButton, fontSize ? { fontSize } : {}]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
