/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { type LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

const linking: LinkingOptions<any> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Calendar: {
            screens: {
              CalendarScreen: "calendar",
            },
          },
          Maxes: {
            screens: {
              MaxesScreen: "maxes",
            },
          },
          Exercises: {
            screens: {
              ExercisesScreen: "exercises",
            },
          },
          Settings: {
            screens: {
              SettingsScreen: "settings",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
    },
  },
};

export default linking;
