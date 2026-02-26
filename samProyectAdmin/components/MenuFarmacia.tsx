import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme/Theme";

const { height } = Dimensions.get("window");

const OPCIONES = [
    { label: "Mostrar medicamentos y pedidos", icon: "list", ruta: "/pages/DisplaySHOP" },
    { label: "Insertar medicamento", icon: "add-circle-outline", ruta: "/pages/InsertarMedicamento" },
    { label: "Actualizar medicamento", icon: "edit", ruta: "/pages/ActualizarMedicamento" },
    { label: "Eliminar medicamento", icon: "delete-outline", ruta: "/pages/EliminarMedicamento" },
];

interface MenuFarmaciaProps {
    visible: boolean;
    onClose: () => void;
    onSelectOption: (ruta: string) => void;
}

function MenuFarmacia({ visible, onClose, onSelectOption }: MenuFarmaciaProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* OVERLAY NEGRO */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            />

            {/* PANEL DESDE ABAJO */}
            <View style={styles.modalContainer}>
                <View style={styles.panel}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Opciones de Medicamentos</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {OPCIONES.map((opcion) => (
                        <TouchableOpacity
                            key={opcion.label}
                            style={styles.opcionButton}
                            onPress={() => {
                                onSelectOption(opcion.ruta);
                                onClose();
                            }}
                        >
                            <MaterialIcons
                                name={opcion.icon as any}
                                size={24}
                                color={opcion.icon === "delete-outline" ? theme.colors.error : theme.colors.secondary}
                            />
                            <Text
                                style={[
                                    styles.opcionText,
                                    opcion.icon === "delete-outline" && { color: theme.colors.error }
                                ]}
                            >
                                {opcion.label}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#00000099",
        zIndex: 998,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
    },

    panel: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: theme.spacing(3),
        paddingHorizontal: theme.spacing(2),
        maxHeight: height * 0.7,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.primary,
    },

    opcionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing(2),
        paddingHorizontal: theme.spacing(1.5),
        borderRadius: 10,
        marginVertical: theme.spacing(0.5),
        backgroundColor: "#f5f5f5",
    },

    opcionText: {
        marginLeft: theme.spacing(2),
        fontSize: 16,
        color: theme.colors.secondary,
        fontWeight: "500",
    },

    cancelButton: {
        marginTop: theme.spacing(3),
        paddingVertical: theme.spacing(1.5),
        backgroundColor: theme.colors.error,
        borderRadius: 10,
        alignItems: "center",
    },

    cancelText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MenuFarmacia;