import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DashboardRecetasStyle";

function DashboardRecetas() {

    const insertar = () => {
        router.push("/pages/InsertarReceta");
    }

    const buscar = () => {
        router.push("/pages/BuscarReceta");
    }

    const actualizar = () => {
        router.push("/pages/ActualizarReceta");
    }

    const eliminar = () => {
        router.push("/pages/EliminarReceta");
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
                        <Text style={styles.buttonText}>INSERTAR RECETA</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={buscar}
                    >
                        <Text style={styles.buttonText}>BUSCAR RECETA</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={actualizar}
                    >
                        <Text style={styles.buttonText}>ACTUALIZAR RECETA</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.button]} 
                        onPress={eliminar}
                    >
                        <Text style={styles.buttonText}>ELIMINAR RECETA</Text>
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