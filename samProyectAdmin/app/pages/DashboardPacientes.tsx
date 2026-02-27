import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DashboardPacientesStyle";

function DashboardPacientes() {

    const insertar = () => {
        router.push("/pages/InsertarPaciente");
    }

    const buscar = () => {
        router.push("/pages/BuscarPaciente");
    }

    const actualizar = () => {
        router.push("/pages/ActualizarPaciente");
    }

    const eliminar = () => {
        router.push("/pages/EliminarPaciente");
    }

    const volver = () => {
        router.push("/pages/PanelControl");
    }

    return (
        <ScrollView style={styles.outerScroll} contentContainerStyle={styles.outerScrollContent}>
            <View style={styles.container}>

                <Text style={styles.title}>OPCIONES:</Text>
                
                <View style={styles.vista}>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={insertar}
                    >
                        <Text style={styles.buttonText}>INSERTAR PACIENTE</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={buscar}
                    >
                        <Text style={styles.buttonText}>BUSCAR PACIENTE</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={actualizar}
                    >
                        <Text style={styles.buttonText}>ACTUALIZAR PACIENTE</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={eliminar}
                    >
                        <Text style={styles.buttonText}>ELIMINAR PACIENTE</Text>
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

export default DashboardPacientes;