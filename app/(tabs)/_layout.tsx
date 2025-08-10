// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function TabLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Check if splash screen is still visible
    const checkSplashScreen = async () => {
      try {
        // Add a delay to ensure splash screen has time to hide
        setTimeout(() => {
          setIsSplashVisible(false);
        }, 1000);
      } catch (error) {
        console.log("Splash screen check error:", error);
      }
    };

    checkSplashScreen();
  }, []);

  // Don't render tabs if splash screen is visible
  if (isSplashVisible) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 90, // Increased height
          paddingBottom: 15, // Increased padding
          paddingTop: 15, // Increased padding
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 }, // Enhanced shadow
          shadowOpacity: 0.15, // Enhanced shadow
          shadowRadius: 12, // Enhanced shadow
          elevation: 12, // Enhanced elevation
          marginHorizontal: 16, // Added horizontal margin
          marginBottom: 16, // Added bottom margin
          borderRadius: 20, // Rounded corners for floating effect
          position: "absolute", // Make it float
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 6, // Adjusted margin
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Employee",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: focused ? "#DBEAFE" : "#F3F4F6",
                  shadowColor: focused ? "#3B82F6" : "#000",
                  shadowOffset: { width: 0, height: focused ? 4 : 2 },
                  shadowOpacity: focused ? 0.3 : 0.1,
                  shadowRadius: focused ? 8 : 4,
                  elevation: focused ? 6 : 2,
                }}
              >
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  size={focused ? 26 : 24}
                  color={color}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: focused ? "#DBEAFE" : "#F3F4F6",
                  shadowColor: focused ? "#3B82F6" : "#000",
                  shadowOffset: { width: 0, height: focused ? 4 : 2 },
                  shadowOpacity: focused ? 0.3 : 0.1,
                  shadowRadius: focused ? 8 : 4,
                  elevation: focused ? 6 : 2,
                }}
              >
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  size={focused ? 26 : 24}
                  color={color}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
