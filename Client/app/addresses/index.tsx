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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setAddresses(dummyAddress as any);
    setLoading(false);
  };

  const handleEditSearch = (item: Address) => {
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

  const handleSaveAddress = async () => {
    setModalVisible(false);
    resetForm();
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: string) => {};

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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-4">
          {addresses.length === 0 ? (
            <Text className="text-center text-secondary mt-10">
              No addresses found
            </Text>
          ) : (
            addresses.map((item) => (
              <View
                key={item._id}
                className="bg-white p-4 rounded-xl mb-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        item.type === "Home"
                          ? "home-outline"
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
                      onPress={() => handleDeleteAddress(item._id)}
                    >
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
          )}

          <TouchableOpacity
            className="flex-row items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl mt-2 mb-8"
            onPress={openAddModal}
          >
            <Ionicons name="add" size={24} color={COLORS.secondary} />
            <Text className="text-secondary font-medium ml-2">
              Add New Address
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 flex-1">

            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-primary">
                {isEditing ? "Edit Address" : "Add New Address"}
              </Text>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* FORM */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <Text className="font-medium mb-2">Label</Text>

              <View className="flex-row gap-3 mb-4">
                {["Home", "Work", "Other"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className={`px-4 py-2 rounded-full border ${
                      type === t
                        ? "bg-black border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <Text
                      className={type === t ? "text-white" : "text-black"}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="font-medium mb-2">Street Address</Text>
              <TextInput
                className="border border-gray-200 p-3 rounded-xl mb-4"
                value={street}
                onChangeText={setStreet}
                placeholder="123 Main St"
              />

              <Text className="font-medium mb-2">City</Text>
              <TextInput
                className="border border-gray-200 p-3 rounded-xl mb-4"
                value={city}
                onChangeText={setCity}
              />

              <Text className="font-medium mb-2">State</Text>
              <TextInput
                className="border border-gray-200 p-3 rounded-xl mb-4"
                value={state}
                onChangeText={setState}
              />

              <Text className="font-medium mb-2">Zip Code</Text>
              <TextInput
                className="border border-gray-200 p-3 rounded-xl mb-4"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
              />

              <Text className="font-medium mb-2">Country</Text>
              <TextInput
                className="border border-gray-200 p-3 rounded-xl mb-4"
                value={country}
                onChangeText={setCountry}
              />

              {/* SAVE BUTTON */}
              <TouchableOpacity
                className="bg-black py-4 rounded-full mt-6"
                onPress={handleSaveAddress}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    Save Address
                  </Text>
                )}
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}