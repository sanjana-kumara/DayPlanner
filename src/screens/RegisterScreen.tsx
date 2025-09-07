import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Background from "./Background";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RegisterScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

// const PUBLIC_URL = "https://b1c3ea2e0901.ngrok-free.app";

const PUBLIC_URL = process.env.EXPO_PUBLIC_APP_PUBLIC_URL;

export default function RegisterScreen() {
  const navigator = useNavigation<RegisterScreenProps>();

  // state
  const [getFullName, setFullName] = React.useState("");
  const [getEmail, setEmail] = React.useState("");
  const [getPassword, setPassword] = React.useState("");
  const [getConfirmPassword, setConfirmPassword] = React.useState("");

  return (
    <Background>
      <AlertNotificationRoot>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // ios safe area adjust
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled" // <-- fix: input click issue
          >
            <View style={styles.container}>
              <Text style={styles.title}>Welcome Day Planner!</Text>
              <Text style={styles.subtitle}>Let’s help you meet up tasks.</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="default"
                onChangeText={setFullName}
                value={getFullName}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={getEmail}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={getPassword}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
                value={getConfirmPassword}
                returnKeyType="done"
              />

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={async () => {
                  const UserData = {
                    fullName: getFullName,
                    email: getEmail,
                    password: getPassword,
                    confirmPassword: getConfirmPassword,
                  };

                  const userJson = JSON.stringify(UserData);

                  const response = await fetch(
                    PUBLIC_URL + "/DailyPlanner/NewAccount",
                    {
                      method: "POST",

                      body: userJson,
                    }
                  );

                  if (response.ok) {
                    const json = await response.json();

                    if (json.status) {
                      // Save to AsyncStorage
                      await AsyncStorage.setItem("userName", getFullName);

                      Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "Successfully registered!",
                        button: "OK",
                        onHide: () => {
                          // Reset fields
                          setFullName("");
                          setEmail("");
                          setPassword("");
                          setConfirmPassword("");
                          // Navigate with params
                          navigator.navigate("Dashboard", {
                            userName: getFullName,
                          });
                        },
                      });
                    } else {
                      Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: json.message,
                      });
                    }
                  } else {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: "Something went wrong, Please try again later.",
                    });
                  }
                }}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              <Text style={styles.subtitle1}>
                Already have an account ?
                <Text
                  style={styles.signin}
                  onPress={() => navigator.navigate("Login")}
                >
                  {" "}
                  Sign in
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AlertNotificationRoot>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    fontFamily: "ABeeZee",
    color: "black",
    marginTop: 20,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 16,
    color: "#00000080",
    fontFamily: "ABeeZee",
    padding: 10,
    marginBottom: 30,
  },
  subtitle1: {
    color: "#00000080",
    fontSize: 16,
    fontFamily: "ABeeZee",
    fontWeight: "400",
    marginTop: 20,
  },
  signin: {
    color: "#0DA1CF",
    fontWeight: "500",
    fontSize: 17,
  },
  button: {
    backgroundColor: "#61C2D0",
    width: 378,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FAF6F6",
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  input: {
    width: 380,
    height: 49,
    borderRadius: 30,
    margin: 12,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontFamily: "ABeeZee",
    fontWeight: "400",
    fontSize: 14,
    paddingLeft: 20,
  },
});
