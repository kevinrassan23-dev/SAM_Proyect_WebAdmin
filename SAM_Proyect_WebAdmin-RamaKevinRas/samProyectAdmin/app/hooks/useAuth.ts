import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAuth() {
  useEffect(() => {
    const verificar = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace({
          pathname: "/pages/ErrorPage",
          params: {
            codigo: "401",
            mensaje: "No tienes permiso para acceder a esta página.",
            reference: "UNAUTHORIZED",
          },
        });
      }
    };
    verificar();
  }, []);
}