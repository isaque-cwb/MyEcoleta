import React, { useEffect, useCallback} from 'react';
import { StatusBar, SafeAreaView, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Routes from './routes'
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold 
  })

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if(!fontsLoaded){
    return null
  }

  

  return (
    <SafeAreaView style={{flex:1}} onLayout={onLayoutRootView} >
  
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} translucent  />
      <Routes />
    </SafeAreaView>
  );
}


