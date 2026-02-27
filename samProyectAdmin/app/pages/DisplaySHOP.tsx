import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplaySHOPStyle";

function DisplaySHOP() {

    const pedidos = () => {
        router.push("/pages/MostrarPedidos");
    }

    const medicamentos = () => {
        router.push("/pages/DashboardMedicamentos");
    }

    const volver = () => {
        router.push("/pages/PanelControl");
    }

    return (
        <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
            <View style={styles.container}>
                <View style={styles.vista}>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={pedidos}
                    >
                        <Text style={styles.buttonText}>PEDIDOS</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={medicamentos}
                    >
                        <Text style={styles.buttonText}>MEDICAMENTOS</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={volver}
                    >
                        <Text style={styles.buttonText}>VOLVER</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

export default DisplaySHOP;