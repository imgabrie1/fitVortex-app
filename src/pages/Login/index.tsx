import React from "react";
import { View } from "react-native";
import { style } from "./styles";
import FormLogin from "@/pages/Login/FormLogin";

const Login = () => {

  return (
    <View style={style.container}>
      <FormLogin />
    </View>
  );
};

export default Login;
