import React from "react";
import { View, Modal, Pressable } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppText from "../AppText";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";
import { schema } from "./schema";
import { styles } from "./styles";
import * as yup from "yup";
import BackAndTitle from "../BackAndTitle";

interface CreateWorkoutProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateWorkoutForm = ({ onClose, onSubmit }: CreateWorkoutProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: { name: "", exercises: [] },
  });

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <BackAndTitle onBack={onClose} title={"CRIAR TREINO"} />

        <Controller
          control={control}
          name={"name"}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="Nome do Treino"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.root?.message}
            />
          )}
        />

        <Button
          text="Criar Treino"
          onPress={handleSubmit(onSubmit)}
          styleButton={styles.styledButton}
        />
      </View>
    </View>
  );
};

export default CreateWorkoutForm;
