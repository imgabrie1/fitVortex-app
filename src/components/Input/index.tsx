import React, { forwardRef, Ref } from "react";
import {
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from "react-native";
import { MaterialIcons, FontAwesome, Octicons } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";
import { themas } from "../../global/themes";
import { style } from "./styles";
import TitleText from "../TitleText";
import AppText from "../AppText";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
  IconLeft?: IconComponent;
  IconRigth?: IconComponent;
  iconLeftName?: string;
  iconRightName?: string;
  title?: string;
  onIconLeftPress?: () => void;
  onIconRigthPress?: () => void;
  height?: number;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  mask?: string;
};

export const Input = forwardRef((props: Props, ref: Ref<TextInput> | null) => {
  const {
    IconLeft,
    IconRigth,
    iconLeftName,
    iconRightName,
    title,
    onIconLeftPress,
    onIconRigthPress,
    height,
    labelStyle,
    error,
    mask,
    ...rest
  } = props;

  const calculateSizeWidth = () => {
    if (IconLeft && IconRigth) return "80%";
    if (IconLeft || IconRigth) return "90%";
    return "100%";
  };

  const calculateSizePaddingLeft = () => {
    if (IconLeft && IconRigth) return 0;
    if (IconLeft || IconRigth) return 5;
    return 10;
  };

  return (
    <>
      {title && (
        <TitleText style={[style.titleInput, labelStyle]}>{title}</TitleText>
      )}
      <View
        style={[
          style.boxInput,
          {
            paddingLeft: calculateSizePaddingLeft(),
            height: height ?? 40,
            borderColor: error ? themas.Colors.red : themas.Colors.lightGray,
          },
        ]}
      >
        {IconLeft && iconLeftName && (
          <TouchableOpacity onPress={onIconLeftPress} style={style.Button}>
            <IconLeft
              name={iconLeftName as any}
              size={20}
              color={themas.Colors.gray}
              style={style.Icon}
            />
          </TouchableOpacity>
        )}

        {mask ? (
          <MaskedTextInput
            mask={mask}
            ref={ref as any}
            style={[
              style.input,
              { width: calculateSizeWidth(), height: "100%" },
            ]}
            {...rest}
            onChangeText={(text, rawText) => {
              if (rest.onChangeText) {
                (rest.onChangeText as (text: string) => void)(text);
              }
            }}
          />
        ) : (
          <TextInput
            ref={ref}
            style={[
              style.input,
              { width: calculateSizeWidth(), height: "100%" },
            ]}
            {...rest}
          />
        )}

        {IconRigth && iconRightName && (
          <TouchableOpacity onPress={onIconRigthPress} style={style.Button}>
            <IconRigth
              name={iconRightName as any}
              size={20}
              color={themas.Colors.gray}
              style={style.Icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <AppText style={style.errorText}>{error}</AppText>}
    </>
  );
});
