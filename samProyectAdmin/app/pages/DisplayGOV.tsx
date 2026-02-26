import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplayGOVStyle";


function DisplayGOV() {

    const buscar = () => {
        router.push("/pages/BuscarPacientesRecetas");
    }

    const insertar = () => {
        router.push("/pages/InsertarPacientesRecetas");
    }

    const actualizar = () => {
        router.push("/pages/ActualizarPacientesRecetas");
    }

    const eliminar = () => {
        router.push("/pages/EliminarPacientesRecetas");
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
                        onPress={buscar}
                    >
                        <Text style={styles.buttonText}>BUSCAR</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={insertar}
                    >
                        <Text style={styles.buttonText}>INSERTAR</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={actualizar}
                    >
                        <Text style={styles.buttonText}>ACTUALIZAR</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={eliminar}
                    >
                        <Text style={styles.buttonText}>ELIMINAR</Text>
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