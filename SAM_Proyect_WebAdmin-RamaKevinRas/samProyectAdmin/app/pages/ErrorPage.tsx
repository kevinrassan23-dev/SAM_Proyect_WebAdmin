import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { styles } from "../../styles/ErrorPageStyle";

const LottieView = Platform.OS !== "web" ? require("lottie-react-native").default : null;

function ErrorPage() {
    const { codigo, mensaje, reference } = useLocalSearchParams();

    const getErrorMessage = () => {
        switch (codigo) {
            case "400": return "Solicitud no válida. Por favor, revise los datos de su pedido nuevamente.";
            case "404": return "El sitio solicitado no se encuentra.";
            case "406": return "El servicio rechazó esta solicitud.";
            case "408": return "La solicitud tardó demasiado. Inténtelo de nuevo.";
            case "409": return "Hubo un conflicto con su solicitud de pedido.";
            case "422": return "Los datos no coinciden. Por favor, revise nuevamente la información ingresada.";
            case "429": return "Servidor saturado. Espere un momento e inténtelo nuevamente.";
            case "500": return "Error interno del servidor. Inténtelo más tarde.";
            case "502": return "Error de conexión con el servidor.";
            case "503": return "Servicio temporalmente no disponible.";
            case "504": return "Tiempo de espera agotado para esta solicitud.";
            default: return mensaje || "Ha ocurrido un error inesperado.";
        }
    };

    // Animación web con HTML/CSS puro
    const WebAnimation = () => (
        <div
            dangerouslySetInnerHTML={{
                __html: `
                <style>
                    .error-icon-container {
                        width: 150px;
                        height: 150px;
                        position: relative;
                        margin: 0 auto 20px auto;
                    }
                    .circle {
                        width: 150px;
                        height: 150px;
                        border-radius: 50%;
                        border: 6px solid #e74c3c;
                        animation: pulse 1.5s ease-in-out infinite;
                    }
                    .cross {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 70px;
                        color: #e74c3c;
                        animation: shake 1.5s ease-in-out infinite;
                    }
                    @keyframes pulse {
                        0%   { transform: scale(1);   opacity: 1; }
                        50%  { transform: scale(1.1); opacity: 0.7; }
                        100% { transform: scale(1);   opacity: 1; }
                    }
                    @keyframes shake {
                        0%   { transform: translate(-50%, -50%) rotate(0deg); }
                        25%  { transform: translate(-50%, -50%) rotate(10deg); }
                        50%  { transform: translate(-50%, -50%) rotate(0deg); }
                        75%  { transform: translate(-50%, -50%) rotate(-10deg); }
                        100% { transform: translate(-50%, -50%) rotate(0deg); }
                    }
                </style>
                <div class="error-icon-container">
                    <div class="circle"></div>
                    <span class="cross">✕</span>
                </div>
                `
            }}
        />
    );

    return (
        <View style={styles.container}>

            {/* Lottie en móvil, animación CSS en web */}
            {Platform.OS !== "web" && LottieView ? (
                <LottieView
                    source={require("../../assets/lottie/ErrorIcon.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            ) : (
                <WebAnimation />
            )}

            <Text style={styles.codigo}>{codigo || "ERROR"}</Text>
            <Text style={styles.mensaje}>{getErrorMessage()}</Text>
            <Text style={styles.ref}>Reference: {reference || "N/A"}</Text>

            <Pressable style={styles.button} onPress={() => router.push("/pages/LoginAdmin")}>
                <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
        </View>
    );
}

export default ErrorPage;