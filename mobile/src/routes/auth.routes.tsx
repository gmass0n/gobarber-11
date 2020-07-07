import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
      ...TransitionPresets.SlideFromRightIOS,
    }}
    initialRouteName="SignIn"
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
