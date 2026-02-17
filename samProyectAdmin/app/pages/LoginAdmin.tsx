import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { loginAdminDirect } from "../../services/supabase/auth.service";

const LoginAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nombre || !contraseña) {
      Alert.alert("Error", "Rellena todos los campos");
      return;
    }

    try {
      setLoading(true);
      const admin = await loginAdminDirect(nombre, contraseña);
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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🏥</Text>
          </View>
          <Text style={styles.title}>Panel de Administración</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 40,
    width: "100%",
    maxWidth: 450,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e1e4e8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: "#0051D5",
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e1e4e8",
  },
  footerText: {
    fontSize: 13,
    color: "#999",
  },
});

export default LoginAdmin;