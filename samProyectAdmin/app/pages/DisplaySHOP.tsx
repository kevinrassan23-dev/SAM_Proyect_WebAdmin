import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplaySHOPStyle";

function DisplaySHOP() {

    const buscar = () => {
        router.push("/pages/BuscarMedicamentosPedidos");
    }

    const insertar = () => {
        router.push("/pages/InsertarMedicamentos");
    }

    const actualizar = () => {
        router.push("/pages/ActualizarMedicamentos");
    }

    const eliminar = () => {
        router.push("/pages/EliminarMedicamentos");
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
                        <Text style={styles.buttonText}>BUSCAR MEDICAMENTOS</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={insertar}
                    >
                        <Text style={styles.buttonText}>INSERTAR MEDICAMENTOS</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={actualizar}
                    >
                        <Text style={styles.buttonText}>ACTUALIZAR MEDICAMENTOS</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={eliminar}
                    >
                        <Text style={styles.buttonText}>ELIMINAR MEDICAMENTOS</Text>
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