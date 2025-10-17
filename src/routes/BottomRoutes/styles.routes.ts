import { themas } from "@/global/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    fontFamily: "GeologicaBold",
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