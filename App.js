import React, { Component, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { BottomTab } from './home/src/components/nagivation/BottomTab'
import AppLoading from 'expo-app-loading';
import useFonts from './home/hooks/useFonts';
import LoginScreen from './home/src/components/screens/LoginScreen';
import HomeScreen from './home/src/components/screens/HomeScreen';
import AppNavigator from './home/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './home/src/reduxStore/reduxStore';
import { LogBox } from 'react-native';


export default function RegisterScreen(props) {

  const [IsReady, SetIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LoadFontsAndRestoreToken = async () => {
    await useFonts();
    // Here, you can check if the user is logged in and set the isLoggedIn variable accordingly.
    setIsLoggedIn(false); // Change this line to your login logic
  };
  LogBox.ignoreAllLogs();

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFontsAndRestoreToken}
        onFinish={() => SetIsReady(true)}
        onError={() => { }}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? <BottomTab /> : <AppNavigator />}
      </NavigationContainer>
    </Provider>
  );
}

