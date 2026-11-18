import { useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import AppText from "../AppText";
import { themas } from "@/global/themes";
import { style } from "./styles";

interface Props {
  onRemove: () => void;
  onReplace: () => void;
  triggerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

type Position = { top: number; left: number };

const MENU_WIDTH = 200;

const ExerciseOptionsMenu: React.FC<Props> = ({
  onRemove,
  onReplace,
  triggerStyle,
  iconSize = 18,
  iconColor,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const screen = Dimensions.get("window");

      const menuHeight = 16 + 2 * 48 + 1;

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
                <Pressable style={style.option} onPress={handle(onReplace)}>
                  <MaterialIcons
                    name="swap-horiz"
                    size={20}
                    color={themas.Colors.secondary}
                  />
                  <AppText style={style.optionText}>Substituir</AppText>
                </Pressable>

                <View style={style.divider} />

                <Pressable style={style.option} onPress={handle(onRemove)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={themas.Colors.red}
                  />
                  <AppText style={style.optionTextDanger}>Remover</AppText>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ExerciseOptionsMenu;
