/** @format */

import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "@/constants/api";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ SAFE INITIAL STATE
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const fetchStats = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res?.data?.data;
      console.log("ADMIN STATS:", data);

      // ✅ SAFE SET (NEVER TRUST API)
      setStats({
        totalUsers: data?.totalUsers || 0,
        totalProducts: data?.totalProducts || 0,
        totalOrders: data?.totalOrders || 0,
        totalRevenue: data?.totalRevenue || 0,
        recentOrders:
          Array.isArray(data?.recentOrders) ? data.recentOrders : [],
      });
    } catch (error) {
      console.log("API ERROR:", error?.response?.data || error.message);

      // fallback safety
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // loading UI
  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* OVERVIEW */}
      <View className="mb-8">
        <Text className="text-primary font-bold text-2xl mb-4">Overview</Text>

        <View className="flex-row flex-wrap justify-between">
          <StatCard
            label="Total Revenue"
            value={`₹${Number(stats.totalRevenue || 0).toFixed(2)}`}
          />
          <StatCard
            label="Total Orders"
            value={String(stats.totalOrders || 0)}
          />
          <StatCard label="Products" value={String(stats.totalProducts || 0)} />
          <StatCard label="Users" value={String(stats.totalUsers || 0)} />
        </View>
      </View>

      {/* RECENT ORDERS */}
      <View className="mb-6">
        <Text className="text-primary font-bold text-2xl mb-4">
          Recent Orders
        </Text>

        {/* ✅ SAFE LENGTH CHECK */}
        {(stats.recentOrders || []).length === 0 ?
          <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center">
            <Text className="text-secondary">No recent orders</Text>
          </View>
        : (stats.recentOrders || []).map((order, index) => (
            <View
              key={`${item._id}-${index}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 mb-3">
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className="font-bold text-primary text-base">
                    Total Products :{" "}
                    {order.items?.reduce(
                      (acc, item) => acc + (item.quantity || 0),
                      0,
                    )}
                  </Text>

                  <Text className="text-secondary text-xs mt-1">
                    {order.createdAt ?
                      new Date(order.createdAt).toLocaleDateString()
                    : ""}
                  </Text>
                </View>

                <View
                  className={`px-3 py-1.5 rounded-full ${getStatusColor(
                    order.orderStatus,
                  )}`}>
                  <Text className="text-[10px] font-bold uppercase">
                    {order.orderStatus}
                  </Text>
                </View>
              </View>

              <View className="pb-2">
                {order.items?.map((item, index) => (
                  <Text
                    key={`${item._id}-${index}`}
                    className="text-secondary text-xs mt-1">
                    {item.name} x {item.quantity}
                  </Text>
                ))}
              </View>

              <View className="h-[1px] bg-gray-100 mb-3" />

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
                    <Text className="text-primary font-bold text-xs">
                      {(order.user?.name || "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <Text className="text-secondary text-sm">
                    {order.user?.name || "Unknown User"}
                  </Text>
                </View>

                <Text className="text-primary font-bold text-lg">
                  {Number(order.totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}

/* ✅ STAT CARD */
const StatCard = ({ label, value }) => (
  <View className="bg-white p-5 rounded-2xl border border-gray-100 w-[48%] mb-4">
    <Text className="text-xl font-bold text-primary mb-1">{value}</Text>
    <Text className="text-secondary text-xs uppercase">{label}</Text>
  </View>
);
