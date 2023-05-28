import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "./src/navigation";
import React from "react";
import Toast from "react-native-toast-message";
import NotificationProvider from "./src/utils/notifications";

export default function App(): JSX.Element {
  return (
    <NotificationProvider>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
        <Toast />
      </SafeAreaProvider>
    </NotificationProvider>
  );
}
