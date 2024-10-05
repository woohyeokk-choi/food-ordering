import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import React, { useEffect } from "react";
import Button from "@/components/Button";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/src/api/products";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/src/lib/supabase";
import { randomUUID } from "expo-crypto";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");
  const [image, setImage] = useState("");

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);
  const isUpdating = !!id;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct?.name || "");
      setPrice(updatingProduct?.price?.toString() || "");
      setImage(updatingProduct?.image || "");
    }
  }, [updatingProduct]);

  const router = useRouter();

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  const validateInput = () => {
    if (name === "") {
      setError("Name is required");
      return false;
    }

    if (price === "") {
      setError("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setError("Price must be a number");
      return false;
    }
    if (Number(price) < 0) {
      setError("Price must be greater than 0");
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) return;
    const imagePath = await uploadImage();

    insertProduct(
      {
        name,
        price: parseFloat(price),
        image: imagePath,
      },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );

    resetFields();
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    updateProduct(
      { id, name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );
  };

  const onDelete = () => {
    deleteProduct(
      { id },
      {
        onSuccess: () => {
          resetFields();
          router.replace("/(admin)");
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: onDelete,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        source={{
          uri:
            image ||
            "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png",
        }}
        style={{ width: "50%", aspectRatio: 1, alignSelf: "center" }}
      />
      <Text onPress={pickImage} style={styles.textbutton}>
        Select Image
      </Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="New Pizza"
        style={styles.input}
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Price ($) </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="gray"
      />
      <Text style={{ color: "red" }}>{error}</Text>
      <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textbutton}>
          Delete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  textbutton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default CreateProductScreen;
