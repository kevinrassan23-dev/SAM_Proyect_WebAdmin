import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { styles } from "@/styles/pages/common/DrawerAdminStyle";
import theme from "@/theme/Theme";

/**
 * UTILERÍA: Genera un timestamp actual para los logs
 */
const getTimestamp = () => new Date().toLocaleString();

// --- Definición de Tipos ---
type SubItem = { label: string; route: string };
type SubMenu = { label: string; items: SubItem[] };
type Section = { 
  label: string; 
  subMenus: SubMenu[]; 
  icon: any; 
  color: string 
};

// --- Configuración de Menús ---
const SECTIONS: Section[] = [
  {
    label: "Administradores",
    color: "#2196F3",
    icon: <MaterialIcons name="admin-panel-settings" size={18} color={theme.colors.secondary} />,
    subMenus: [
      {
        label: "Administradores",
        items: [
          { label: "Insertar", route: "/pages/management/administradores/InsertarAdmin" },
          { label: "Buscar", route: "/pages/management/administradores/BuscarAdmin" },
          { label: "Actualizar", route: "/pages/management/administradores/ActualizarAdmin" },
          { label: "Eliminar", route: "/pages/management/administradores/EliminarAdmin" },
        ],
      },
    ],
  },
  {
    label: "Datos Oficiales",
    color: "#FF9800", 
    icon: <Feather name="user" size={18} color={theme.colors.secondary} />,
    subMenus: [
      {
        label: "Pacientes",
        items: [
          { label: "Insertar", route: "/pages/management/pacientes/InsertarPaciente" },
          { label: "Buscar", route: "/pages/management/pacientes/BuscarPaciente" },
          { label: "Actualizar", route: "/pages/management/pacientes/ActualizarPaciente" },
          { label: "Eliminar", route: "/pages/management/pacientes/EliminarPaciente" },
        ],
      },
      {
        label: "Recetas",
        items: [
          { label: "Insertar", route: "/pages/management/recetas/InsertarReceta" },
          { label: "Buscar", route: "/pages/management/recetas/BuscarReceta" },
          { label: "Actualizar", route: "/pages/management/recetas/ActualizarReceta" },
          { label: "Eliminar", route: "/pages/management/recetas/EliminarReceta" },
        ],
      },
    ],
  },
  {
    label: "Tienda",
    color: theme.colors.primary,
    icon: <FontAwesome6 name="shop" size={14} color={theme.colors.secondary} />,
    subMenus: [
      {
        label: "Medicamentos",
        items: [
          { label: "Insertar", route: "/pages/management/medicamentos/InsertarMedicamento" },
          { label: "Buscar", route: "/pages/management/medicamentos/BuscarMedicamento" },
          { label: "Actualizar", route: "/pages/management/medicamentos/ActualizarMedicamento" },
          { label: "Eliminar", route: "/pages/management/medicamentos/EliminarMedicamento" },
        ],
      },
      {
        label: "Pedidos",
        items: [
          { label: "Mostrar Pedidos", route: "/pages/management/pedidos/MostrarPedidos" },
        ],
      },
    ],
  },
];

type RolAdmin = 'SHOP_ADMIN' | 'GOV_ADMIN' | 'SYSTEM_ADMIN' | 'ADMIN_OWNER';

function DrawerAdmin({ rol }: { rol: RolAdmin }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  // --- Lógica de Interacción ---
  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = (route: string) => {
    console.log(`[${getTimestamp()}] Navegando a: ${route}`);
    setDrawerOpen(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    const { adminAuthService } = await import('@/services/supabase');
    await adminAuthService.logout();
    setDrawerOpen(false);
    // ── Esperar a que el drawer se cierre antes de navegar
    setTimeout(() => {
        router.push("/pages/auth/LoginAdmin");
    }, 200);
  };

  // --- Filtrado por Rol ---
  const seccionesFiltradas = SECTIONS.filter(section => {
    switch (rol) {
      case 'ADMIN_OWNER':
        return true;
      case 'SYSTEM_ADMIN':
        return section.label === "Administradores" || section.label === "Tienda";
      case 'GOV_ADMIN':
        return section.label === "Datos Oficiales";
      case 'SHOP_ADMIN':
        return section.label === "Tienda";
      default:
        console.log(`[${getTimestamp()}] Rol no reconocido: ${rol}`);
        return false;
    }
  });

  return (
    <>
      {/* Boton Hamburguesa */}
      <Pressable onPress={() => setDrawerOpen(true)} style={styles.hamburgerButton}>
        <Ionicons name="menu" size={28} color="#9525D7" />
      </Pressable>

      {/* Overlay al abrir */}
      {drawerOpen && (
        <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)} />
      )}

      {/* Cuerpo del Drawer */}
      {drawerOpen && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>S.A.M-Admin</Text>
            <Pressable onPress={() => setDrawerOpen(false)}>
              <Ionicons name="close" size={26} color={theme.colors.secondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {seccionesFiltradas.map((section) => (
              <View key={section.label}>
                {/* Cabecera de Seccion */}
                <Pressable
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.label)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginRight: 10 }}>{section.icon}</View>
                    <Text style={[styles.sectionLabel, { color: section.color }]}>
                      {section.label.toUpperCase()}
                    </Text>
                  </View>
                  <Ionicons
                    name={openSections[section.label] ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={section.color}
                  />
                </Pressable>

                {/* SubMenús */}
                {openSections[section.label] && section.subMenus.map((subMenu) => {
                  const subKey = `${section.label}-${subMenu.label}`;
                  return (
                    <View key={subKey}>
                      <Pressable
                        style={styles.subMenuHeader}
                        onPress={() => toggleSubMenu(subKey)}
                      >
                        <Ionicons name="folder-outline" size={16} color={theme.colors.secondary} style={{ marginRight: 8 }} />
                        <Text style={styles.subMenuLabel}>{subMenu.label}</Text>
                        <Ionicons
                          name={openSubMenus[subKey] ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={theme.colors.secondary}
                        />
                      </Pressable>

                      {/* Items Finales */}
                      {openSubMenus[subKey] && subMenu.items.map((item) => (
                        <Pressable
                          key={item.route}
                          style={styles.itemButton}
                          onPress={() => navigate(item.route)}
                        >
                          <Ionicons name="chevron-forward" size={14} color="#999" style={{ marginRight: 8 }} />
                          <Text style={styles.itemLabel}>{item.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  );
                })}
              </View>
            ))}

            {/* Logout Footer */}
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.logoutLabel}>CERRAR SESIÓN</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </>
  );
}

export default DrawerAdmin;