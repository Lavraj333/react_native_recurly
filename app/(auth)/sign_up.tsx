import { Link } from "expo-router";
import { Text, View } from "react-native";

const sign_up = () => {
  return (
    <View>
      <Text>sign_up</Text>
      <Link href="/(auth)/sign_in">Sign In</Link>
    </View>
  );
};

export default sign_up;
