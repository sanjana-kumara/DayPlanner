import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Background from "./Background";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginScreenProps = NativeStackNavigationProp<RootStackParamList, "Login">;

// const PUBLIC_URL = "https://63e3dc2a2c6f.ngrok-free.app";

const PUBLIC_URL = process.env.EXPO_PUBLIC_APP_PUBLIC_URL;

export default function LoginScreen() {
  const navigator = useNavigation<LoginScreenProps>();

  const [getEmail, setEmail] = React.useState("");
  const [getPassword, setPassword] = React.useState("");

  // Store credentials in AsyncStorage
  const saveCredentials = async (
    email: string,
    password: string,
    userName: string
  ) => {
    try {
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", password);
      await AsyncStorage.setItem("userName", userName);
    } catch (e) {
      console.log("Error saving credentials", e);
    }
  };

  return (
    <Background>
      <AlertNotificationRoot>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.title}>Welcome Back !</Text>

              <View>
                <Image
                  source={require("../../assets/registerd.png")}
                  style={styles.logo}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="email-address"
                value={getEmail}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                secureTextEntry={true}
                value={getPassword}
                onChangeText={setPassword}
              />

              {/* <Text style={styles.subtitle}>Forgot Password</Text> */}

              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  const UData = {
                    email: getEmail,
                    password: getPassword,
                  };

                  const UJson = JSON.stringify(UData);

                  const response = await fetch(
                    PUBLIC_URL + "/DailyPlanner/Login",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: UJson,
                    }
                  );

                  if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.status) {
                      // Save email & password to AsyncStorage
                      await saveCredentials(
                        getEmail,
                        getPassword,
                        responseData.userName
                      );

                      Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "Login Successful",
                        button: "OK",
                        onHide: () => {
                          navigator.navigate("Dashboard", {
                            userName: responseData.userName,
                          });
                        },
                      });
                    } else {
                      Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: responseData.message,
                      });
                    }
                  } else {
                    Dialog.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Login Failed",
                      textBody: "Please try again later.",
                      button: "Try Again",
                    });
                  }
                }}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <Text style={styles.subtitle1}>
                Don’t have an account ?
                <Text
                  style={styles.signup}
                  onPress={() => navigator.navigate("Register")}
                >
                  {" "}
                  Sign up
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
  scrollContainer: {
    flexGrow: 1,
  },
  logo: {
    width: 268,
    height: 263,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: "ABeeZee",
    color: "black",
    padding: 10,
    margin: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#0DA1CF",
    fontFamily: "ABeeZee",
    padding: 10,
    marginBottom: 40,
  },
  subtitle1: {
    color: "#00000080",
    fontSize: 16,
    fontFamily: "ABeeZee",
    marginTop: 20,
  },
  signup: {
    color: "#0DA1CF",
    fontSize: 17,
  },
  button: {
    backgroundColor: "#61C2D0",
    width: 378,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
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
    color: "#00000080",
    fontFamily: "ABeeZee",
    fontSize: 14,
    paddingLeft: 20,
  },
});
