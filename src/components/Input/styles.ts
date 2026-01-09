import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
  boxInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: themas.Colors.lightGray,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    color: themas.Colors.lightGray,
    height: "100%",
    width: "100%",
    borderRadius: 40,
  },

  titleInput: {
    marginLeft: 5,
    color: themas.Colors.gray,
    marginTop: 20,
  },
  Button: {
    width: "10%",
  },
  Icon: {
    width: "100%",
  },
  errorText: {
    color: themas.Colors.red,
    fontSize: 12,
    marginLeft: 5,
    marginTop: 2,
  },
});
