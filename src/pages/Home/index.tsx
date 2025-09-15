import AppText from '@/components/AppText';
import { UserContext } from '@/contexts/UserContext';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { style } from './styles';

const Home = () => {
  const { logout } = useContext(UserContext);

  const onLogout = async () => {
    await logout()
  }

  return (
    <View style={style.container}>
      <AppText>OLar Home!</AppText>
      <TouchableOpacity
      onPress={onLogout}
      >
        <AppText>Sair</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
