import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import Background from "./screens/Background";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";

type SplashScreenProps = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {

  const navigator = useNavigation<SplashScreenProps>();

  return (
    <Background>
      <View style={styles.container}>
        <View>
          <Image
            source={require("../assets/splashscreen.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Get things done with TODo</Text>

        <Text style={styles.subtitle}>
          To deal with situations quickly and efficiently!
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigator.navigate("Login")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 239,
    height: 308,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "regular",
    fontFamily: "ABeeZee",
    color: "black",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "ABeeZee",
    marginBottom: 100,
  },

  button: {
    backgroundColor: "#61C2D0",
    color: "#FAF6F6",
    width: 378,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FAF6F6",
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },

});
