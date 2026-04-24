import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router } from "expo-router";
import { styles } from "@/styles/pages/auth/LoginAdminStyle";
import { adminAuthService, validators } from "@/services/supabase";
import theme from "@/theme/Theme";

/**
 * Componente de Login para Administradores.
 * Incluye lógica de Rate Limiting local para prevenir ataques de fuerza bruta.
 */
const MAX_INTENTOS = 3;
const RATELIMIT_SEGUNDOS = 60;

function LoginAdmin() {
  // --- ESTADOS DE FORMULARIO ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE SEGURIDAD (RATE LIMIT) ---
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const timerRef = useRef<any>(null);

  /**
   * Limpieza del timer al desmontar el componente para evitar fugas de memoria.
   */
  useEffect(() => {
    return () => { 
      if (timerRef.current) {
        console.log(`[${new Date().toISOString()}] Limpiando timer de bloqueo de login.`);
        clearInterval(timerRef.current); 
      }
    };
  }, []);

  /**
   * Inicia el bloqueo temporal tras exceder el máximo de intentos permitidos.
   */
  const iniciarRateLimit = () => {
    console.warn(`[${new Date().toISOString()}] Demasiados intentos fallidos. Bloqueando acceso por ${RATELIMIT_SEGUNDOS}s.`);
    setBloqueado(true);
    setSegundosRestantes(RATELIMIT_SEGUNDOS);
    
    timerRef.current = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          console.log(`[${new Date().toISOString()}] Bloqueo finalizado. Intentos reseteados.`);
          clearInterval(timerRef.current);
          setBloqueado(false);
          setIntentos(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Procesa la autenticación del administrador contra el servicio de Supabase.
   */
  const handleLogin = async () => {
    if (bloqueado || loading) return;

    console.log(`[${new Date().toISOString()}] Intento de login iniciado para: ${email.trim().toLowerCase()}`);
    setEmailError('');
    setPasswordError('');

    // Validaciones sintácticas previas al envío
    const emailErr = validators.email(email);
    const passwordErr = validators.password(password);
    
    if (emailErr) { 
      console.log(`[${new Date().toISOString()}] Error de validación en email: ${emailErr}`);
      setEmailError(emailErr); 
      return; 
    }
    if (passwordErr) { 
      console.log(`[${new Date().toISOString()}] Error de validación en password: ${passwordErr}`);
      setPasswordError(passwordErr); 
      return; 
    }

    setLoading(true);
    try {
      await adminAuthService.login(email.trim().toLowerCase(), password);
      
      console.log(`[${new Date().toISOString()}] Login exitoso para el administrador.`);
      setIntentos(0);
      router.replace("/pages/management/pedidos/MostrarPedidos");
    } catch (err: any) {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      
      console.error(`[${new Date().toISOString()}] Error en login (Intento ${nuevosIntentos}): ${err.message}`);

      // Mapeo de errores a campos específicos
      if (err.message?.toLowerCase().includes('email')) {
        setEmailError(err.message);
      } else {
        setPasswordError(err.message);
      }

      // Disparar bloqueo si se alcanza el límite
      if (nuevosIntentos >= MAX_INTENTOS) {
        iniciarRateLimit();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🏥</Text>
          </View>
          <Text style={styles.title}>Login de Administración</Text>
        </View>

        <View style={styles.form}>
          {/* CAMPO: EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="Ingresa tu email"
              value={email}
              onChangeText={v => { setEmail(v); setEmailError(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholderTextColor="#999"
              editable={!loading && !bloqueado}
            />
            {emailError !== '' && <Text style={styles.error}>⚠️ {emailError}</Text>}
          </View>

          {/* CAMPO: PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={v => { setPassword(v); setPasswordError(''); }}
              secureTextEntry
              autoCapitalize="none"
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholderTextColor="#999"
              editable={!loading && !bloqueado}
            />
            {passwordError !== '' && <Text style={styles.error}>⚠️ {passwordError}</Text>}
          </View>

          {/* MENSAJE VISUAL DE BLOQUEO POR RATE LIMIT */}
          {bloqueado && (
            <View style={{
              backgroundColor: '#FFE6E6',
              borderLeftWidth: 4,
              borderLeftColor: theme.colors.error,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              alignItems: 'center',
            }}>
              <Text style={{ color: theme.colors.error, fontWeight: 'bold', fontSize: 15 }}>
                🚫 Acceso denegado {segundosRestantes}s
              </Text>
              <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
                Demasiados intentos fallidos. Espera {segundosRestantes} segundos.
              </Text>
            </View>
          )}

          {/* BOTÓN DE ACCIÓN */}
          <Pressable
            onPress={handleLogin}
            disabled={loading || bloqueado}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (loading || bloqueado) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Iniciando..." : bloqueado ? `Bloqueado ${segundosRestantes}s` : "Iniciar Sesión"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default LoginAdmin;