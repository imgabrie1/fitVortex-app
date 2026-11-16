import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import MesosAndMicros from '@/components/MesosAndMicros';
import { useRoute } from '@react-navigation/native';

const Workout = () => {
  const route = useRoute();
  const params = route.params as any;

  return (
    <View style={styles.container}>
      <MesosAndMicros initialParams={params} />
    </View>
  );
};

export default Workout;
