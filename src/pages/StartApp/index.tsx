import { Button } from "@/components/Button";
import React from "react";
import { View } from "react-native";
import { navigate } from "@/navigation/RootNavigation";
import AppText from "@/components/AppText";
import { style } from "./styles";
import SymbolWelcome from "@/components/SymbolWelcome";

const StartApp = () => {
  const RegisterNavigation = () => {
    navigate("Register");
  };
  const LoginNavigation = () => {
    navigate("Login");
  };

  return (
    <View style={style.container}>
      <SymbolWelcome />
      <View style={style.buttonTextWrapper}>
        <View style={style.welcomeWrapper}>
          <View style={{ width: "100%", alignItems: "flex-start" }}>
            <AppText style={style.text}>NO PAIN</AppText>
          </View>
          <View style={{ width: "100%", alignItems: "flex-end" }}>
            <AppText style={style.text}>STILL GAIN!</AppText>
          </View>
        </View>
        <View style={style.buttonWrapper}>
          <Button
            styleButton={style.button}
            text="COMEÇAR"
            onPress={() => LoginNavigation()}
          />
          <Button
            styleButton={style.button}
            text="CRIAR CONTA"
            onPress={() => RegisterNavigation()}
          />
        </View>
      </View>
    </View>
  );
};

export default StartApp;
