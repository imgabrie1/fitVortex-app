import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { style } from "./styles";

type Props = {
  text: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  styleButton?: StyleProp<ViewStyle>;
};

export const Button = ({ text, onPress, loading, disabled, styleButton }: Props) => {
  return (
    <TouchableOpacity
      style={[style.button, styleButton, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="#FFF" /> : <Text style={style.textButton}>{text}</Text>}
    </TouchableOpacity>
  );
};