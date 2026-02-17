// pages/LoginAdmin.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { loginAdminDirect } from "../../services/supabase/auth.service";

const LoginAdmin = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert("Error", "Rellena todos los campos");
      return;
    }

    try {
      setLoading(true);
      const admin = await loginAdminDirect(usuario, password);
      console.log("Login exitoso:", admin);
      router.replace("/pages/PanelControl");
    } catch (error: any) {
      console.error("Error completo:", error);
      Alert.alert("Login incorrecto", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
        Login Administrador
      </Text>

      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          marginBottom: 15,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#007AFF",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {loading ? "Entrando..." : "LOGIN"}
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginAdmin;