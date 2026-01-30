/**
 * Administramos los datos de las colecciones de Firebase
 * 
 * (El archivo debe ser en formato .json)
 * 
 * (SOLO MOSTRAR DATOS MÍNIMOS)
 */



import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import customTheme from "../theme/Theme";


function DisplayGov() {

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


            <View style={{ flexDirection: 'column', gap: customTheme.spacing(2), justifyContent: "center", alignItems: "center" }}>

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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: customTheme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: customTheme.colors.background,
    },
    title: {
        fontSize: customTheme.fontSize.title,
        fontWeight: "bold",
        color: customTheme.colors.primary,
        marginVertical: customTheme.spacing(3),
        textAlign: "center",
    },

    button: {
        backgroundColor: customTheme.colors.secondary,
        width: "358%",
        flexDirection: "row",
        paddingVertical: customTheme.spacing(2),
        borderRadius: 10,
        marginBottom: customTheme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: customTheme.colors.textSecondary,
        fontSize: customTheme.fontSize.large,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    input: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: customTheme.colors.success,
        borderRadius: 8,
        padding: customTheme.spacing(1.5),
        fontSize: customTheme.fontSize.normal,
        color: customTheme.colors.textPrimary,
        marginBottom: customTheme.spacing(2),
    },

    listContainer: {
        marginBottom: 30,
        justifyContent: "center",
        alignContent: "center",
        width: "70%",
        height: "60%",
        borderWidth: 2,
        borderColor: customTheme.colors.success,
        borderRadius: 10,
        backgroundColor: "#fff",
        paddingVertical: customTheme.spacing(1),
    },

    scrollContent: {
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: customTheme.spacing(2),
    }
});

export default DisplayGov;