/** @format */

import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Optional: axios (only if you later call backend APIs manually)
import axios from "axios";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // 🔐 SIGN IN
  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Email and Password are required");
      return;
    }

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // ✅ SUCCESS
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });


        router.replace("/");
      }

      // 🔐 MFA EMAIL CODE
      else if (signInAttempt.status === "needs_second_factor") {
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });

          setShowEmailCode(true);
        }
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Login Failed", err?.errors?.[0]?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 VERIFY CODE
  const onVerifyPress = async () => {
    if (!isLoaded || !code) {
      Alert.alert("Error", "Enter verification code");
      return;
    }

    setLoading(true);

    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({
          session: attempt.createdSessionId,
        });
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Login successful",
        });

        router.replace("/");
      } else {
        Alert.alert("Error", "Invalid code");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Verification Failed", "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      {!showEmailCode ?
        <>
          {/* BACK */}
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="absolute top-12 left-6 z-10">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* HEADER */}
          <View className="items-center mb-8 px-4">
            <Text className="text-3xl font-bold text-primary mb-2 text-center">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Sign in to continue
            </Text>
          </View>

          {/* EMAIL */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Email</Text>
            <TextInput
              className="w-full bg-gray-100 p-4 rounded-xl text-black"
              placeholder="user@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          {/* PASSWORD */}
          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Password</Text>
            <TextInput
              className="w-full bg-gray-100 p-4 rounded-xl text-black"
              placeholder="********"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* BUTTON */}
          <Pressable
            className={`w-full py-4 rounded-2xl items-center justify-center mb-6 shadow-md ${
              loading || !emailAddress || !password ?
                "bg-gray-300"
              : "bg-blue-600 active:bg-blue-700"
            }`}
            onPress={onSignInPress}
            disabled={loading || !emailAddress || !password}>
            {loading ?
              <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-lg">Sign In</Text>}
          </Pressable>

          {/* FOOTER */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500">Don&apos;t have an account? </Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-primary font-bold">Sign up</Text>
            </Link>
          </View>
        </>
      : <>
          {/* VERIFY */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-primary mb-2">
              Verify Email
            </Text>
            <Text className="text-gray-500 text-center">
              Enter the code sent to your email
            </Text>
          </View>

          <TextInput
            className="w-full bg-gray-100 p-4 rounded-xl text-center text-black tracking-widest mb-6"
            placeholder="123456"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          {/* VERIFY BUTTON */}
          <Pressable
            onPress={onVerifyPress}
            disabled={loading}
            className={`w-full py-4 rounded-2xl items-center justify-center shadow-md ${
              loading ? "bg-gray-300" : "bg-black active:bg-black"
            }`}>
            {loading ?
              <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-lg">Verify</Text>}
          </Pressable>
        </>
      }
    </SafeAreaView>
  );
}
