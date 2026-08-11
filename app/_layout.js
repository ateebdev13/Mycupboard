import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "../src/context/AppContext";
import { colors } from "../src/theme/tokens";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvas },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="home" />
          <Stack.Screen name="item/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="stylist-result" options={{ presentation: "card" }} />
          <Stack.Screen name="checkout" options={{ presentation: "modal" }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
