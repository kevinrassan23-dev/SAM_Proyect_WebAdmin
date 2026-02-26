import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme/Theme";
import React from "react";

const { width } = Dimensions.get("window");

const FAMILIAS = {
    Pacientes: [
        { label: "Mostrar pacientes", icon: "list", ruta: "/pages/DisplayGOV" },
        { label: "Insertar paciente", icon: "add-circle-outline", ruta: "/pages/InsertarPaciente" },
        { label: "Actualizar paciente", icon: "edit", ruta: "/pages/ActualizarPaciente" },
        { label: "Eliminar paciente", icon: "delete-outline", ruta: "/pages/EliminarPaciente" },
    ],
    Recetas: [
        { label: "Mostrar recetas", icon: "list", ruta: "/pages/DisplayGOV" },
        { label: "Insertar receta", icon: "add-circle-outline", ruta: "/pages/InsertarReceta" },
        { label: "Actualizar receta", icon: "edit", ruta: "/pages/ActualizarReceta" },
        { label: "Eliminar receta", icon: "delete-outline", ruta: "/pages/EliminarReceta" },
    ],
} as const;

function MenuGOV() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [expandedFamilias, setExpandedFamilias] = useState<Record<string, boolean>>({});
    const positionX = useState(new Animated.Value(-width))[0];

    const abrirMenu = () => {
        setOpen(true);
        Animated.timing(positionX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const cerrarMenu = () => {
        Animated.timing(positionX, {
            toValue: -width,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setOpen(false));
    };

    const toggleFamilia = (familia: string) => {
        setExpandedFamilias(prev => ({
            ...prev,
            [familia]: !prev[familia],
        }));
    };

    const navegar = (ruta: string) => {
        cerrarMenu();
        router.push(ruta as any);
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={abrirMenu}>
                    <MaterialIcons name="menu" size={25} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {open && (
                <TouchableOpacity style={styles.overlay} onPress={cerrarMenu} activeOpacity={1} />
            )}

            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateX: positionX }], display: open ? "flex" : "none" },
                ]}
            >
                <Text style={styles.drawerTitle}>Menú</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.itemsContainer}>

                        {Object.entries(FAMILIAS).map(([familia, opciones]) => {
                            const isExpanded = expandedFamilias[familia];

                            return (
                                <View key={familia} style={styles.familiaContainer}>

                                    <TouchableOpacity
                                        style={styles.familiaHeader}
                                        onPress={() => toggleFamilia(familia)}
                                    >
                                        <View style={styles.familiaHeaderLeft}>
                                            <MaterialIcons
                                                name={familia === "Pacientes" ? "people" : "assignment"}
                                                size={24}
                                                color={theme.colors.primary}
                                            />
                                            <Text style={styles.familiaText}>{familia}</Text>
                                        </View>
                                        <MaterialIcons
                                            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                            size={22}
                                            color={theme.colors.primary}
                                        />
                                    </TouchableOpacity>

                                    {isExpanded && opciones.map((opcion) => (
                                        <TouchableOpacity
                                            key={opcion.label}
                                            style={styles.drawerItem}
                                            onPress={() => navegar(opcion.ruta)}
                                        >
                                            <MaterialIcons
                                                name={opcion.icon as any}
                                                size={20}
                                                color={opcion.icon === "delete-outline" ? theme.colors.error : theme.colors.secondary}
                                            />
                                            <Text style={[
                                                styles.drawerText,
                                                opcion.icon === "delete-outline" && { color: theme.colors.error }
                                            ]}>
                                                {opcion.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}

                                    <View style={styles.separador} />
                                </View>
                            );
                        })}

                    </View>
                </ScrollView>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: theme.colors.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        zIndex: 1000,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#00000066",
        zIndex: 998,
    },
    drawer: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: width * 0.6,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
        paddingHorizontal: theme.spacing(2),
        zIndex: 999,
        elevation: 10,
    },
    drawerTitle: {
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
        marginBottom: theme.spacing(3),
        color: theme.colors.primary,
        paddingBottom: theme.spacing(2),
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    itemsContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
    },
    familiaContainer: {
        width: "100%",
    },
    familiaHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: theme.spacing(1.5),
    },
    familiaHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    familiaText: {
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginLeft: 12,
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing(1),
        paddingLeft: theme.spacing(3),
        width: "100%",
    },
    drawerText: {
        marginLeft: 12,
        fontSize: theme.fontSize.normal,
        color: theme.colors.primary,
        fontWeight: "500",
    },
    separador: {
        width: "100%",
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: theme.spacing(1),
    },
});

export default MenuGOV;