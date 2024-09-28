import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import products from "@/assets/data/products";
import { supabase } from "@/src/lib/supabase";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.log("Error fetching products", error);
      }
      setProducts(data);
    };

    fetchProducts();
  }, []);

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
