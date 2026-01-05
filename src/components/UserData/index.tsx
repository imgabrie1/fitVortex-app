import { View } from "react-native";
import AppText from "../AppText";
import { style } from "./styles";
import { useContext } from "react";
import { UserContext } from "@/contexts/User/UserContext";

const UserData = () => {
  const { user, volumes } = useContext(UserContext);

  return (
    <View style={style.container}>
      <AppText style={[style.text, style.name]}>{user!.name}</AppText>
      <AppText style={style.text}>Total de Séries: {volumes}</AppText>
    </View>
  );
};

export default UserData;
