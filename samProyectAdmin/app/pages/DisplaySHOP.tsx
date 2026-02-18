/**
 * Administramos los datos de las tablas de Supabase
 * 
 * (El archivo debe ser en formato .json)
 */


// He copiado el código de DisplayGOV y lo he ajustado para que se adapte a la gestión de pedidos y medicamentos.

import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/DisplaySHOPStyle";


function DisplaySHOP() {

    const [MostrarDatosPedidos, setMostrarDatosPedidos] = useState(false);
    const [MostrarDatosMedicamentos, setMostrarDatosMedicamentos] = useState(false);


    const DatosMostradosPedidos = () => {
        setMostrarDatosPedidos(true)
        setMostrarDatosMedicamentos(false)
    }

    const DatosMostradosMedicamentos = () => {
        setMostrarDatosMedicamentos(true)
        setMostrarDatosPedidos(false)
    }

    const DejarDatosMostrados = () => {
        setMostrarDatosPedidos(false)
        setMostrarDatosMedicamentos(false)
    }

    const volver = () => {
        router.push({ pathname: "/pages/PanelControl" });
    }


    return (
        <View style={styles.container}>

            <Text style={styles.title}>PEDIDOS Y MEDICAMENTOS</Text>

            {MostrarDatosPedidos &&
                (<View style={styles.listContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        <Text style={styles.title}>DATOS DE PACIENTE</Text>
                        <Text style={styles.title}>DATOS DE TIPO DE PACIENTE</Text>
                        <Text style={styles.title}>DATOS DE DESCUENTO APLICADO</Text>
                        <Text style={styles.title}>DATOS DE PRECIO TOTAL</Text>
                        <Text style={styles.title}>DATOS DE ESTADO DEL PEDIDO</Text>
                        <Text style={styles.title}>DATOS DE FECHA Y HORA</Text>
                    </ScrollView>
                </View>)}

                {MostrarDatosMedicamentos &&
                (<View style={styles.listContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        <Text style={styles.title}>DATOS DE NOMBRE</Text>
                        <Text style={styles.title}>DATOS DE MARCA</Text>
                        <Text style={styles.title}>DATOS DE PRECIO</Text>
                        <Text style={styles.title}>DATOS DE DESCRIPCIÓN</Text>
                        <Text style={styles.title}>DATOS DE FAMILIA</Text>
                        <Text style={styles.title}>DATOS DE STOCK</Text>
                        <Text style={styles.title}>DATOS DE ACTIVO</Text>
                        <Text style={styles.title}>DATOS DE TIPO</Text>

                    </ScrollView>
                </View>)}


            <View style={styles.vista}>

                <Pressable style={[styles.button]} onPress={DatosMostradosPedidos}>
                    <Text style={styles.buttonText}>MOSTRAR PEDIDOS</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={DatosMostradosMedicamentos}>
                    <Text style={styles.buttonText}>MOSTRAR MEDICAMENTOS</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={DejarDatosMostrados}>
                    <Text style={styles.buttonText}>DEJAR DE MOSTRAR DATOS</Text>
                </Pressable>

                <Pressable style={[styles.button]}>
                    <Text style={styles.buttonText}>INSERTAR</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={volver}>
                    <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>

            </View>
        </View >
    );
}

export default DisplaySHOP;