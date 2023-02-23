import { Button, Text, TouchableOpacity } from "react-native";

export default function PrimaryButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      className=" rounded-full bg-green-300 text-black p-4 mt-8"
      onPress={onPress}
    >
      <Text className="text-xl font-bold text-center">{children}</Text>
    </TouchableOpacity>
  );
}