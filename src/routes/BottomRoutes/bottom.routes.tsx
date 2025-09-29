import CustomHeader from "@/components/Header";
import Home from "@/pages/Home";
import User from "@/pages/User";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Foundation, FontAwesome5 } from "@expo/vector-icons";
import { themas } from "@/global/themes";
import { styles } from "./styles.routes";
import Treinar from "@/pages/Workout";

const Tab = createBottomTabNavigator();

const BottomRoutes = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: themas.Colors.icons,
        tabBarInactiveTintColor: themas.Colors.noSelectColor,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => <CustomHeader />,
          tabBarLabel: "Início",
          tabBarIcon: ({ focused }) => (
            <View
              style={
                focused ? styles.iconContainerActive : styles.iconContainer
              }
            >
              <Foundation
                name="home"
                size={20}
                color={
                  focused ? themas.Colors.icons : themas.Colors.noSelectColor
                }
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Treinar}
        options={{
          header: () => <CustomHeader />,
          tabBarLabel: "Treinar",
          tabBarIcon: ({ focused }) => (
            <View
              style={
                focused ? styles.iconContainerActive : styles.iconContainer
              }
            >
              <FontAwesome5
                name="plus"
                size={20}
                color={
                  focused ? themas.Colors.icons : themas.Colors.noSelectColor
                }
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={User}
        options={{
          header: () => <CustomHeader />,
          tabBarLabel: "Você",
          tabBarIcon: ({ focused }) => (
            <View
              style={
                focused ? styles.iconContainerActive : styles.iconContainer
              }
            >
              <FontAwesome5
                name="user-alt"
                size={18}
                color={
                  focused ? themas.Colors.icons : themas.Colors.noSelectColor
                }
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomRoutes;
