import React, { createContext, useRef } from "react";
import { Animated } from "react-native";
import { AnimationContextData } from "./interface";

export const AnimationContext = createContext<AnimationContextData>(
  {} as AnimationContextData
);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <AnimationContext.Provider value={{ scrollY }}>
      {children}
    </AnimationContext.Provider>
  );
};
