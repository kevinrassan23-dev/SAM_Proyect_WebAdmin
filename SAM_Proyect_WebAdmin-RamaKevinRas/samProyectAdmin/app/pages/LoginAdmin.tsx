import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/LoginAdminStyle";
import { adminAuthService, validators } from "@/services/supabase";

function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateFields = (): boolean => {
        const emailErr = validators.email(email);
        const passwordErr = validators.password(password);

        setEmailError(emailErr ?? '');
        setPasswordError(passwordErr ?? '');

        return !emailErr && !passwordErr;
    };

    const handleLogin = async () => {
        if (!validateFields()) return;

        try {
            setLoading(true);
            await adminAuthService.login(email, password);
            router.push("/pages/PanelControl");
        } catch (error: any) {
            Alert.alert("Error", error.message);
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
                    <Text style={styles.title}>Login de Administración</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            placeholder="Ingresa tu email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={[styles.input, emailError ? styles.inputError : null]}
                            placeholderTextColor="#999"
                        />
                        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña:</Text>
                        <TextInput
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            style={[styles.input, passwordError ? styles.inputError : null]}
                            placeholderTextColor="#999"
                        />
                        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            loading && styles.buttonDisabled,
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Iniciando..." : "Iniciar Sesión"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default LoginAdmin;