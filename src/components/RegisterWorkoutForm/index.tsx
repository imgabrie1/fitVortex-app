import React from "react";
import { View, ScrollView, Image, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { Button } from "@/components/Button";
import AppText from "@/components/AppText";
import { Workout } from "@/contexts/User/interface";
import { styles } from "./styles";
import { themas } from "@/global/themes";

interface RegisterWorkoutFormProps {
  workout: Workout;
  control: any;
  errors: any;
  fields: any[];
  handleSubmit: any;
  onSubmit: any;
  loadingForm: boolean;
}

export const RegisterWorkoutForm = ({
  workout,
  control,
  errors,
  fields,
  handleSubmit,
  onSubmit,
  loadingForm,
}: RegisterWorkoutFormProps) => {
  const getExerciseName = (exerciseId: string) => {
    const exerciseName = workout.workoutExercises?.find(
      (we) => we.exercise?.id === exerciseId
    )?.exercise?.name;
    return exerciseName || `Exercício`;
  };

  const getExerciseImg = (exerciseId: string) => {
    const exerciseImg = workout.workoutExercises?.find(
      (we) => we.exercise?.id === exerciseId
    )?.exercise?.imageURL;
    return exerciseImg || `Erro ao carregar imagem`;
  };

  const getTargetSets = (exerciseId: string) => {
    const targetSets = workout.workoutExercises?.find(
      (we) => we.exercise?.id === exerciseId
    )?.targetSets;
    return targetSets || 0;
  };

  const getUnilateral = (exerciseId: string) => {
    const workoutExercise = workout.workoutExercises?.find(
      (we) => we.exercise?.id === exerciseId
    );
    return workoutExercise?.exercise?.default_unilateral || false;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <>
          {fields.map((item, index) => {
            const isUnilateral = getUnilateral(item.exerciseId);
            const targetSets = getTargetSets(item.exerciseId);
            const numberOfSets =
              typeof targetSets === "number"
                ? targetSets
                : parseInt(targetSets, 10) || 0;

            const actualNumberOfSets = isUnilateral
              ? numberOfSets * 2
              : numberOfSets;

            return (
              <View key={item.id} style={styles.ulContainer}>
                <View style={styles.infoHeaderExerciseNotes}>
                  <View style={styles.infoHeaderExercise}>
                    <Image
                      source={{ uri: getExerciseImg(item.exerciseId) }}
                      style={styles.img}
                      resizeMode="cover"
                    />
                    <AppText style={styles.exerciseName}>
                      {getExerciseName(item.exerciseId)}
                      {isUnilateral && " (Unilateral)"}
                    </AppText>
                  </View>

                  <AppText style={styles.targetSets}>
                    Séries Alvo: {numberOfSets}
                    {isUnilateral && ` (${actualNumberOfSets} lados)`}
                  </AppText>

                  <Controller
                    control={control}
                    name={`exercises.${index}.notes`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Notas..."
                        placeholderTextColor={themas.Colors.lightGray}
                        cursorColor={themas.Colors.neon}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="default"
                        style={styles.notes}
                      />
                    )}
                  />
                </View>

                <View style={styles.headerSets}>
                  <AppText style={styles.setRepsWeight}>Séries</AppText>
                  <AppText style={styles.setRepsWeight}>Kg</AppText>
                  <AppText style={styles.setRepsWeight}>Reps</AppText>
                </View>

                {Array.from({ length: actualNumberOfSets }).map(
                  (_, setIndex) => {
                    const isUnilateralSet = isUnilateral;
                    const isRightSide = isUnilateralSet && setIndex % 2 === 0;
                    const isLeftSide = isUnilateralSet && setIndex % 2 === 1;

                    const realSetIndex = isUnilateralSet
                      ? Math.floor(setIndex / 2)
                      : setIndex;

                    return (
                      <View key={setIndex}>
                        <View
                          style={[
                            styles.setRow,
                            {
                              backgroundColor:
                                setIndex % 2 === 0
                                  ? themas.Colors.background
                                  : themas.Colors.alternativeBlocks,
                            },
                          ]}
                        >
                          {isUnilateralSet ? (
                            <View>
                              <AppText
                                style={[
                                  styles.setLabel,
                                  isRightSide
                                    ? styles.setUniRight
                                    : styles.setUniLeft,
                                ]}
                              >
                                {isRightSide ? "D" : "E"}
                              </AppText>
                            </View>
                          ) : (
                            <View>
                              <AppText style={styles.setLabel}>
                                {setIndex + 1}
                              </AppText>
                            </View>
                          )}

                          <Controller
                            control={control}
                            name={`exercises.${index}.sets.${setIndex}.weight`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextInput
                                placeholder="--"
                                placeholderTextColor={themas.Colors.gray}
                                cursorColor={themas.Colors.neon}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="numeric"
                                style={styles.inputRepsWeight}
                                selectTextOnFocus={true}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`exercises.${index}.sets.${setIndex}.reps`}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <TextInput
                                placeholder="--"
                                placeholderTextColor={themas.Colors.gray}
                                cursorColor={themas.Colors.neon}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="numeric"
                                style={styles.inputRepsWeight}
                                selectTextOnFocus={true}
                              />
                            )}
                          />
                        </View>
                        {errors.exercises?.[index]?.sets?.[setIndex]?.reps && (
                          <AppText style={{}}>
                            {
                              errors.exercises[index].sets[setIndex].reps
                                .message
                            }
                          </AppText>
                        )}
                        {errors.exercises?.[index]?.sets?.[setIndex]
                          ?.weight && (
                          <AppText style={{}}>
                            {
                              errors.exercises[index].sets[setIndex].weight
                                .message
                            }
                          </AppText>
                        )}
                      </View>
                    );
                  }
                )}
              </View>
            );
          })}
        </>
        <Button
          text="Salvar Treino"
          onPress={handleSubmit(onSubmit)}
          loading={loadingForm}
        />
      </ScrollView>
    </View>
  );
};
