import { Platform, Dimensions } from "react-native";

export function isIPhoneX() {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  return (
    Platform.OS === "ios" &&
    ((Dimensions.get("window").height === X_HEIGHT &&
      Dimensions.get("window").width === X_WIDTH) ||
      (Dimensions.get("window").height === X_WIDTH &&
        Dimensions.get("window").width === X_HEIGHT))
  );
}
