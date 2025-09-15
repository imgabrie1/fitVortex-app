import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";

type Props = TextProps & { style?: StyleProp<TextStyle> };

export const AppText =({ style, ...props }: Props) => {
  return <Text {...props} style={[{ fontFamily: "RobotoRegular", color: "white" }, style]} />;
}

export default AppText