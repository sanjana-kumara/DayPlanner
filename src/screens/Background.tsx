import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type BackgroundProps = {

  children: ReactNode;

};

export default function Background({ children }: BackgroundProps) {

  return (

    <View style={styles.container}>

      {/* Background circles */}
      <View style={[styles.circle, styles.topCircle]} />
      <View style={[styles.circle, styles.extraCircle1]} />
      <View style={[styles.circle, styles.extraCircle2]} />
      <View style={[styles.circle, styles.bottomCircle]} />
      {/* Render children on top of circles */}

      <View style={styles.childrenContainer}>{children}</View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#eaf6f6",

  },

  circle: {

    position: "absolute",

    borderRadius: 100,

    backgroundColor: "rgba(160, 231, 229, 0.3)",

  },

  topCircle: {

    width: 200,

    height: 200,

    top: -10,

    left: -40,

    

  },

  bottomCircle: {

    width: 200,

    height: 200,

    bottom: -20,

    right: -80,

  },

  extraCircle1: {

    width: 200,

    height: 200,

    top: -100,

    left: 5,

  },

  extraCircle2: {

    width: 200,

    height: 200,

    bottom: -69,

    right: 10,

  },

  childrenContainer: {

    flex: 1,

    alignItems: "center",

    justifyContent: "center",

  },
  
});
