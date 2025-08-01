// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 15,
          paddingTop: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 6,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Employees',
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center">
              <View 
                className={`w-14 h-14 rounded-2xl justify-center items-center ${
                  focused ? 'bg-blue-100' : 'bg-gray-100'
                }`}
                style={{
                  shadowColor: focused ? '#3B82F6' : '#000',
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
              {focused && (
                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <View className="items-center">
              <View 
                className={`w-14 h-14 rounded-2xl justify-center items-center ${
                  focused ? 'bg-blue-100' : 'bg-gray-100'
                }`}
                style={{
                  shadowColor: focused ? '#3B82F6' : '#000',
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
              {focused && (
                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
