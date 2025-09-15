import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { AuthContext } from "@/contexts/AuthContext";
import { iDataRegister } from "@/contexts/interface";
import { View } from "react-native";
import AppText from "@/components/AppText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import TitleText from "@/components/TitleText";
import { navigate } from "@/navigation/RootNavigation";
import { styles } from "@/pages/Login/FormLogin/styles";

export const FormRegister = () => {
  const { registerUser, loadingForm } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(true);

  const [stage, setStage] = useState<1 | 2 | 3>(1);

  const loginNavigation = () => {
    navigate("Login");
  };

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<iDataRegister>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleNext = async (
    field: keyof iDataRegister,
    nextStage: 1 | 2 | 3
  ) => {
    const valid = await trigger(field);
    if (valid) setStage(nextStage);
  };

  const onSubmit = async (data: iDataRegister) => {
    await registerUser(data);
  };

  return (
    <View style={styles.container}>
      <TitleText style={styles.textEnter}>REGISTRAR</TitleText>
      <View style={styles.wrapper}>
        {stage === 1 && (
          <>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="NOME"
                  IconRigth={MaterialIcons}
                  iconRightName="person"
                  placeholder="Ernesto Serna"
                  placeholderTextColor="#00000052"
                  keyboardType="name-phone-pad"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <AppText style={styles.error}>{errors.name.message}</AppText>
            )}

            <View style={styles.buttonWrapper}>
              <Button
                text="PRÓXIMO"
                onPress={() => handleNext("name", 2)}
                loading={false}
              />
              <AppText style={styles.text}>
                Já tem uma conta?{" "}
                <AppText style={styles.link} onPress={() => loginNavigation()}>
                  Faça Login!
                </AppText>
              </AppText>
            </View>
          </>
        )}

        {stage === 2 && (
          <>
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

            <View style={styles.buttonWrapper}>
              <Button
                text="PRÓXIMO"
                onPress={() => handleNext("email", 3)}
                loading={false}
              />
              <AppText style={styles.text}>
                Já tem uma conta?{" "}
                <AppText style={styles.link} onPress={() => loginNavigation()}>
                  Faça Login!
                </AppText>
              </AppText>
            </View>
          </>
        )}

        {stage === 3 && (
          <>
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="CONFIRME SUA SENHA"
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
            {errors.confirmPassword && (
              <AppText style={styles.error}>
                {errors.confirmPassword.message}
              </AppText>
            )}

            <View style={styles.buttonWrapper}>
              <Button
                text="ENTRAR"
                onPress={handleSubmit(onSubmit)}
                loading={loadingForm}
              />
              <AppText style={styles.text}>
                Já tem uma conta?{" "}
                <AppText style={styles.link} onPress={() => loginNavigation()}>
                  Faça Login!
                </AppText>
              </AppText>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
export default FormRegister;
