import { useState, useContext } from "react";
import { View } from "react-native";
import AppText from "../AppText";
import { style } from "./styles";
import { UserContext } from "@/contexts/User/UserContext";
import OptionsMenu from "../OptionsMenu";
import EditUserModal from "../EditUserModal";

const UserData = () => {
  const { user, volumes, logout } = useContext(UserContext);
  const [editVisible, setEditVisible] = useState(false);

  return (
    <View style={style.container}>
      <View>
        <AppText style={[style.text, style.name]}>{user!.name}</AppText>
        <AppText style={style.text}>Total de Séries: {volumes}</AppText>
      </View>

      <OptionsMenu onEdit={() => setEditVisible(true)} onLogout={logout} />

      <EditUserModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
      />
    </View>
  );
};

export default UserData;
