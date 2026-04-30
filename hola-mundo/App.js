import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const BASE_URL = "http://192.168.15.112:3001";

export default function App() {

  const [logged, setLogged] = useState(false);

  if (!logged) return <LoginScreen onLogin={() => setLogged(true)} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#800020" },
          headerTintColor: "#fff",
          headerTitleAlign: "center", // ✅ CENTRADO
          tabBarStyle: { backgroundColor: "#800020" },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#f2c6cc"
        }}
      >
        <Tab.Screen name="Ver Clientes" component={ClientesScreen} />

        <Tab.Screen 
          name="Agregar Cliente" 
          component={AgregarScreen}
          options={{ title: "Agregar" }} // 👈 SOLO MUESTRA "Agregar"
        />

        <Tab.Screen name="Editar Cliente" component={EditarScreen} />

        <Tab.Screen name="Salir">
          {() => <LogoutScreen onLogout={() => setLogged(false)} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//////////////////// LOGIN ////////////////////
function LoginScreen({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) onLogin();
      else Alert.alert(data.message);

    } catch {
      Alert.alert("Error de conexión");
    }
  };

  return (
    <View style={styles.centerContent}>
      <Text style={styles.title}>MACONTROL</Text>

      <TextInput placeholder="Correo" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// CLIENTES ////////////////////
function ClientesScreen() {
  return (
    <View style={styles.centerContent}>
      <Text style={styles.title}>Ver Clientes</Text>
      <Text style={{ color: "#555" }}>
        Aquí irá la lista (FlatList después)
      </Text>
    </View>
  );
}

//////////////////// EDITAR ////////////////////
function EditarScreen() {
  return (
    <View style={styles.centerContent}>
      <Text style={styles.title}>Editar Cliente</Text>
      <Text style={{ color: "#555" }}>
        Aquí podrás editar clientes
      </Text>
    </View>
  );
}

//////////////////// AGREGAR ////////////////////
function AgregarScreen() {
  const [sqlServerVersion, setSqlServerVersion] = useState("");
  const [sqlServerOptions, setSqlServerOptions] = useState([]);

  const [windowsVersion, setWindowsVersion] = useState("");
  const [windowsOptions, setWindowsOptions] = useState([]);

  const [rfc, setRfc] = useState("");
  const [regimenFiscal, setRegimenFiscal] = useState("");
  const [telefono, setTelefono] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");

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

  const getVersions = async (sistema, setter) => {
    try {
      const res = await fetch(`${BASE_URL}/versiones/${sistema}`);
      const data = await res.json();
      setter(data);
    } catch {
      Alert.alert("Error cargando versiones");
    }
  };

  const saveClient = async () => {
      if (!companyName || !companyNumber || !rfc || !telefono) {
    Alert.alert("Completa los datos obligatorios");
    return;
    }

      if (!sqlServerVersion || !windowsVersion) {
        Alert.alert("Selecciona versiones de SQL Server y Windows");
        return;
      }

    try {
      const res = await fetch(`${BASE_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        NombreCliente: companyName,
        NumeroCliente: companyNumber,
        RFC: rfc,
        RegimenFiscal: regimenFiscal,
        Telefono: telefono,
        Contabilidad: contabilidad,
        Bancos: bancos,
        Nominas: nominas,
        Comercial: comercial,
        ContabilidadVersion: contaVersion,
        BancosVersion: bancosVersion,
        NominasVersion: nominasVersion,
        ComercialVersion: comercialVersion,
        SQLServerVersion: sqlServerVersion,
        WindowsVersion: windowsVersion
      })
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Cliente guardado");

        setCompanyName("");
        setCompanyNumber("");
        setRfc("");              
        setRegimenFiscal("");    
        setTelefono("");         

        setContabilidad(false);
        setContaVersion("");
        setBancos(false);
        setBancosVersion("");
        setNominas(false);
        setNominasVersion("");
        setComercial(false);
        setComercialVersion("");
      }

    } catch {
      Alert.alert("Error al guardar");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>

      <Text style={styles.title}>Agregar Cliente</Text>

      <Text style={styles.label}>Nombre de la empresa</Text>
      <TextInput
        placeholder="Nombre empresa"
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
      />
      <Text style={styles.label}>Nombre de la empresa</Text>
      <TextInput
        placeholder="Número empresa"
        style={styles.input}
        value={companyNumber}
        onChangeText={setCompanyNumber}
      />
            <Text style={styles.label}>RFC</Text>
      <TextInput
        placeholder="RFC"
        style={styles.input}
        value={rfc}
        onChangeText={setRfc}
      />

      <Text style={styles.label}>Régimen Fiscal</Text>
      <TextInput
        placeholder="Régimen Fiscal"
        style={styles.input}
        value={regimenFiscal}
        onChangeText={setRegimenFiscal}
      />

      <Text style={styles.label}>Número de contacto</Text>
      <TextInput
        placeholder="Número de contacto"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      {/* SISTEMAS (SIN CAMBIOS) */}
      <Text style={styles.label}>Contabilidad</Text>
      <SwitchButtons state={contabilidad} setState={(v) => {
        setContabilidad(v);
        if (v) getVersions("contabilidad", setContaOptions);
      }} />

      {contabilidad && (
        <Picker selectedValue={contaVersion} onValueChange={setContaVersion}>
          <Picker.Item label="Selecciona versión" value="" />
          {contaOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Bancos</Text>
      <SwitchButtons state={bancos} setState={(v) => {
        setBancos(v);
        if (v) getVersions("bancos", setBancosOptions);
      }} />

      {bancos && (
        <Picker selectedValue={bancosVersion} onValueChange={setBancosVersion}>
          <Picker.Item label="Selecciona versión" value="" />
          {bancosOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Nóminas</Text>
      <SwitchButtons state={nominas} setState={(v) => {
        setNominas(v);
        if (v) getVersions("nominas", setNominasOptions);
      }} />

      {nominas && (
        <Picker selectedValue={nominasVersion} onValueChange={setNominasVersion}>
          <Picker.Item label="Selecciona versión" value="" />
          {nominasOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Comercial</Text>
      <SwitchButtons state={comercial} setState={(v) => {
        setComercial(v);
        if (v) getVersions("comercial", setComercialOptions);
      }} />

      {comercial && (
        <Picker selectedValue={comercialVersion} onValueChange={setComercialVersion}>
          <Picker.Item label="Selecciona versión" value="" />
          {comercialOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>
      )}
        <Text style={styles.label}>SQL Server</Text>

        <Picker
          selectedValue={sqlServerVersion}
          onValueChange={setSqlServerVersion}
          onFocus={() => getVersions("sqlserver", setSqlServerOptions)}
        >
          <Picker.Item label="Selecciona versión" value="" />
          {sqlServerOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>

        <Text style={styles.label}>Windows</Text>

        <Picker
          selectedValue={windowsVersion}
          onValueChange={setWindowsVersion}
          onFocus={() => getVersions("windows", setWindowsOptions)}
        >
          <Picker.Item label="Selecciona versión" value="" />
          {windowsOptions.map((v, i) => (
            <Picker.Item key={i} label={v.version} value={v.version} />
          ))}
        </Picker>

      <TouchableOpacity style={styles.button} onPress={saveClient}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

//////////////////// SWITCH ////////////////////
function SwitchButtons({ state, setState }) {
  return (
    <View style={styles.switchRow}>
      <TouchableOpacity
        style={[styles.optionButton, state && styles.optionActive]}
        onPress={() => setState(true)}
      >
        <Text style={state ? styles.optionTextActive : styles.optionText}>Sí</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, !state && styles.optionActive]}
        onPress={() => setState(false)}
      >
        <Text style={!state ? styles.optionTextActive : styles.optionText}>No</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// LOGOUT ////////////////////
function LogoutScreen({ onLogout }) {
  return (
    <View style={styles.centerContent}>
      <Text style={styles.title}>Cerrar sesión</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// STYLES ////////////////////
const styles = StyleSheet.create({

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  formContainer: {
    padding: 15,
    paddingBottom: 40
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center"
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  label: {
    fontWeight: "bold",
    marginTop: 10
  },

  button: {
    backgroundColor: "#800020",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  switchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10
  },

  optionButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#800020",
    borderRadius: 5,
    alignItems: "center"
  },

  optionActive: {
    backgroundColor: "#800020"
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