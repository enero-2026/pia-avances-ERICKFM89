import { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function App() {

  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForm, setShowForm] = useState(false);

  // DATOS
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");

  // SISTEMAS
  const [contabilidad, setContabilidad] = useState(false);
  const [contaVersion, setContaVersion] = useState("");
  const [contaOptions, setContaOptions] = useState([]);

  const [bancos, setBancos] = useState(false);
  const [bancosVersion, setBancosVersion] = useState("");
  const [bancosOptions, setBancosOptions] = useState([]);

  const [nominas, setNominas] = useState(false);
  const [nominasVersion, setNominasVersion] = useState("");
  const [nominasOptions, setNominasOptions] = useState([]);

  const [comercial, setComercial] = useState(false);
  const [comercialVersion, setComercialVersion] = useState("");
  const [comercialOptions, setComercialOptions] = useState([]);

  const BASE_URL = "http://192.168.15.112:3001";

  // 🔹 Obtener versiones
  const getVersions = async (sistema, setter) => {
    try {
      const res = await fetch(`${BASE_URL}/versiones/${sistema}`);
      const data = await res.json();
      setter(data);
    } catch {
      Alert.alert("Error cargando versiones");
    }
  };

  // 🔹 LOGIN
  const login = async () => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) setScreen("home");
      else Alert.alert(data.message);
    } catch {
      Alert.alert("Error de conexión");
    }
  };

  // 🔹 REGISTER
  const register = async () => {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Usuario registrado");
        setScreen("login");
      } else Alert.alert(data.message);
    } catch {
      Alert.alert("Error de conexión");
    }
  };

  // 🔹 GUARDAR CLIENTE
  const saveClient = async () => {

    if (!companyName || !companyNumber) {
      Alert.alert("Completa los datos");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          NombreCliente: companyName,
          NumeroCliente: companyNumber,
          Contabilidad: contabilidad,
          Bancos: bancos,
          Nominas: nominas,
          Comercial: comercial,
          ContabilidadVersion: contaVersion,
          BancosVersion: bancosVersion,
          NominasVersion: nominasVersion,
          ComercialVersion: comercialVersion
        })
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Cliente guardado");

        // limpiar
        setCompanyName("");
        setCompanyNumber("");

        setContabilidad(false);
        setContaVersion("");

        setBancos(false);
        setBancosVersion("");

        setNominas(false);
        setNominasVersion("");

        setComercial(false);
        setComercialVersion("");

        setShowForm(false);
      }

    } catch {
      Alert.alert("Error al guardar");
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>MACONTROL</Text>
      </View>

      <View style={styles.content}>

        {/* LOGIN */}
        {screen === "login" && (
          <View style={styles.centerContent}>
            <Text style={styles.title}>Login</Text>

            <TextInput placeholder="Correo" onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} style={styles.input} />

            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen("register")}>
              <Text style={styles.registerText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* HOME */}
        {screen === "home" && (
          <View style={{ flex: 1, padding: 15 }}>

            {!showForm && (
              <View style={styles.homeTop}>
                <Text style={styles.title}>Bienvenido 👋</Text>
              </View>
            )}

            {showForm && (
              <View>
                <Text style={styles.title}>Agregar Cliente</Text>

                <View style={styles.formContainer}>

                  {/* IZQUIERDA */}
                  <View style={styles.leftColumn}>
                    <Text style={styles.label}>Nombre de la empresa</Text>
                    <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} />

                    <Text style={styles.label}>Número de empresa</Text>
                    <TextInput style={styles.input} value={companyNumber} onChangeText={setCompanyNumber} />
                  </View>

                  {/* DERECHA */}
                  <View style={styles.rightColumn}>

                    {/* CONTABILIDAD */}
                    <Text style={styles.label}>Contabilidad</Text>
                    <View style={styles.switchRow}>
                      <TouchableOpacity style={[styles.optionButton, contabilidad ? styles.optionActive : styles.optionInactive]}
                        onPress={() => {
                          setContabilidad(true);
                          getVersions("contabilidad", setContaOptions);
                        }}>
                        <Text style={contabilidad ? styles.optionTextActive : styles.optionText}>Sí</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.optionButton, !contabilidad ? styles.optionActive : styles.optionInactive]}
                        onPress={() => setContabilidad(false)}>
                        <Text style={!contabilidad ? styles.optionTextActive : styles.optionText}>No</Text>
                      </TouchableOpacity>
                    </View>

                    {contabilidad && (
                      <Picker selectedValue={contaVersion} onValueChange={setContaVersion}>
                        <Picker.Item label="Selecciona versión" value="" />
                        {contaOptions.map((v, i) => (
                          <Picker.Item key={i} label={v.version} value={v.version} />
                        ))}
                      </Picker>
                    )}

                    {/* BANCOS */}
                    <Text style={styles.label}>Bancos</Text>
                    <View style={styles.switchRow}>
                      <TouchableOpacity style={[styles.optionButton, bancos ? styles.optionActive : styles.optionInactive]}
                        onPress={() => {
                          setBancos(true);
                          getVersions("bancos", setBancosOptions);
                        }}>
                        <Text style={bancos ? styles.optionTextActive : styles.optionText}>Sí</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.optionButton, !bancos ? styles.optionActive : styles.optionInactive]}
                        onPress={() => setBancos(false)}>
                        <Text style={!bancos ? styles.optionTextActive : styles.optionText}>No</Text>
                      </TouchableOpacity>
                    </View>

                    {bancos && (
                      <Picker selectedValue={bancosVersion} onValueChange={setBancosVersion}>
                        <Picker.Item label="Selecciona versión" value="" />
                        {bancosOptions.map((v, i) => (
                          <Picker.Item key={i} label={v.version} value={v.version} />
                        ))}
                      </Picker>
                    )}

                    {/* NOMINAS */}
                    <Text style={styles.label}>Nóminas</Text>
                    <View style={styles.switchRow}>
                      <TouchableOpacity style={[styles.optionButton, nominas ? styles.optionActive : styles.optionInactive]}
                        onPress={() => {
                          setNominas(true);
                          getVersions("nominas", setNominasOptions);
                        }}>
                        <Text style={nominas ? styles.optionTextActive : styles.optionText}>Sí</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.optionButton, !nominas ? styles.optionActive : styles.optionInactive]}
                        onPress={() => setNominas(false)}>
                        <Text style={!nominas ? styles.optionTextActive : styles.optionText}>No</Text>
                      </TouchableOpacity>
                    </View>

                    {nominas && (
                      <Picker selectedValue={nominasVersion} onValueChange={setNominasVersion}>
                        <Picker.Item label="Selecciona versión" value="" />
                        {nominasOptions.map((v, i) => (
                          <Picker.Item key={i} label={v.version} value={v.version} />
                        ))}
                      </Picker>
                    )}

                    {/* COMERCIAL */}
                    <Text style={styles.label}>Comercial</Text>
                    <View style={styles.switchRow}>
                      <TouchableOpacity style={[styles.optionButton, comercial ? styles.optionActive : styles.optionInactive]}
                        onPress={() => {
                          setComercial(true);
                          getVersions("comercial", setComercialOptions);
                        }}>
                        <Text style={comercial ? styles.optionTextActive : styles.optionText}>Sí</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.optionButton, !comercial ? styles.optionActive : styles.optionInactive]}
                        onPress={() => setComercial(false)}>
                        <Text style={!comercial ? styles.optionTextActive : styles.optionText}>No</Text>
                      </TouchableOpacity>
                    </View>

                    {comercial && (
                      <Picker selectedValue={comercialVersion} onValueChange={setComercialVersion}>
                        <Picker.Item label="Selecciona versión" value="" />
                        {comercialOptions.map((v, i) => (
                          <Picker.Item key={i} label={v.version} value={v.version} />
                        ))}
                      </Picker>
                    )}

                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={saveClient}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* MENÚ */}
            <View style={styles.bottomMenu}>
              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuText}>Ver Clientes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={() => setShowForm(!showForm)}>
                <Text style={styles.menuText}>Agregar Cliente</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton}>
                <Text style={styles.menuText}>Editar Cliente</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("login")}>
                <Text style={styles.menuText}>Salir</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 60,
    backgroundColor: "#800020",
    justifyContent: "center",
    alignItems: "center"
  },

  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  content: { flex: 1 },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  title: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center"
  },

  label: {
    fontWeight: "bold",
    marginBottom: 5
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  button: {
    backgroundColor: "#800020",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  homeTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    flexDirection: "row",
    backgroundColor: "#800020"
  },

  menuButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#a00030"
  },

  menuText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },

  formContainer: {
    flexDirection: "row",
    gap: 10
  },

  leftColumn: { flex: 1 },
  rightColumn: { flex: 1 },

  switchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10
  },

  optionButton: {
    flex: 0.5,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#800020",
    borderRadius: 5,
    alignItems: "center"
  },

  optionActive: {
    backgroundColor: "#800020"
  },

  optionInactive: {
    backgroundColor: "#fff"
  },

  optionText: {
    color: "#800020",
    fontWeight: "bold"
  },

  optionTextActive: {
    color: "#fff",
    fontWeight: "bold"
  }
});