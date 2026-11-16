import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AppText from "../AppText";
import { themas } from "@/global/themes";
import { style } from "./styles";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  onAddExercise?: () => void;
  triggerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

type Position = { top: number; left: number };

const MENU_WIDTH = 200;

const ItemOptionsMenu: React.FC<Props> = ({
  onEdit,
  onDelete,
  onAddExercise,
  triggerStyle,
  iconSize = 20,
  iconColor,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const screen = Dimensions.get("window");

      const optionCount = onAddExercise ? 3 : 2;
      const menuHeight = 16 + optionCount * 48 + (optionCount - 1) * 1;

      let left = x + width - MENU_WIDTH;
      let top = y + height + 4;

      if (left < 8) left = Math.max(8, x);

      if (top + menuHeight > screen.height - 8) {
        top = y - menuHeight - 4;
      }

      setPosition({ top, left });
      setVisible(true);
    });
  };

  const handle = (fn: () => void) => () => {
    setVisible(false);
    fn();
  };

  return (
    <>
      <Pressable
        ref={triggerRef as any}
        onPress={openMenu}
        hitSlop={10}
        style={triggerStyle}
      >
        <Entypo
          name="dots-three-horizontal"
          size={iconSize}
          color={iconColor ?? "white"}
        />
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
              <View
                style={[
                  style.menu,
                  {
                    position: "absolute",
                    top: position.top,
                    left: position.left,
                    width: MENU_WIDTH,
                  },
                ]}
              >
                {onAddExercise && (
                  <>
                    <Pressable
                      style={style.option}
                      onPress={handle(onAddExercise)}
                    >
                      <MaterialIcons
                        name="add"
                        size={20}
                        color={themas.Colors.led}
                      />
                      <AppText style={style.optionText}>
                        Adicionar Exercício
                      </AppText>
                    </Pressable>
                    <View style={style.divider} />
                  </>
                )}

                <Pressable style={style.option} onPress={handle(onEdit)}>
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color={themas.Colors.led}
                  />
                  <AppText style={style.optionText}>Editar</AppText>
                </Pressable>

                <View style={style.divider} />

                <Pressable style={style.option} onPress={handle(onDelete)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={themas.Colors.led}
                  />
                  <AppText style={style.optionText}>Excluir</AppText>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ItemOptionsMenu;
