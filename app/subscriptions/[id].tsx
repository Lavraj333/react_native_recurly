import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const subscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>subscriptionDetails : {id}</Text>
      <Link href="/">Go back</Link>
    </View>
  );
};

export default subscriptionDetails;
