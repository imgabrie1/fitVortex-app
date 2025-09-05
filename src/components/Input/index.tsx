import { themas } from "@/global/themes";
import React, { forwardRef, Fragment, Ref } from "react";
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons, Octicons } from "@expo/vector-icons";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
  title?: string;
  placeholder?: string;
  IconLeft?: IconComponent;
  IconRight?: IconComponent;
  IconLeftName?: string;
  IconRightName?: string;
  onIconLeftPress?: () => void;
  onIconRightPress?: () => void;
};

export const Input = forwardRef((Props: Props, ref: Ref<TextInput> | null) => {
  const {
    title,
    placeholder,
    IconLeft,
    IconRight,
    IconLeftName,
    IconRightName,
    onIconLeftPress,
    onIconRightPress,
    ...rest
  } = Props;

  const calculateSizeWidth = () => {
    if (IconLeft && IconRight) {
      return "80%";
    } else if (IconLeft || IconRight) {
      return "90%";
    } else {
      return "100%";
    }
  };

  const calculateSizePaddingLeft = () => {
    if (IconLeft && IconRight) {
      return 10;
    } else if (IconLeft || IconRight) {
      return 10;
    } else {
      return 20;
    }
  };

  return (
    <Fragment>
      {title&&<Text style={style.titleInput}>{title}</Text>}
      <View style={style.boxInput}>
        {IconLeft && IconLeftName && (
          <TouchableOpacity onPress={onIconLeftPress}>
            <IconLeft
              name={IconLeftName as any}
              size={20}
              color={themas.Colors.gray}
              style={style.icon}
            />
          </TouchableOpacity>
        )}
        <TextInput
          style={[style.input, { width: calculateSizeWidth() }]}
          placeholder={placeholder}
          {...rest}
        />
        {IconRight && IconRightName && (
          <TouchableOpacity onPress={onIconRightPress}>
            <IconRight
              name={IconRightName as any}
              size={20}
              color={themas.Colors.gray}
              style={style.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </Fragment>
  );
});
