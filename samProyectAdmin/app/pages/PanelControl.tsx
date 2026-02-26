import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/PanelControlStyle";

function PanelControl() {

    const asyncronicData = () => {
        router.push("/pages/DisplayGOV");
    }

    const farmaciaData = () => {
        router.push("/pages/DisplaySHOP");
    }

    const logout = async () => {
        router.replace("/pages/LoginAdmin");
    }

    return (
        <View style={styles.container}>
            <View style={styles.panelControlContainer}>

                <Text style={styles.title}>OPCIONES:</Text>
                
                <Pressable style={styles.button} onPress={asyncronicData}>
                    <Text style={styles.buttonText}>DATOS OFICIALES</Text>
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