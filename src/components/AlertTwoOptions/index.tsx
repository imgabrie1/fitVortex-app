import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

export default function CustomAlertTwoOptions({
  visible,
  onClose,
  onPress,
  title,
  message,
  buttonTextOne,
  buttonTextTwo,
}: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.dividerHorizontal} />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{buttonTextOne}</Text>
            </TouchableOpacity>
            <View style={styles.dividerVertical} />
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{buttonTextTwo}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
