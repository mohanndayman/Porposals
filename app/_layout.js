import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "EBGaramond-Italic": require("../assets/fonts/EBGaramond-Italic-VariableFont_wght.ttf"),
    "EBGaramond-Regular": require("../assets/fonts/EBGaramond-VariableFont_wght.ttf"),
    "Mulish-Italic": require("../assets/fonts/Mulish-Italic-VariableFont_wght.ttf"),
    "Mulish-Regular": require("../assets/fonts/Mulish-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <Provider store={store}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="welcome"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(profile)"
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="(subscription)"
              options={{
                gestureEnabled: true,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </Provider>
    </LanguageProvider>
  );
}
