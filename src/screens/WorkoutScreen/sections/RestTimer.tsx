import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
// import { sendNotification } from "../../../utils";

export function RestTimer({
  seconds: startSeconds,
}: {
  seconds: number;
}): JSX.Element {
  const [timerStarted, setTimerStarted] = useState(false);
  const [key, setKey] = useState(0);
  return (
    <View className="flex items-center justify-center mx-6">
      <Text className="text-2xl font-bold text-black dark:text-white">
        Rest Timer
      </Text>
      <TouchableOpacity
        onPress={() => {
          setKey((key) => key + 1);
          setTimerStarted(true);
        }}
      >
        <CountdownCircleTimer
          key={key}
          isPlaying={timerStarted}
          duration={startSeconds}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
        >
          {({ remainingTime }) => (
            <Text className="text-black dark:text-white text-4xl">
              {remainingTime}
            </Text>
          )}
        </CountdownCircleTimer>
      </TouchableOpacity>
    </View>
  );
}
