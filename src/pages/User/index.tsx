import AppText from '@/components/AppText';
import UserData from '@/components/UserData';
import WorkoutDay from '@/components/WorkoutDay';
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

const User = () => {

  return (
    <View style={styles.container}>
      <UserData/>
      <WorkoutDay/>
    </View>
  );
};

export default User;
