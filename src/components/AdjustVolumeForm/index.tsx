import React, { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../Input";
import { Button } from "../Button";
import BackAndTitle from "../BackAndTitle";
import { schema } from "./schema";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";

interface AdjustVolumeProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AdjustVolumeForm = ({ onClose, onSubmit }: AdjustVolumeProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues: { createNewWorkout: false, modifications: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modifications",
  });

  const createNewWorkoutValue = watch("createNewWorkout");

  useEffect(() => {
    if (!createNewWorkoutValue) {
      setValue("modifications", []);
    }
  }, [createNewWorkoutValue, setValue]);

  const toggleCreateNewWorkout = () => {
    setValue("createNewWorkout", !createNewWorkoutValue);
  };

  return (
    <View style={styles.container}>
      <BackAndTitle onBack={onClose} title={"Ajustar Volume"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.toggleContainer}>
          <AppText style={styles.toggleLabel}>Criar com novos treinos?</AppText>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              createNewWorkoutValue && styles.toggleButtonActive,
            ]}
            onPress={toggleCreateNewWorkout}
          >
            <View
              style={[
                styles.toggleCircle,
                createNewWorkoutValue && styles.toggleCircleActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        <AppText style={styles.toggleDescription}>
          {createNewWorkoutValue
            ? "Novos treinos, Novos volumes"
            : "Mesmos treinos, Novos volumes"}
        </AppText>

        {createNewWorkoutValue && (
          <View style={styles.modificationsList}>
            {fields.map((item, index) => {
              const actionValue = watch(`modifications.${index}.action`);

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <AppText style={styles.cardTitle}>
                      Modificação #{index + 1}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => remove(index)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={24}
                        color="#FF6B6B"
                      />
                    </TouchableOpacity>
                  </View>

                  <Controller
                    control={control}
                    name={`modifications.${index}.workoutName`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        title="Nome do Treino"
                        placeholder="Ex: Treino A"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={
                          (errors.modifications as any)?.[index]?.workoutName
                            ?.message as string
                        }
                      />
                    )}
                  />

                  <View style={styles.actionContainer}>
                    <AppText style={styles.actionLabel}>Ação</AppText>
                    <Controller
                      control={control}
                      name={`modifications.${index}.action`}
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.actionButtons}>
                          {[
                            { label: "Substituir", val: "replace" },
                            { label: "Remover", val: "remove" },
                            { label: "Adicionar", val: "add" },
                          ].map((option) => (
                            <TouchableOpacity
                              key={option.val}
                              style={[
                                styles.actionButton,
                                value === option.val &&
                                  styles.actionButtonActive,
                              ]}
                              onPress={() => onChange(option.val)}
                            >
                              <AppText
                                style={[
                                  styles.actionButtonText,
                                  value === option.val &&
                                    styles.actionButtonTextActive,
                                ]}
                              >
                                {option.label}
                              </AppText>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    />
                    {(errors.modifications as any)?.[index]?.action
                      ?.message && (
                      <AppText
                        style={{ color: "red", fontSize: 12, marginTop: 4 }}
                      >
                        {
                          (errors.modifications as any)[index].action
                            .message as string
                        }
                      </AppText>
                    )}
                  </View>

                  {(actionValue === "replace" || actionValue === "remove") && (
                    <Controller
                      control={control}
                      name={`modifications.${index}.fromExercise`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          title="Exercício Atual (Remover)"
                          placeholder="Nome do exercício atual"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={
                            (errors.modifications as any)?.[index]?.fromExercise
                              ?.message as string
                          }
                        />
                      )}
                    />
                  )}

                  {(actionValue === "replace" || actionValue === "add") && (
                    <Controller
                      control={control}
                      name={`modifications.${index}.toExercise`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          title="Novo Exercício (Adicionar)"
                          placeholder="Nome do novo exercício"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={
                            (errors.modifications as any)?.[index]?.toExercise
                              ?.message as string
                          }
                        />
                      )}
                    />
                  )}
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addModificationButton}
              onPress={() =>
                append({
                  workoutName: "",
                  action: null,
                  fromExercise: "",
                  toExercise: "",
                })
              }
            >
              <MaterialIcons
                name="add"
                size={24}
                color={themas.Colors.secondary}
              />
              <AppText style={styles.addModificationText}>
                Adicionar Modificação
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <AppText style={styles.advancedToggleText}>Avançado</AppText>
          <MaterialIcons
            name={showAdvanced ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color={themas.Colors.gray}
          />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={{ marginBottom: 20 }}>
            <Controller
              control={control}
              name="maxSetsPerMicroCycle"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Max Séries por Músculo (Por micro ciclo)"
                  placeholder="máximo: 24"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={String(value || "")}
                  error={errors.maxSetsPerMicroCycle?.message as string}
                />
              )}
            />

            <View style={[styles.actionContainer, { marginTop: 16 }]}>
              <AppText style={styles.actionLabel}>
                Sobre pernas, qual a prioridade:
              </AppText>
              <Controller
                control={control}
                name="legPriority"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.actionButtons}>
                    {[
                      { label: "Quadríceps", val: "Quadríceps (Total)" },
                      { label: "Posterior", val: "Posterior de Coxa (Total)" },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.label}
                        style={[
                          styles.actionButton,
                          value === option.val && styles.actionButtonActive,
                        ]}
                        onPress={() => {
                          onChange(value === option.val ? null : option.val);
                        }}
                      >
                        <AppText
                          style={[
                            styles.actionButtonText,
                            value === option.val &&
                              styles.actionButtonTextActive,
                          ]}
                        >
                          {option.label}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>
        )}

        <Button text="Ajustar Volume" onPress={handleSubmit(onSubmit)} />
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default AdjustVolumeForm;
