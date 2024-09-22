import { Redirect } from "expo-router";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const HomeScreen = () => {
  const { id } = useLocalSearchParams();
  return <Redirect href={`./menu/${id}`} />;
};
