import CustomHeader from "@/components/Header";
import Home from "@/pages/Home";
import User from "@/pages/User";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Dimensions } from "react-native";
import { Foundation, FontAwesome5 } from "@expo/vector-icons";
import { themas } from "@/global/themes";


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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "black",
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: "RussoOne",
    marginTop: 2,
    fontWeight: "100"
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 30,
    borderRadius: 16,
    backgroundColor: "transparent",
    marginBottom: 1,
  },

  iconContainerActive: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 30,
    borderRadius: 16,
    backgroundColor: themas.Colors.primary,
    marginBottom: 5,
  },
});

export default BottomRoutes;
