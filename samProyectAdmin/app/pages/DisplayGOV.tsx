/**
 * Administramos los datos de las colecciones de Firebase
 * 
 * (El archivo debe ser en formato .json)
 * 
 * (SOLO MOSTRAR DATOS MÍNIMOS)
 */

import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplayGOVStyle";


function DisplayGOV() {

    const [MostrarDatos, setMostrarDatos] = useState(false);


    const DatosMostrados = () => {
        setMostrarDatos(true)
    }

    const DejarDatosMostrados = () => {
        setMostrarDatos(false)
    }

    const volver = () => {
        router.push({ pathname: "/pages/PanelControl" });
    }


    return (
        <View style={styles.container}>

            <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>

            {MostrarDatos &&
                (<View style={styles.listContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>
                        <Text style={styles.title}>DATOS GUBERNAMENTALES</Text>


                    </ScrollView>
                </View>)}


            <View style={styles.vista}>

                <Pressable style={[styles.button]} onPress={DatosMostrados}>
                    <Text style={styles.buttonText}>MOSTRAR DATOS</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={DejarDatosMostrados}>
                    <Text style={styles.buttonText}>DEJAR DE MOSTRAR DATOS</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={volver}>
                    <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>

            </View>
        </View >
    );
}

export default DisplayGOV;