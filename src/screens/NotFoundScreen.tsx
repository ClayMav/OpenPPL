import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

import { type RootStackScreenProps } from "../types";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">): JSX.Element {
  return (
    <View>
      <Text>{"This screen doesn't exist."}</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.replace("Root");
        }}
      >
        <Text>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}
