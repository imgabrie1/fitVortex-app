import React from 'react';
import MacrosButton from '@/components/MacrosAndMicros';
import { View } from 'react-native';
import { styles } from './styles';

const Workout = () => {

  return (
    <View style={styles.container}>
      <MacrosButton/>
    </View>
  );
};

export default Workout;
