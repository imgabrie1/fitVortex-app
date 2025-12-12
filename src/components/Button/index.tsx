import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { style } from "./styles";
import { themas } from "@/global/themes";

type Props = {
  text: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  styleButton?: StyleProp<ViewStyle>;
  fontSize?: number;
  textColor?: string;
};

export const Button = ({
  text,
  onPress,
  loading,
  disabled,
  styleButton,
  fontSize,
  textColor,
}: Props) => {
  return (
    <TouchableOpacity
      style={[style.button, styleButton, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="large" color={themas.Colors.text} />
      ) : (
        <Text
          style={[
            style.textButton,
            fontSize ? { fontSize } : {},
            textColor ? { color: textColor } : {},
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
