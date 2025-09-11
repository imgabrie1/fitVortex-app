import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";

type Props = TextProps & { style?: StyleProp<TextStyle> };

export const TitleText =({ style, ...props }: Props) => {
  return <Text {...props} style={[{ fontFamily: "RussoOne" }, style]} />;
}

export default TitleText