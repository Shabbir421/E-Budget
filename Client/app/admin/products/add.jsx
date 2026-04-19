/** @format */

import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import Toast from "react-native-toast-message";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CATEGORIES } from "@/assets/constants";
import { api } from "@/constants/api";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AddProduct() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Men");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // 📸 PICK IMAGES
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris.slice(0, 5));
    }
  };

  // 📦 SUBMIT PRODUCT
  const handleSubmit = async () => {
    if (!name || !price || !category || !sizes || images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Fill all required fields + add images",
      });
      return;
    }

    try {
      setSubmitting(true);

      const token = await getToken();

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Auth Error",
          text2: "User not authenticated",
        });
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price) || 0);
      formData.append("stock", Number(stock) || 0);
      formData.append("category", category);
      formData.append(
        "sizes",
        JSON.stringify(sizes.split(",").map((s) => s.trim())),
      );
      formData.append("isFeatured", isFeatured ? "true" : "false");

      // ✅ IMAGE FIX
      images.forEach((uri, i) => {
        formData.append("images", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          name: `image-${i}.jpg`,
          type: "image/jpeg",
        });
      });

      await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ❌ no manual Content-Type
        },
      });

      Toast.show({
        type: "success",
        text1: "Product Created",
      });

      // reset
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("Men");
      setSizes("");
      setImages([]);
      setIsFeatured(false);

      router.replace("/admin/products");
    } catch (error) {
      console.log(
        "Create product error:",
        error?.response?.data || error.message,
      );

      Toast.show({
        type: "error",
        text1: "Failed to Create Product",
        text2:
          error?.response?.data?.message || error.message || "Server error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F6F7FB]"
      contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
      showsVerticalScrollIndicator={false}>
      <View className="bg-white mx-4 p-5 rounded-2xl border border-gray-100 shadow-sm">
        {/* NAME */}
        <TextInput
          className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100"
          value={name}
          onChangeText={setName}
          placeholder="Product Name"
        />

        {/* PRICE */}
        <TextInput
          className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          placeholder="Price (₹)"
        />

        {/* CATEGORY */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-gray-50 p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-100">
          <Text className="text-gray-700">{category}</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>

        {/* STOCK + SIZES */}
        <View className="flex-row gap-3 mb-3">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100"
            value={stock}
            onChangeText={setStock}
            placeholder="Stock"
            keyboardType="numeric"
          />

          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100"
            value={sizes}
            onChangeText={setSizes}
            placeholder="Sizes (S,M,L)"
          />
        </View>

        {/* IMAGES */}
        <TouchableOpacity onPress={pickImages} className="mb-4">
          {images.length > 0 ?
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  className="w-24 h-24 mr-2 rounded-xl border border-gray-200"
                />
              ))}
            </ScrollView>
          : <View className="h-32 bg-gray-50 justify-center items-center rounded-xl border border-dashed border-gray-300">
              <Ionicons name="cloud-upload-outline" size={28} color="#888" />
              <Text className="text-gray-500 mt-2">Tap to upload images</Text>
            </View>
          }
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <TextInput
          className="bg-gray-50 p-4 rounded-xl mb-4 h-28 border border-gray-100"
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Product description..."
          textAlignVertical="top"
        />

        {/* FEATURED */}
        <View className="flex-row justify-between items-center mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <Text className="text-gray-700 font-medium">Featured Product</Text>
          <Switch value={isFeatured} onValueChange={setIsFeatured} />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className="bg-green-600 py-4 rounded-xl">
          {submitting ?
            <ActivityIndicator color="white" />
          : <Text className="text-white text-center font-bold text-base">
              Create Product
            </Text>
          }
        </TouchableOpacity>
      </View>

      <Toast />

      {/* CATEGORY MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white p-4 rounded-t-2xl max-h-[50%]">
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item, index) =>
                  item?.id?.toString() || index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-4 border-b border-gray-100"
                    onPress={() => {
                      setCategory(item.name);
                      setModalVisible(false);
                    }}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}
