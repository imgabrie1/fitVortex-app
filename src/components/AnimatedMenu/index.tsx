import React, { useEffect } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import AppText from "../AppText";

interface Props {
  visible: boolean;
  style?: ViewStyle;
  onEdit: () => void;
  onDelete: () => void;
  onAddExercise?: () => void;
  origin?: { x: number; y: number };
}

const AnimatedMenu: React.FC<Props> = ({
  visible,
  style,
  onEdit,
  onDelete,
  onAddExercise,
  origin,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      translateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      scale.value = withTiming(0.8, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
      translateY.value = withTiming(-35, { duration: 250 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    const originOffsetX = origin ? origin.x / 30 : 0;
    const originOffsetY = origin ? origin.y / 60 : 0;

    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value + originOffsetY },
        { translateX: translateX.value + originOffsetX },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[style, animatedStyle]}>
      {onAddExercise && (
        <TouchableOpacity
          onPress={onAddExercise}
          style={{ paddingVertical: 4 }}
        >
          <AppText style={{ color: "#fff" }}>Adicionar Exercício</AppText>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onEdit} style={{ paddingVertical: 4 }}>
        <AppText style={{ color: "#fff" }}>Editar</AppText>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={{ paddingVertical: 4 }}>
        <AppText style={{ color: "#fff" }}>Excluir</AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedMenu;
