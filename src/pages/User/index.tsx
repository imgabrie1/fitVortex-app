import UserData from '@/components/UserData';
import WorkoutDay from '@/components/WorkoutDay';
import { AnimationContext } from '@/contexts/Animation/AnimationContext';
import React, { useContext } from 'react';
import { Animated, Dimensions } from 'react-native';
import { styles } from './styles';

const { height } = Dimensions.get("window");

const User = () => {
  const { scrollY } = useContext(AnimationContext);

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: height * 0.05 }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      <UserData />
      <WorkoutDay hasScrollView={false} />
    </Animated.ScrollView>
  );
};

export default User;
