import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { type Notification } from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationProvider({ children }: any): JSX.Element {
  const [, setExpoPushToken] = useState("");

  const [, setNotification] = useState<Notification | undefined>(undefined);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    void registerForPushNotificationsAsync().then((token: unknown) => {
      setExpoPushToken(token as string);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return <>{children}</>;
}

async function registerForPushNotificationsAsync(): Promise<void> {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }
}

export async function sendNotification(
  body: string,
  title = "PushPullLegs"
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      vibrate: [10, 10, 10],
    },
    trigger: null,
  });
}
