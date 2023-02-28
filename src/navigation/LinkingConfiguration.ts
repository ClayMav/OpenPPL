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
          HomeTab: {
            screens: {
              HomeTabScreen: "one",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
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
