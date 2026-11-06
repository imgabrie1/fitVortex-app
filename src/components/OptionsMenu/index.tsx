import { useState } from "react";
import { Modal, Pressable, View, TouchableWithoutFeedback } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "../AppText";
import { themas } from "@/global/themes";
import { style } from "./styles";

type OptionsMenuProps = {
  onEdit: () => void;
  onLogout: () => void;
};

const OptionsMenu = ({ onEdit, onLogout }: OptionsMenuProps) => {
  const [visible, setVisible] = useState(false);

  const handleEdit = () => {
    setVisible(false);
    onEdit();
  };

  const handleLogout = () => {
    setVisible(false);
    onLogout();
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} hitSlop={10}>
        <Entypo name="dots-three-horizontal" size={20} color="white" />
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={style.overlay}>
            <TouchableWithoutFeedback>
              <View style={style.menu}>
                <Pressable style={style.option} onPress={handleEdit}>
                  <MaterialIcons name="edit" size={20} color={themas.Colors.led} />
                  <AppText style={style.optionText}>Editar</AppText>
                </Pressable>

                <View style={style.divider} />

                <Pressable style={style.option} onPress={handleLogout}>
                  <MaterialIcons name="logout" size={20} color={themas.Colors.led} />
                  <AppText style={style.optionText}>Sair</AppText>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionsMenu;