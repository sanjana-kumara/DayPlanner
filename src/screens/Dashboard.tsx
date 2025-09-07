import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type DashboardNav = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

// const PUBLIC_URL = "https://63e3dc2a2c6f.ngrok-free.app";

const PUBLIC_URL = process.env.EXPO_PUBLIC_APP_PUBLIC_URL;

type TaskItem = {
  id: number;
  name: string;
  type: number; // 1=Complete, 2=Not_Complete
};

type TaskGroup = {
  title: string;
  date: string;
  tasks: TaskItem[];
};

export default function Dashboard() {
  const navigation = useNavigation<DashboardNav>();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const name = (await AsyncStorage.getItem("userName")) || "";
      setUserEmail(email);
      setUserName(name);
    })();
  }, []);

  const fetchGroups = useCallback(async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${PUBLIC_URL}/DailyPlanner/Dashboard?email=${encodeURIComponent(
          userEmail
        )}`
      );
      const json = await res.json();
      if (json.status) {
        setGroups(json.groups || []);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: json.message || "Failed to load",
        });
      }
    } catch {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Network error loading tasks",
      });
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const toggleTask = async (groupIndex: number, taskIndex: number) => {
    const g = groups[groupIndex];
    const t = g.tasks[taskIndex];
    const newCompleted = !(t.type === 1);

    const next = [...groups];
    next[groupIndex] = {
      ...g,
      tasks: g.tasks.map((x, i) =>
        i === taskIndex ? { ...x, type: newCompleted ? 1 : 2 } : x
      ),
    };
    setGroups(next);

    try {
      const res = await fetch(PUBLIC_URL + "/DailyPlanner/Dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: t.id, completed: newCompleted }),
      });
      const json = await res.json();
      if (!json.status) {
        throw new Error(json.message || "Update failed");
      }
    } catch (e: any) {
      setGroups(groups); // rollback
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: e.message || "Failed to update task",
      });
    }
  };

  const deleteGroup = async (
    groupIndex: number,
    title: string,
    date: string
  ) => {
    try {
      const updatedGroups = groups.filter((_, i) => i !== groupIndex);
      setGroups(updatedGroups);

      const res = await fetch(PUBLIC_URL + "/DailyPlanner/Dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          title,
          date,
          email: userEmail,
        }),
      });

      const json = await res.json();
      if (!json.status) {
        throw new Error(json.message || "Delete failed");
      }

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Deleted",
        textBody: "Task group deleted successfully",
      });
    } catch (e: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: e.message || "Failed to delete task group",
      });
      fetchGroups(); // rollback
    }
  };

  if (!userEmail) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 16 }}>Please login first.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilecontanier}>
          <View style={styles.profilecircle}>
            <Ionicons name="person" size={28} color="#000" />
          </View>
          <Text style={styles.welcomeText}>Welcome, {userName || "User"}</Text>
        </View>
        <TouchableOpacity
          style={styles.addFab}
          onPress={() => navigation.navigate("Tasks" as any)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {groups.map((g, gi) => (
            <View key={`${g.title}-${g.date}-${gi}`} style={styles.taskCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.taskTitle}>{g.title}</Text>
                <Text style={styles.taskTitle}>{g.date}</Text>
              </View>

              <ScrollView style={{ margin: 10, padding: 5 }}>
                {g.tasks.map((t, ti) => {
                  const checked = t.type === 1;
                  return (
                    <View
                      key={t.id}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Checkbox
                        style={{ margin: 8 }}
                        value={checked}
                        onValueChange={() => toggleTask(gi, ti)}
                        color={checked ? "#61C2D0" : undefined}
                      />
                      <Text style={styles.taskText}>{t.name}</Text>
                    </View>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => deleteGroup(gi, g.title, g.date)}
              >
                <Ionicons name="close" size={22} color="#61C2D0" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf6f6" },
  header: {
    width: "100%",
    height: 140,
    backgroundColor: "#61C2D0",
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  profilecontanier: { alignItems: "center" },
  profilecircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  welcomeText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  addFab: {
    position: "absolute",
    right: 16,
    bottom: -24,
    backgroundColor: "#3aa9b9",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  taskCard: {
    backgroundColor: "#EBFCFE",
    width: "88%",
    minHeight: 180,
    alignSelf: "center",
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginTop: 30,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  taskTitle: { fontSize: 15, color: "#00000080" },
  taskText: { fontSize: 16, color: "#00000095", paddingVertical: 6 },
  addBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    borderColor: "#61C2D0",
    borderWidth: 2,
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
});
