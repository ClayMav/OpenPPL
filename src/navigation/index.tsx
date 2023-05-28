/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Button, useColorScheme } from "react-native";

import LinkingConfiguration from "./LinkingConfiguration";
import CalendarScreen from "../screens/CalendarScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import HomeScreen from "../screens/HomeScreen";
import MaxesScreen from "../screens/MaxesScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import { type RootStackParamList } from "../types";

export default function Navigation(): JSX.Element {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
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
        name="Home"
        component={HomeScreen}
        options={() => ({
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={() => ({
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Maxes"
        component={MaxesScreen}
        options={() => ({
          title: "Maxes",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="weight-pound" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={() => ({
          title: "Exercises",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="weight-lifter" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="SettingsTab"
        component={SettingsScreen}
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
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}): JSX.Element {
  return (
    <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />
  );
}
