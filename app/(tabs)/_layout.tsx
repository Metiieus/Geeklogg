import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
}

function TabIcon({ focused, icon, label }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-1">
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text
        className={`text-[10px] mt-0.5 font-medium ${
          focused ? "text-violet-400" : "text-slate-500"
        }`}
      >
        {label}
      </Text>
      {focused && (
        <View className="w-1 h-1 rounded-full bg-violet-500 mt-0.5" />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#12121a",
          borderTopColor: "#2a2a3e",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 8,
          paddingTop: 8,
          elevation: 20,
          shadowColor: "#7c3aed",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏠" label="Início" />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📚" label="Biblioteca" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`w-14 h-14 rounded-2xl items-center justify-center -mt-4 shadow-lg ${
                focused ? "bg-violet-500" : "bg-violet-600"
              }`}
              style={{
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <Text className="text-white text-3xl font-light">+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📅" label="Timeline" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Perfil" />
          ),
        }}
      />
    </Tabs>
  );
}
