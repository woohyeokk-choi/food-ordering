import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");
  const [image, setImage] = useState("");

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

  const onCreate = () => {
    if (!validateInput()) return;
    console.warn("Creating product");

    resetFields();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Product" }} />
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
      />
      <Text style={styles.label}>Price ($) </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={{ color: "red" }}>{error}</Text>
      <Button onPress={onCreate} text="Create" />
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
    placeholderTextColor: "gray",
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
