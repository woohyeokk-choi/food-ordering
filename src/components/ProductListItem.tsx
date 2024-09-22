import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { type Product } from "../types";
import { Link } from "expo-router";
import { useSegments } from "expo-router";

const ProductListItem = ({ product }: { product: Product }) => {
  const segments = useSegments();
  return (
    <Link href={`${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{
            uri:
              product.image ??
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png",
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <Text>Go to details</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  price: {
    color: "blue",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
