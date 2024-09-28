import { Redirect, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "../../components/navigation/TabBarIcon";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { useAuth } from "../providers/AuthProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].background,
        tabBarInactiveBackgroundColor: "gainsboro",
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].tint,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="restaurant" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
