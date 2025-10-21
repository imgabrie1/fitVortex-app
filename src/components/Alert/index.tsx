import { themas } from "@/global/themes";
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from "./styles";

export default function CustomAlert({ visible, onClose, onAddMore }: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Exercício Adicionado!</Text>
          <Text style={styles.message}>
            Quer adicionar mais exercícios nesse treino?
          </Text>

          <View style={styles.dividerHorizontal} />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onAddMore}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
            <View style={styles.dividerVertical} />
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

