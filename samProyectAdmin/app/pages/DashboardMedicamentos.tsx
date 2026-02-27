import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DashboardMedicamentosStyle";

function DashboardRecetas() {

    const insertar = () => {
        router.push("/pages/InsertarMedicamento");
    }

    const buscar = () => {
        router.push("/pages/BuscarMedicamento");
    }

    const actualizar = () => {
        router.push("/pages/ActualizarMedicamento");
    }

    const eliminar = () => {
        router.push("/pages/EliminarMedicamento");
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
                        <Text style={styles.buttonText}>INSERTAR MEDICAMENTO</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={buscar}
                    >
                        <Text style={styles.buttonText}>BUSCAR MEDICAMENTO</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={actualizar}
                    >
                        <Text style={styles.buttonText}>ACTUALIZAR MEDICAMENTO</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={eliminar}
                    >
                        <Text style={styles.buttonText}>ELIMINAR MEDICAMENTO</Text>
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

export default DashboardRecetas;