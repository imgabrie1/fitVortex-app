import AppText from '@/components/AppText';
import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Home = () => {
  const { logout } = useContext(AuthContext);

  const onLogout = async () => {
    await logout()
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
