/** @format */

import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { COLORS } from "@/constants";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ SIGN UP
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password || !firstName) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill all required fields",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);

      Toast.show({
        type: "success",
        text1: "Verification sent",
        text2: "Check your email",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: err?.errors?.[0]?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY EMAIL
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code) {
      Toast.show({
        type: "error",
        text1: "Enter Code",
        text2: "Verification code is required",
      });
      return;
    }

    setLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (attempt.status === "complete") {
        await setActive({
          session: attempt.createdSessionId,
        });

        router.replace("/");
      } else {
        Toast.show({
          type: "error",
          text1: "Verification incomplete",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-10">
      {!pendingVerification ?
        <>
          {/* BACK */}
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="absolute top-12 left-6 z-10">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* HEADER */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-primary mb-2">
              Create Account
            </Text>
            <Text className="text-base text-gray-600 text-center w-full">
              Sign up to get started
            </Text>
          </View>

          {/* FIRST NAME */}
          <TextInput
            className="bg-gray-100 p-4 rounded-xl mb-3"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* LAST NAME */}
          <TextInput
            className="bg-gray-100 p-4 rounded-xl mb-3"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* EMAIL */}
          <TextInput
            className="bg-gray-100 p-4 rounded-xl mb-3"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          {/* PASSWORD */}
          <TextInput
            className="bg-gray-100 p-4 rounded-xl mb-6"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* BUTTON */}
          <Pressable
            className={`w-full py-4 rounded-2xl items-center justify-center mb-6 shadow-md ${
              loading || !emailAddress || !password ?
                "bg-gray-300"
              : "bg-blue-600 active:bg-blue-700"
            }`}
            onPress={onSignUpPress}
            disabled={loading || !emailAddress || !password}>
            {loading ?
              <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-lg tracking-wide">
                Sign Up
              </Text>
            }
          </Pressable>

          {/* FOOTER */}
          <View className="flex-row justify-center">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-primary font-bold">Login</Text>
            </Link>
          </View>
        </>
      : <>
          {/* BACK */}
          <TouchableOpacity
            onPress={() => setPendingVerification(false)}
            className="absolute top-12 left-6 z-10">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

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
            className="bg-gray-100 p-4 rounded-xl text-center tracking-widest mb-6"
            placeholder="123456"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          {/* VERIFY BUTTON */}
          <Pressable
            onPress={onVerifyPress}
            disabled={loading}
            className={`w-full py-2 rounded-2xl items-center justify-center shadow-md ${
              loading ? "bg-gray-300" : "bg-black active:bg-black"
            }`}>
            {loading ?
              <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-lg tracking-wide">
                Verify
              </Text>
            }
          </Pressable>

          {/* RESEND */}
          <Pressable
            onPress={async () => {
              if (loading) return;

              await signUp?.prepareEmailAddressVerification({
                strategy: "email_code",
              });

              Toast.show({
                type: "success",
                text1: "Code Resent",
              });
            }}
            disabled={loading}
            className={`w-full py-2 rounded-2xl items-center justify-center mt-4 shadow-md ${
              loading ? "bg-gray-300" : "bg-black active:bg-black"
            }`}>
            <Text className="text-white font-semibold text-lg tracking-wide">
              Resend Code
            </Text>
          </Pressable>
        </>
      }
    </SafeAreaView>
  );
}
