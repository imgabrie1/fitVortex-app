import React, { Fragment, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { iDataLogin } from "@/contexts/interface";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";

const FormLogin = () => {
  const { login, loadingForm } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<iDataLogin>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: iDataLogin) => {
    await login(data);
  };

  return (
    <Fragment>
      <View >
        <Text >Entrar</Text>
      </View>

      <View >
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {errors.email && <Text>{errors.email.message}</Text>}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <View>
            {errors.password && <Text>{errors.password.message}</Text>}
          </View>
        </View>
        <View >
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loadingForm}
          >
            {loadingForm ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text >ENTRAR</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text>
        Não tem conta? <Text >Crie agora</Text>
      </Text>
    </Fragment>
  );
};

export default FormLogin