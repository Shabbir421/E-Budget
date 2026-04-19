/** @format */

import axios from "axios";
import { Platform } from "react-native";

// 🌐 Base API URL (device + emulator safe)
const LOCAL_API_URL = Platform.select({
  ios: "http://10.211.137.177:3000/api",
  android: "http://10.211.137.177:3000/api",
  default: "http://localhost:3000/api",
});

// 🚀 Axios instance
export const api = axios.create({
  baseURL: LOCAL_API_URL,
});
