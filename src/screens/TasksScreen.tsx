import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "./Background";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

type TasksScreenProps = NativeStackNavigationProp<RootStackParamList, "Tasks">;

const PUBLIC_URL = "https://7746448d6b3f.ngrok-free.app";

// const PUBLIC_URL = process.env.EXPO_PUBLIC_APP_PUBLIC_URL;


export default function TasksScreen() {
  const navigator = useNavigation<TasksScreenProps>();

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [tasks, setTasks] = useState<string[]>([""]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch email from AsyncStorage
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        setUserEmail(email);
      } catch (e) {
        console.log("Error reading userEmail", e);
      }
    };
    fetchEmail();
  }, []);

  const addTask = () => setTasks([...tasks, ""]);

  const updateTask = (text: string, index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = text;
    setTasks(newTasks);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const saveTasks = async () => {
    if (!userEmail) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "User not logged in",
      });
      return;
    }

    try {
      const payload = {
        taskName: tasks.filter((t) => t.trim() !== ""),
        date: date.toISOString().split("T")[0],
        email: userEmail,
        title: taskTitle,
      };

      const res = await fetch(`${PUBLIC_URL}/DailyPlanner/DailyTasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.status) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Tasks saved successfully!",
          button: "OK",
          onHide: () => {
            setTasks([""]);
            // navigator.navigate("Dashboard", { userName: json.userName });
            navigator.navigate("Dashboard", { userName: json.userName });
          },
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: json.message,
        });
      }
    } catch (err) {
      // console.error(err);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: "Failed to save tasks. Please try again later.",
        button: "Try Again",
      });
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Add your daily tasks !</Text>

        <View style={{ margin: 20, gap: 20 }}>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Date: {date.toDateString()}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={date}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              style={styles.title1}
              placeholder="Task title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TouchableOpacity onPress={addTask}>
              <Ionicons name="add" size={30} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ marginTop: 10 }}>
          {tasks.map((task, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Enter task"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={task}
              onChangeText={(text) => updateTask(text, index)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={saveTasks}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 32,
    fontFamily: "ABeeZee",
    color: "black",
    marginTop: 20,
    alignSelf: "center",
  },
  title1: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "ABeeZee",
    color: "#00000078",
  },
  button: {
    backgroundColor: "#61C2D0",
    width: 378,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    alignSelf: "center",
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
