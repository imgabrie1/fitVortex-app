import { themas } from "@/global/themes";
import React from "react";
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const SymbolWelcome = () => {
  return (
    <Svg width={190} height={190} viewBox="0 0 190 190" fill="none">
      <Rect
        width={190}
        height={190}
        rx={95}
        fill="url(#paint0_linear_53_37)"
        fillOpacity={0.75}
      />
      <Path
        d="M4 94.5C4 44.5182 44.5182 4 94.5 4C144.482 4 185 44.5182 185 94.5C185 144.482 144.482 185 94.5 185C44.5182 185 4 144.482 4 94.5Z"
        fill={themas.Colors.background}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_53_37"
          x1="162"
          y1="24"
          x2="32"
          y2="168.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.0851013" stopColor="#7931FF" stopOpacity={0.75} />
          <Stop offset="0.911162" stopColor="#350099" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default SymbolWelcome
