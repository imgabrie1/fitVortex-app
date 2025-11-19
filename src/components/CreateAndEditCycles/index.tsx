import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { macroSchema, microSchema } from "./schema";
import { styles } from "./styles";
import { Input } from "../Input";
import { Button } from "../Button";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";
import BackAndTitle from "../BackAndTitle";
import { UserContext } from "@/contexts/User/UserContext";

interface CreateCyclesProps {
  type: "macro" | "micro";
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const CreateAndEditCycles = ({
  type,
  onClose,
  onSubmit,
  initialData,
}: CreateCyclesProps) => {
  const isMacro = type === "macro";
  const schema = isMacro ? macroSchema : microSchema;
  const isEditing = !!initialData;

  const { loadingForm } = useContext(UserContext);

  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const defaultValues = isMacro
    ? {
        macroCycleName: initialData?.macroCycleName || "",
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        microQuantity: initialData?.microQuantity || undefined,
      }
    : {
        microCycleName: initialData?.microCycleName || "",
        trainingDays: initialData?.trainingDays || undefined,
      };

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema as yup.AnyObjectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      const formattedData = { ...initialData };
      if (isMacro) {
        if (formattedData.startDate && typeof formattedData.startDate === 'string') {
          const parts = formattedData.startDate.split('T')[0].split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            formattedData.startDate = `${day}-${month}-${year}`;
          }
        }
        if (formattedData.endDate && typeof formattedData.endDate === 'string') {
          const parts = formattedData.endDate.split('T')[0].split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            formattedData.endDate = `${day}-${month}-${year}`;
          }
        }
      }
      Object.entries(formattedData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [initialData, setValue, isMacro]);

  const nextStage = async () => {
    if (!isMacro) return;

    let valid = false;

    if (stage === 1) valid = await trigger("macroCycleName");
    else if (stage === 2) valid = await trigger(["startDate", "endDate"]);
    else if (stage === 3) valid = await trigger("microQuantity");

    if (valid && stage < 3) setStage((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const prevStage = () => {
    if (stage > 1) setStage((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
    fieldName?: "startDate" | "endDate"
  ) => {
    if (event.type === "dismissed" || !selectedDate || !fieldName) return;

    const formatted = formatDate(selectedDate);
    setValue(fieldName, formatted);
    if (fieldName === "startDate") setShowStartPicker(false);
    if (fieldName === "endDate") setShowEndPicker(false);
  };

  const handleFormSubmit = (data: FieldValues) => {
    const formattedData = { ...data };
    if (isMacro) {
      if (formattedData.startDate) {
        const [day, month, year] = formattedData.startDate.split("-");
        formattedData.startDate = `${year}-${month}-${day}`;
      }
      if (formattedData.endDate) {
        const [day, month, year] = formattedData.endDate.split("-");
        formattedData.endDate = `${year}-${month}-${day}`;
      }
    }
    onSubmit(formattedData);
  };

  return (
    <View style={styles.modalContainer}>
      <BackAndTitle
        onBack={onClose}
        title={`${isEditing ? "EDITAR" : "CRIAR"} ${
          isMacro ? "MACRO" : "MICRO"
        } CICLO`}
      />

      {isMacro ? (
        <>
          {stage === 1 && (
            <Controller
              control={control}
              name="macroCycleName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Nome do Ciclo"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.macroCycleName?.message as string}
                />
              )}
            />
          )}

          {stage === 2 && (
            <>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      title="Data de Início"
                      mask="99-99-9999"
                      IconRigth={MaterialIcons}
                      iconRightName="calendar-today"
                      onIconRigthPress={() => setShowStartPicker(true)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.startDate?.message as string}
                      keyboardType="numeric"
                    />
                    {showStartPicker && (
                      <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={"default"}
                        onChange={(e, d) => handleDateChange(e, d, "startDate")}
                      />
                    )}
                  </>
                )}
              />
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      title="Data de Término"
                      mask="99-99-9999"
                      IconRigth={MaterialIcons}
                      iconRightName="calendar-today"
                      onIconRigthPress={() => setShowEndPicker(true)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.endDate?.message as string}
                      keyboardType="numeric"
                    />
                    {showEndPicker && (
                      <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display={"default"}
                        onChange={(e, d) => handleDateChange(e, d, "endDate")}
                      />
                    )}
                  </>
                )}
              />
            </>
          )}

          {stage === 3 && (
            <Controller
              control={control}
              name="microQuantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  title="Quantidade de Micros"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? String(value) : ""}
                  error={errors.microQuantity?.message as string}
                  keyboardType="numeric"
                />
              )}
            />
          )}

          <View style={styles.buttonsWrapper}>
            {stage > 1 && (
              <Button
                text="Voltar"
                onPress={prevStage}
                styleButton={styles.styledButtonRed}
                textColor={themas.Colors.primary}
              />
            )}

            {stage < 3 && (
              <Button
                text="Próximo"
                onPress={nextStage}
                styleButton={
                  stage === 1 ? styles.styledButtonAlone : styles.styledButton
                }
              />
            )}

            {stage === 3 && (
              <Button
                text={isEditing ? "Salvar Alterações" : "Criar Macro"}
                onPress={handleSubmit(handleFormSubmit)}
                styleButton={styles.styledButton}
                loading={loadingForm}
              />
            )}
          </View>
        </>
      ) : (
        <>
          <Controller
            control={control}
            name="microCycleName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                title="Nome do Ciclo"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.microCycleName?.message as string}
              />
            )}
          />
          <Controller
            control={control}
            name="trainingDays"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                title="Dias com treino no Micro"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ""}
                error={errors.trainingDays?.message as string}
                keyboardType="numeric"
              />
            )}
          />
          <Button
            text={isEditing ? "Salvar Alterações" : "Criar Micro"}
            onPress={handleSubmit(onSubmit)}
            styleButton={styles.styledButton}
            loading={loadingForm}
          />
        </>
      )}
    </View>
  );
};

export default CreateAndEditCycles;
