import { View } from "react-native";
import AppText from "../AppText";
import { style } from "./styles";
import { useContext } from "react";
import { UserContext } from "@/contexts/User/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "@/global/themes";

const UserData = () => {
  const { user, volumes, logout } = useContext(UserContext);

  return (
    <View style={style.container}>
      <AppText style={[style.text, style.name]}>{user!.name}</AppText>
      <AppText style={style.text}>Total de Séries: {volumes}</AppText>
      <MaterialIcons
      onPress={logout}
        name="logout"
        size={24}
        color={themas.Colors.led}
      />
    </View>
  );
};

export default UserData;
