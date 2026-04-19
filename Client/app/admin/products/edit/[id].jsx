/** @format */

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS, CATEGORIES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/constants/api";
import { useAuth } from "@clerk/clerk-expo";

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const { getToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // 📥 FETCH PRODUCT FROM BACKEND
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data;

        setName(product.name);
        setDescription(product.description || "");
        setPrice(String(product.price));
        setStock(String(product.stock));

        setCategory(
          typeof product.category === "object" ?
            product.category.name
          : product.category,
        );

        setIsFeatured(product.isFeatured);

        if (product.sizes) {
          setSizes(
            Array.isArray(product.sizes) ?
              product.sizes.join(", ")
            : product.sizes,
          );
        }

        if (product.images) {
          setExistingImages(
            Array.isArray(product.images) ? product.images : [product.images],
          );
        }
      } catch (error) {
        console.log("Fetch product error:", error?.message);

        Toast.show({
          type: "error",
          text1: "Failed to Fetch Product",
          text2: error?.response?.data?.message || "Something went wrong",
        });

        router.replace("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 📸 PICK IMAGES
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - (existingImages.length + newImages.length),
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setNewImages([...newImages, ...uris]);
    }
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  // 💾 UPDATE PRODUCT
  const handleSubmit = async () => {
    if (!name || !price || !sizes) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill required fields",
      });
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isFeatured", String(isFeatured));
      formData.append("sizes", sizes);

      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      for (let i = 0; i < newImages.length; i++) {
        const uri = newImages[i];
        const filename = `image-${i}.jpg`;

        if (Platform.OS === "web") {
          const blob = await (await fetch(uri)).blob();
          formData.append(
            "images",
            new File([blob], filename, { type: "image/jpeg" }),
          );
        } else {
          formData.append("images", {
            uri,
            name: filename,
            type: "image/jpeg",
          });
        }
      }

      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({
        type: "success",
        text1: "Product Updated",
      });

      router.back();
    } catch (error) {
      console.log("Update error:", error?.message);

      Toast.show({
        type: "error",
        text1: "Failed to Update Product",
        text2: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface p-4">
      <View className="bg-white p-4 rounded-xl border border-gray-100 mb-20">
        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          value={stock}
          onChangeText={setStock}
        />

        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          value={sizes}
          onChangeText={setSizes}
        />

        {/* CATEGORY MODAL (UNCHANGED) */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-surface p-3 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-primary">{category || "Select Category"}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-2xl p-4 max-h-[50%]">
                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-4 border-b"
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

        {/* IMAGES */}
        <ScrollView horizontal>
          {existingImages.map((uri, i) => (
            <View key={i} className="mr-2">
              <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
              <TouchableOpacity onPress={() => removeExistingImage(i)}>
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}

          {newImages.map((uri, i) => (
            <View key={i} className="mr-2">
              <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
              <TouchableOpacity onPress={() => removeNewImage(i)}>
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Switch value={isFeatured} onValueChange={setIsFeatured} />

        <TouchableOpacity
          className="bg-primary p-4 rounded-xl items-center"
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ?
            <ActivityIndicator color="white" />
          : <Text className="text-white font-medium">Update Product</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
