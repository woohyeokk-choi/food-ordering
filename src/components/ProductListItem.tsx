import { Text, Image, StyleSheet, Pressable } from "react-native";
import { type Product, Tables } from "../types";
import { type Href, Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  const segment = `${segments[0]}/menu/${product.id}` as Href;

  return (
    <Link href={segment} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={product?.image}
          fallback={defaultPizzaImage}
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
