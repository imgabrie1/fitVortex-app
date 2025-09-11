import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
  boxInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: themas.Colors.lightGray,
    backgroundColor: themas.Colors.bgScreen,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", //talvez tirar, tem que ver como fica com o icone
  },
  input: {
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
});
