/** @format */

import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait until Clerk finishes loading auth state
  if (!isLoaded) {
    return null;
  }

  // If user is already signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  // Otherwise show auth stack (login/signup screens)
  return <Stack screenOptions={{ headerShown: false }} />;
}
