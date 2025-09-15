import React, { useContext, useState } from "react";
import { View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { iDataLogin } from "@/contexts/interface";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { styles } from "./styles";
import AppText from "@/components/AppText";
import { Input } from "@/components/Input";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import TitleText from "@/components/TitleText";
import { Button } from "@/components/Button";
import { navigate } from "@/navigation/RootNavigation";

const FormLogin = () => {
  const { login, loadingForm } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<iDataLogin>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: iDataLogin) => {
    // console.log(data)
    await login(data);
  };

  const RegisterNavigation = () => {
    navigate("Register");
  };

  return (
    <View style={styles.container}>
      <TitleText style={styles.textEnter}>ENTRAR</TitleText>

      <View style={styles.wrapper}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="EMAIL"
              IconRigth={MaterialIcons}
              iconRightName="mail"
              placeholder="example@email.com"
              placeholderTextColor="#00000052"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <AppText style={styles.error}>{errors.email.message}</AppText>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="SENHA"
              IconRigth={Octicons}
              iconRightName={showPassword ? "eye-closed" : "eye"}
              onIconRigthPress={() => setShowPassword(!showPassword)}
              placeholder="**********"
              placeholderTextColor="#00000052"
              secureTextEntry={showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={false}
            />
          )}
        />
        {errors.password && (
          <AppText style={styles.error}>{errors.password.message}</AppText>
        )}
        <View style={styles.buttonWrapper}>
          <Button
            text="ENTRAR"
            onPress={handleSubmit(onSubmit)}
            loading={loadingForm}
          />

          <AppText style={styles.text}>
            Não tem conta? <AppText
            style={styles.link}
            onPress={()=> RegisterNavigation()}
            >Crie agora!</AppText>
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default FormLogin;
