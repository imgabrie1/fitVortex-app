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
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { styles } from "./styles";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";
import ExerciseSelector from "../ExerciseSelector";
import { Exercise } from "@/contexts/User/interface";

interface AdjustVolumeProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableWorkoutNames?: string[];
  availableWorkouts?: Record<string, Exercise[]>;
}

const AdjustVolumeForm = ({
  onClose,
  onSubmit,
  availableWorkoutNames = [],
  availableWorkouts = {},
}: AdjustVolumeProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectingExerciseFor, setSelectingExerciseFor] = useState<{
    index: number;
    field: "fromExercise" | "toExercise";
  } | null>(null);
  const [selectingWorkoutNameIndex, setSelectingWorkoutNameIndex] = useState<
    number | null
  >(null);
  const [staticExercisesForSelector, setStaticExercisesForSelector] = useState<
    Exercise[] | undefined
  >(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
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

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectingExerciseFor) {
      setValue(
        `modifications.${selectingExerciseFor.index}.${selectingExerciseFor.field}`,
        exercise.name,
      );
      setSelectingExerciseFor(null);
      setStaticExercisesForSelector(undefined);
    }
  };

  const handleSelectWorkoutName = (name: string) => {
    if (selectingWorkoutNameIndex !== null) {
      setValue(`modifications.${selectingWorkoutNameIndex}.workoutName`, name);
      setValue(`modifications.${selectingWorkoutNameIndex}.fromExercise`, ""); // Limpa o exercício anterior se mudar o treino
      setSelectingWorkoutNameIndex(null);
    }
  };

  const handleOpenExerciseSelector = (
    index: number,
    field: "fromExercise" | "toExercise",
  ) => {
    const workoutName = getValues(`modifications.${index}.workoutName`);

    if (
      availableWorkoutNames &&
      availableWorkoutNames.length > 0 &&
      !workoutName
    ) {
      Alert.alert("Atenção", "Selecione um treino primeiro.");
      return;
    }

    if (field === "fromExercise") {
      if (workoutName && availableWorkouts[workoutName]) {
        setStaticExercisesForSelector(availableWorkouts[workoutName]);
      } else {
        if (
          availableWorkoutNames &&
          availableWorkoutNames.length > 0 &&
          !availableWorkouts[workoutName]
        ) {
          setStaticExercisesForSelector(undefined);
        }
      }
    } else {
      setStaticExercisesForSelector(undefined);
    }

    setSelectingExerciseFor({ index, field });
  };

  return (
    <View style={styles.container}>
      <BackAndTitle onBack={onClose} title={"Ajustar Volume"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.toggleContainer}>
          <AppText style={styles.toggleLabel}>
            Criar com novos exercícios?
          </AppText>
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
                        color={themas.Colors.red}
                      />
                    </TouchableOpacity>
                  </View>

                  <Controller
                    control={control}
                    name={`modifications.${index}.workoutName`}
                    render={({ field: { onBlur, value } }) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            availableWorkoutNames &&
                            availableWorkoutNames.length > 0
                          ) {
                            setSelectingWorkoutNameIndex(index);
                          }
                        }}
                      >
                        <View pointerEvents="none">
                          <Input
                            title="Nome do Treino"
                            placeholder={
                              availableWorkoutNames?.length
                                ? "Selecione o treino"
                                : "Ex: Treino A"
                            }
                            onBlur={onBlur}
                            value={value}
                            editable={
                              !availableWorkoutNames ||
                              availableWorkoutNames.length === 0
                            }
                            error={
                              (errors.modifications as any)?.[index]
                                ?.workoutName?.message as string
                            }
                          />
                        </View>
                      </TouchableOpacity>
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
                      render={({ field: { onBlur, value } }) => (
                        <TouchableOpacity
                          onPress={() =>
                            handleOpenExerciseSelector(index, "fromExercise")
                          }
                        >
                          <View pointerEvents="none">
                            <Input
                              title="Exercício Atual (Remover)"
                              placeholder="Toque para selecionar"
                              onBlur={onBlur}
                              value={value}
                              editable={false}
                              error={
                                (errors.modifications as any)?.[index]
                                  ?.fromExercise?.message as string
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  {(actionValue === "replace" || actionValue === "add") && (
                    <Controller
                      control={control}
                      name={`modifications.${index}.toExercise`}
                      render={({ field: { onBlur, value } }) => (
                        <TouchableOpacity
                          onPress={() =>
                            handleOpenExerciseSelector(index, "toExercise")
                          }
                        >
                          <View pointerEvents="none">
                            <Input
                              title="Novo Exercício (Adicionar)"
                              placeholder="Toque para selecionar"
                              onBlur={onBlur}
                              value={value}
                              editable={false}
                              error={
                                (errors.modifications as any)?.[index]
                                  ?.toExercise?.message as string
                              }
                            />
                          </View>
                        </TouchableOpacity>
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

      <Modal
        visible={!!selectingExerciseFor}
        animationType="slide"
        onRequestClose={() => {
          setSelectingExerciseFor(null);
          setStaticExercisesForSelector(undefined);
        }}
      >
        <ExerciseSelector
          onSelect={handleSelectExercise}
          onBack={() => {
            setSelectingExerciseFor(null);
            setStaticExercisesForSelector(undefined);
          }}
          title={
            selectingExerciseFor?.field === "fromExercise"
              ? "REMOVER EXERCÍCIO"
              : "ADICIONAR EXERCÍCIO"
          }
          staticData={staticExercisesForSelector}
        />
      </Modal>

      {/* modal para seleção de treino */}
      <Modal
        visible={selectingWorkoutNameIndex !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectingWorkoutNameIndex(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: themas.Colors.background,
              borderRadius: 12,
              padding: 16,
              maxHeight: "60%",
            }}
          >
            <AppText
              style={{
                fontSize: 18,
                marginBottom: 12,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Selecione o Treino
            </AppText>
            <FlatList
              data={availableWorkoutNames}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: themas.Colors.gray,
                  }}
                  onPress={() => handleSelectWorkoutName(item)}
                >
                  <AppText style={{ fontSize: 16 }}>{item}</AppText>
                </TouchableOpacity>
              )}
            />
            <Button
              text="Cancelar"
              onPress={() => setSelectingWorkoutNameIndex(null)}
              styleButton={{
                marginTop: 12,
                backgroundColor: themas.Colors.red,
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdjustVolumeForm;
