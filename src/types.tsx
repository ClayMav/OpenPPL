/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  type ParamListBase,
  type NavigatorScreenParams,
} from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";

export type Workout = "Push" | "Pull" | "Legs";
export interface RootStackParamList extends ParamListBase {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: { workout: Workout };
  NotFound: undefined;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export interface RootTabParamList {
  Home: undefined;
  Calendar: undefined;
  Maxes: undefined;
  Exercises: undefined;
  Settings: undefined;
}

// export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
//   CompositeScreenProps<
//     BottomTabScreenProps<RootTabParamList, Screen>,
//     NativeStackScreenProps<RootStackParamList>
//   >;
