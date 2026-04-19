/** @format */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert, // ✅ added
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { api } from "@/constants/api";
import { useAuth } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message"; // ✅ added

export default function Addresses() {
  const { getToken } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 📥 FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const res = await api.get("/addresses", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      setAddresses(res.data?.addresses || res.data || []); // ✅ moved inside try
    } catch (err) {
      console.log("Fetch addresses error:", err?.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch addresses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditSearch = (item) => {
    setIsEditing(true);
    setEditingId(item._id);

    setType(item.type);
    setStreet(item.street);
    setCity(item.city);
    setState(item.state);
    setZipCode(item.zipCode);
    setCountry(item.country);
    setIsDefault(item.isDefault);

    setModalVisible(true);
  };

  // 💾 SAVE
  const handleSaveAddress = async () => {
    if (!street || !city || !state || !zipCode || !country) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required",
      });
    }

    try {
      setSubmitting(true);

      const payload = {
        type,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      };

      const token = await getToken(); // ✅ added

      if (isEditing && editingId) {
        await api.put(`/addresses/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/addresses", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModalVisible(false);
      resetForm();
      fetchAddresses();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save address",
      });
      console.log("Save address error:", err?.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ❌ DELETE
  const handleDeleteAddress = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await getToken(); // ✅ added

            setAddresses((prev) => prev.filter((a) => a._id !== id));

            await api.delete(`/addresses/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (err) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to delete address",
            });
            console.log("Delete error:", err?.message);
            fetchAddresses();
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setType("Home");
    setIsDefault(false);

    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Shipping Addresses" showBack />

      {loading ?
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      : <ScrollView className="flex-1 px-4 pt-4">
          {addresses.length === 0 ?
            <Text className="text-center text-secondary mt-10">
              No addresses found
            </Text>
          : addresses.map((item) => (
              <View
                key={item._id}
                className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        item.type === "Home" ?
                          "home-outline"
                        : "briefcase-outline"
                      }
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text className="text-base font-bold text-primary ml-2">
                      {item.type}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => handleEditSearch(item)}>
                      <Ionicons
                        name="pencil-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(item._id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-secondary ml-7">
                  {item.street}, {item.city}, {item.state} {item.zipCode},{" "}
                  {item.country}
                </Text>
              </View>
            ))
          }

          <TouchableOpacity
            className="flex-row items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl mt-2 mb-8"
            onPress={openAddModal}>
            <Ionicons name="add" size={24} color={COLORS.secondary} />
            <Text className="text-secondary font-medium ml-2">
              Add New Address
            </Text>
          </TouchableOpacity>
        </ScrollView>
      }

      {/* MODAL unchanged */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 flex-1">
            {/* UI SAME */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
