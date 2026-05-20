import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

const BASE_URL = "http://192.168.100.113:3001";

function LoginScreen({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //////////////////// LOGIN ////////////////////

  const login = async () => {

    if (!email || !password) {
      Alert.alert("Completa todos los campos");
      return;
    }

    try {

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {

        onLogin();

      } else {

        Alert.alert(
          "Inicio de sesión incorrecto",
          "El correo o la contraseña no son correctos"
        );
      }

    } catch {

      Alert.alert("Error de conexión");
    }
  };

  //////////////////// REGISTRO ////////////////////

  const register = async () => {

    if (!email || !password) {
      Alert.alert("Completa todos los campos");
      return;
    }

    try {

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {

        Alert.alert(
          "Usuario registrado",
          "La cuenta fue creada correctamente"
        );

        setEmail("");
        setPassword("");

      } else {

        Alert.alert(
          "Error",
          data.message || "No se pudo registrar"
        );
      }

    } catch {

      Alert.alert("Error de conexión");
    }
  };

  //////////////////// UI ////////////////////

  return (
    <View style={styles.centerContent}>

      <Text style={styles.title}>
        MACONTROL
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Correo
        </Text>

        <TextInput
          placeholder="Ingresa tu correo"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Contraseña
        </Text>

        <TextInput
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={login}
        >
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.registerButton}
        onPress={register}
        >
        <Text style={styles.registerText}>
            Registrarse
        </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}
const styles = StyleSheet.create({


      centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
    backgroundColor: "#f4f6f9",
    paddingTop: 40
  },

    title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#800020"
  },

    card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4
  },


    input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 14,
    borderRadius: 14,
    fontSize: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },

    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    fontSize: 16,
    color: "#222"
  },

    button: {
    backgroundColor: "#800020",
    paddingVertical: 18,
    width: "100%", 
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },

  registerButton: {
  marginTop: 12,
  alignItems: "center"
},

registerText: {
  color: "#800020",
  fontWeight: "bold",
  fontSize: 16
},

    });

export default LoginScreen;