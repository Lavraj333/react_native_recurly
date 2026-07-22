import { Link } from "expo-router";
import { Text, View } from "react-native";

const sign_in = () => {
  return (
    <View>
      <Text>sign_in</Text>
      <Link href="/(auth)/sign_up">Create Account</Link>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default sign_in;
