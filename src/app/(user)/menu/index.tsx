import { Redirect } from "expo-router";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import products from "@/assets/data/products";

const HomeScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
};

export default HomeScreen;
