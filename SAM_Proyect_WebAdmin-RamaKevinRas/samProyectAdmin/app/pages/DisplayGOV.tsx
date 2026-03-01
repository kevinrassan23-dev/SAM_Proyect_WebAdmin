import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplayGOVStyle";


function DisplayGOV() {

    const pacientes = () => {
        router.push("/pages/DashboardPacientes");
    }

    const recetas = () => {
        router.push("/pages/DashboardRecetas");
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
                        onPress={pacientes}
                    >
                        <Text style={styles.buttonText}>PACIENTES</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={recetas}
                    >
                        <Text style={styles.buttonText}>RECETAS</Text>
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

export default DisplayGOV;