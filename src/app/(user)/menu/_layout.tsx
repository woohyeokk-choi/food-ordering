import { Link, Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";

export default function MenuStack() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="shopping-cart"
                  size={20}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="menu" options={{ title: "Menu" }} />
    </Stack>
  );
}
