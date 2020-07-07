import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// import Profile from '../screens/Profile';
import AppointmentCreation from '../screens/AppointmentCreation';
import Dashboard from '../screens/Dashboard';
import ApppointmentCreated from '../screens/ApppointmentCreated';
import Profile from '../screens/Profile';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
    }}
    initialRouteName="Dashboard"
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="AppointmentCreation" component={AppointmentCreation} />
    <App.Screen name="AppointmentCreated" component={ApppointmentCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
