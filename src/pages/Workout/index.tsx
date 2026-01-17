import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import MacrosAndMicros from '@/components/MacrosAndMicros';
import { useRoute } from '@react-navigation/native';

const Workout = () => {
  const route = useRoute();
  const params = route.params as any;

  return (
    <View style={styles.container}>
      <MacrosAndMicros initialParams={params} />
    </View>
  );
};

export default Workout;
