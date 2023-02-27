import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { sendNotification } from "../utils";

export function RestTimer({ seconds: startSeconds }: { seconds: number }) {
  const [seconds, setSeconds] = useState(startSeconds);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: number = 0;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    if (seconds < 1) {
      sendNotification("Rest period is over!");
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [seconds, timerActive]);

  const startTimer = () => {
    setSeconds(startSeconds);
    setTimerActive(true);
  };

  return (
    <View className="flex items-center justify-center mt-8">
      <Text className="text-2xl font-bold">Rest Timer</Text>
      <TouchableOpacity
        className="mt-6 w-48 h-48 bg-teal-500 rounded-full flex items-center justify-center p-8"
        onPress={() => startTimer()}
      >
        <Text className="text-white text-4xl font-bold text-center">
          {seconds}s
        </Text>
      </TouchableOpacity>
    </View>
  );
}
