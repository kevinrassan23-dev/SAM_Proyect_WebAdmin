import { Platform, StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
  outerScroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  outerScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: theme.spacing(2),
    ...(Platform.OS === "web" && {
      paddingVertical: theme.spacing(3),
    }),
  },

  container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    minHeight: "100vh" as any,
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: "100%",
      padding: theme.spacing(3),
    }),
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginVertical: theme.spacing(3),
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 32,
      marginVertical: theme.spacing(4),
    }),
  },

  subtitle: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginVertical: theme.spacing(2),
    textAlign: "center",
  },

  subtitleSmall: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing(1),
  },

  formContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: theme.spacing(3),
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 600,
      padding: theme.spacing(4),
    }),
  },

  inputGroup: {
    marginBottom: theme.spacing(2),
  },

  label: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(1),
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background,
  },

  botonesBusqueda: {
    flexDirection: "row",
    gap: 8,
    marginBottom: theme.spacing(2),
  },

  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    borderRadius: 8,
    marginVertical: theme.spacing(2),
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },

  selectAllText: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },

  listaContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: theme.spacing(2),
    maxHeight: 400,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: theme.spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  itemContainerSelected: {
    backgroundColor: "#f0f7ff",
  },

  itemContent: {
    flex: 1,
  },

  itemTitulo: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing(0.25),
  },

  itemMarca: {
    fontSize: theme.fontSize.normal,
    color: "#666",
    marginBottom: theme.spacing(0.5),
  },

  itemTexto: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing(0.25),
  },

  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(0.75),
  },

  itemPrecio: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },

  stockBadge: {
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(1),
    borderRadius: 6,
  },

  stockTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  advertenciaContainer: {
    backgroundColor: "#FFE6E6",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    borderRadius: 10,
    padding: theme.spacing(3),
    alignItems: "center",
    marginVertical: theme.spacing(2),
  },

  advertenciaTitulo: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginTop: theme.spacing(1),
  },

  advertenciaTexto: {
    fontSize: theme.fontSize.normal,
    color: "#cc0000",
    textAlign: "center",
    marginTop: theme.spacing(1),
  },

  listaConfirmacion: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: theme.spacing(2),
    marginVertical: theme.spacing(2),
  },

  itemConfirmacion: {
    backgroundColor: "#fff",
    padding: theme.spacing(1.5),
    borderRadius: 6,
    marginVertical: theme.spacing(0.75),
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },

  itemConfirmacionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing(0.75),
  },

  itemConfirmacionTitulo: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },

  itemConfirmacionMarca: {
    fontSize: theme.fontSize.normal,
    color: "#666",
    marginTop: theme.spacing(0.25),
  },

  itemConfirmacionPrecio: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },

  itemConfirmacionTexto: {
    fontSize: theme.fontSize.normal,
    color: "#666",
    marginVertical: theme.spacing(0.25),
  },

  resumenEliminacion: {
    backgroundColor: "#fff3e0",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    padding: theme.spacing(2),
    borderRadius: 8,
    marginVertical: theme.spacing(2),
  },

  resumenTitulo: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: theme.spacing(1),
  },

  resumenFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing(0.75),
    borderBottomWidth: 1,
    borderBottomColor: "#ffe0b2",
  },

  resumenLabel: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },

  resumenValor: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    color: "#e65100",
  },

  button: {
    backgroundColor: theme.colors.secondary,
    flex: 1,
    flexDirection: "row",
    paddingVertical: theme.spacing(2),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: theme.spacing(1),
    ...(Platform.OS === "web" && {
      paddingVertical: theme.spacing(2.5),
      cursor: "pointer" as any,
      transition: "all 0.3s ease" as any,
    }),
  },

  buttonDelete: {
    backgroundColor: theme.colors.error,
    flex: undefined,
    width: "100%",
  },

  buttonSearch: {
    backgroundColor: theme.colors.primary,
  },

  buttonInfo: {
    backgroundColor: "#2196F3",
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
    flex: undefined,
    width: "100%",
  },

  buttonCancel: {
    backgroundColor: theme.colors.error,
    flex: undefined,
    width: "100%",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    textAlign: "center",
    ...(Platform.OS === "web" && {
      fontSize: 14,
    }),
  },

  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginBottom: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
    fontWeight: "500",
    backgroundColor: "#ffe6e6",
    padding: theme.spacing(1.5),
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },

  botonesContainer: {
    marginTop: theme.spacing(2),
    gap: 8,
  },
});