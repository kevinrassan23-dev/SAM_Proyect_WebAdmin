import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/PanelControlStyle";

function PanelControl() {

    const asyncronicData = () => {
        router.push({ pathname: "/pages/DisplayGov"});
    }

    const farmaciaData = () => {
        router.push({ pathname: "/pages/DisplayShop"});
    }

    const logout = () => {
        router.push("/pages/LoginAdmin")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Opciones de administrador</Text>

            <View style={styles.formaPagoContainer}>
                <Pressable style={styles.button} onPress={asyncronicData}>
                    <Text style={styles.buttonText}>DATOS ASÍNCRONOS</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={farmaciaData}>
                    <Text style={styles.buttonText}>PEDIDOS Y MEDICAMENTOS</Text>
                </Pressable>

                <Pressable style={styles.buttonVolver} onPress={logout}>
                    <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default PanelControl;