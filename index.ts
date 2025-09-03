import { registerRootComponent } from 'expo';
// import RegisterScreen from './src/screens/RegisterScreen';
// import DashboardScreen from './src/screens/Dashboard';
// import LoginScreen from './src/screens/LoginScreen';
// import SplashScreen from './src/SplashScreen';
// import TasksScreen from './src/screens/TasksScreen';

import App from './App';
// import Background from './Background';
// import dashboardScreen from './src/screens/Dashboard';


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(App);
// registerRootComponent(LoginScreen);
// registerRootComponent(Background);
// registerRootComponent(RegisterScreen);
// registerRootComponent(DashboardScreen);
// registerRootComponent(TasksScreen);
