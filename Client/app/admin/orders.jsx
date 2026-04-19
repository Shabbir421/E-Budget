/** @format */

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "@/constants/api";
import Toast from "react-native-toast-message";

export default function AdminOrders() {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const STATUSES = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await api.get("/orders/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ORDERS API:", data);

      setOrders(Array.isArray(data) ? data : data?.orders || []);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Orders fetched",
      })
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch orders",
      });
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);
  };

  const updateStatus = async (newStatus) => {
    if (!selectedOrder) return;

    setUpdating(true);

    try {
      const token = await getToken();

      const data = await api.put(
        `/orders/${selectedOrder._id}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Order status updated",
        });
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, orderStatus: newStatus } : o,
        ),
      );

      setStatusModalVisible(false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update order status",
      })
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (value) => Number(value || 0).toFixed(2);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* LIST */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {orders.length === 0 ?
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-secondary">No orders found</Text>
          </View>
        : orders.map((order) => (
            <View
              key={`${item._id}-${index}`}
              className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
              {/* ORDER INFO */}
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400 text-sm">
                  Order ID: #{order._id}
                </Text>
                <Text className="text-secondary text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {/* CUSTOMER */}
              <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                <Text className="text-xs text-secondary font-bold mb-1">
                  CUSTOMER
                </Text>

                <Text className="text-primary font-medium">
                  {order.user?.name || "Unknown User"}
                </Text>

                <Text className="text-secondary text-xs">
                  {order.user?.email || "No email"}
                </Text>
              </View>

              {/* SHIPPING */}
              <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                <Text className="text-xs text-secondary font-bold mb-1">
                  SHIPPING ADDRESS
                </Text>

                <Text className="text-primary text-xs">
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </Text>

                <Text className="text-primary text-xs">
                  {order.shippingAddress?.state},{" "}
                  {order.shippingAddress?.zipCode},{" "}
                  {order.shippingAddress?.country}
                </Text>
              </View>

              {/* ITEMS */}
              <View className="mb-3">
                <Text className="text-xs text-secondary font-bold mb-2">
                  ITEMS
                </Text>

                {(order.items || []).map((item, index) => (
                  <View
                    key={`${item._id}-${index}`}
                    className="flex-row justify-between mb-1">
                    <Text className="text-secondary text-xs flex-1">
                      {item.quantity}x {item.product?.name || item.name}
                      {item.size ?
                        <Text className="text-gray-400"> ({item.size})</Text>
                      : null}
                    </Text>

                    <Text className="text-secondary text-xs font-bold">
                      ${formatPrice(item.price)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* FOOTER */}
              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
                <Text className="text-primary font-bold text-lg">
                  ${formatPrice(order.totalAmount)}
                </Text>

                <TouchableOpacity
                  onPress={() => openStatusModal(order)}
                  className={`flex-row items-center px-4 py-2 rounded-full ${getStatusColor(
                    order.orderStatus,
                  )}`}>
                  <Text className="text-xs font-bold mr-2 uppercase">
                    {order.orderStatus}
                  </Text>

                  <Ionicons name="pencil" size={12} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        }
      </ScrollView>

      {/* STATUS MODAL */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-2xl p-4 max-h-[60%]">
              {/* HEADER */}
              <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-primary">
                  Update Order Status
                </Text>

                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>

              {updating ?
                <View className="py-8">
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text className="text-center text-secondary mt-2">
                    Updating...
                  </Text>
                </View>
              : <FlatList
                  data={STATUSES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => updateStatus(item)}
                      className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${
                        selectedOrder?.orderStatus === item ?
                          "bg-primary/10"
                        : "bg-gray-50"
                      }`}>
                      <Text
                        className={`capitalize ${
                          selectedOrder?.orderStatus === item ?
                            "text-primary font-bold"
                          : "text-secondary"
                        }`}>
                        {item}
                      </Text>

                      {selectedOrder?.orderStatus === item && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
