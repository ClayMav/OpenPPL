/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Button } from "react-native";

import WorkoutScreen from "../screens/WorkoutScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeTabScreen from "../screens/HomeTabScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { type RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import useColorScheme from "../hooks/useColorScheme";

export default function Navigation(): JSX.Element {
  const scheme = useColorScheme();
  return (
    <NavigationContainer
      theme={scheme === "dark" ? DarkTheme : DefaultTheme}
      linking={LinkingConfiguration}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): JSX.Element {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "fullScreenModal",
          headerLeft: () => (
            <Button
              title="Back"
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="Modal"
          component={WorkoutScreen}
          options={({ route }) => ({
            title: `${String(route.params?.workout)} Workout`,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator();

function BottomTabNavigator(): JSX.Element {
  return (
    <BottomTab.Navigator initialRouteName="HomeTab">
      <BottomTab.Screen
        name="HomeTab"
        component={HomeTabScreen}
        options={({ navigation }) => ({
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}): JSX.Element {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
