import React from "react";
import { View, Modal, Pressable } from "react-native";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppText from "../AppText";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { schema } from "./schema";
import { styles } from "./styles";
import { Exercise } from "@/contexts/User/interface";

interface AddExercisesProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  // selectedExercise?: Exercise | null;
  selectedExercise?: any;
}

const AddExerciseForm = ({
  onClose,
  onSubmit,
  selectedExercise,
}: AddExercisesProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: { targetSets: undefined },
  });

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.nameAndBackWrap}>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            delayLongPress={0}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <AppText style={styles.name}>
            Adicionar {selectedExercise?.name ?? "Exercício"}
          </AppText>
          <View style={{ width: 24 }} />
        </View>

        <Controller
          control={control}
          name={"targetSets"}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              title="Séries"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.root?.message}
            />
          )}
        />

        <Button
          text="Adicionar ao Treino"
          onPress={handleSubmit((formData) => {
            const payload = {
              exercises: [
                {
                  exerciseId: selectedExercise?.id,
                  targetSets: Number(formData.targetSets),
                },
              ],
            };
            onSubmit(payload);
          })}
          styleButton={styles.styledButton}
        />
      </View>
    </View>
  );
};

export default AddExerciseForm;
