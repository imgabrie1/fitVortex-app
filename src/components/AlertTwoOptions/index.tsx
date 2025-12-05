import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Button } from "../Button";
import { UserContext } from "@/contexts/User/UserContext";

export default function CustomAlertTwoOptions({
  visible,
  onClose,
  onPress,
  title,
  message,
  buttonTextOne,
  buttonTextTwo,
}: any) {
  const { loadingForm } = useContext(UserContext);
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.dividerHorizontal} />

          <View style={styles.buttons}>
            <Button
              text={buttonTextOne}
              onPress={onPress}
              styleButton={styles.button}
              textColor={styles.buttonText.color}
              fontSize={styles.buttonText.fontSize}
              loading={loadingForm}
            />
            <View style={styles.dividerVertical} />
            <Button
              text={buttonTextTwo}
              onPress={onClose}
              styleButton={styles.button}
              textColor={styles.buttonText.color}
              fontSize={styles.buttonText.fontSize}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
