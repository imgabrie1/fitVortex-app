import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import MacrosAndMicros from '@/components/MacrosAndMicros';

const Workout = () => {

  return (
    <View style={styles.container}>
      <MacrosAndMicros/>
    </View>
  );
};

export default Workout;
