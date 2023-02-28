import React from "react";
import { Text, type TextProps } from "./Themed";

export function MonoText(props: TextProps): JSX.Element {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}
