import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import Toast from "react-native-toast-message";

import Navigation from "./src/navigation";
import NotificationProvider from "./src/utils/notifications";

import "./styles.css";

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
