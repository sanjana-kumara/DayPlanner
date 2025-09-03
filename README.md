# React Native Day Planner (Expo)

A simple day planner app built with React Native and Expo. It includes authentication, a dashboard that groups tasks by date, and a task creation screen with date/time picking. The app persists the logged-in user with AsyncStorage and talks to a Java servlet backend over HTTP.

> **Note:** This zip does not include `package.json` or native folders. Dependencies are inferred from the source imports below. You can create a fresh Expo app and copy the `*.tsx` files into it, then install the listed packages.

## 🚀 Database

<img width="645" height="332" alt="image" src="https://github.com/user-attachments/assets/c65b3a48-3562-49e2-86d7-7655b49b32d9" />


## ✨ Features
- Splash → Login/Sign up → Dashboard → Tasks flow via `@react-navigation/native`.
- Save login credentials and userName in `@react-native-async-storage/async-storage`.
- Dashboard fetches task **groups** for the logged-in user and supports:
  - Toggle task completion (`PUT /DailyPlanner/Dashboard`).
  - Delete a task group (`POST /DailyPlanner/Dashboard` with `action: "delete"`).
- Tasks screen creates tasks for a specific date (`POST /DailyPlanner/DailyTasks`).
- Nice UI helpers:
  - `react-native-alert-notification` for dialogs and toasts.
  - `react-native-modal-datetime-picker` for picking dates/times.
  - `expo-checkbox` and `@expo/vector-icons`.


Key screens/components:
- `App.tsx`: Navigator setup with **Splash**, **Login**, **Register**, **Dashboard**, **Tasks**.
- `src/screens/*`: Screens for Login, Register, Dashboard, Tasks (imports in `App.tsx`).
- `Background.tsx`: Circular layered background wrapper.
- Java files (`*.java`, `hibernate.cfg.xml`) are backend/server artifacts and not used by the React Native build.

## 📸 Screens (placeholders)
Add screenshots/GIFs here after running the app:
- Splash
- Login / Register
- Dashboard (groups & toggle completion)
- Create Tasks (date picker)

