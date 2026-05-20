import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from "react-native";

import { Picker } from "@react-native-picker/picker";

const BASE_URL = "http://192.168.100.113:3001";

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


function AgregarScreen( { navigation } ) {
  const [imagen, setImagen] = useState(null);
  const [sqlServerVersion, setSqlServerVersion] = useState("");
  const [sqlServerOptions, setSqlServerOptions] = useState([]);

  const [windowsVersion, setWindowsVersion] = useState("");
  const [windowsOptions, setWindowsOptions] = useState([]);

  const [rfc, setRfc] = useState("");
  const [regimen, setRegimen] = useState("");
  const [regimenOptions, setRegimenOptions] = useState([]);
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


    const tomarFoto = async () => {

    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso denegado");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };


  const abrirGaleria = async () => {

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso denegado");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };
  const getRegimenes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/regimenes`);
      const data = await res.json();
      setRegimenOptions(data);
    } catch {
      Alert.alert("Error cargando regímenes");
    }
  };

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

     try {
      const res = await fetch(`${BASE_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        NombreCliente: companyName,
        NumeroCliente: companyNumber,
        RFC: rfc,
        RegimenFiscalID: regimen,
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
        navigation.goBack();


        setCompanyName("");
        setCompanyNumber("");
        setRfc("");              
        setRegimen("");   
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

  <Text style={styles.label}>
    Logo de la empresa
  </Text>

  <View style={styles.rowButtons}>

    <TouchableOpacity
      style={styles.halfButton}
      onPress={tomarFoto}
    >
      <MaterialIcons name="photo-camera" size={22} color="white" />
      
      <Text style={styles.buttonText}>
        Tomar foto
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.halfButton}
      onPress={abrirGaleria}
    >
      <MaterialIcons name="image" size={22} color="white" />

      <Text style={styles.buttonText}>
        Elegir logo
      </Text>
    </TouchableOpacity>

  </View>

      {imagen !== null && imagen !== "" && (
        <Image
          source={{ uri: imagen }}
          resizeMode="contain"
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginTop: 15,
            backgroundColor: "#f2f2f2"
          }}
        />
      )}

      <Text style={styles.label}>Nombre de la empresa</Text>
      <TextInput
        placeholder="Nombre empresa"
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
      />
      <Text style={styles.label}>Numero de la empresa</Text>
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

      <Picker
        selectedValue={regimen}
        onValueChange={setRegimen}
        onFocus={getRegimenes}
      >
        <Picker.Item label="Selecciona régimen" value="" />
        {regimenOptions.map((r, i) => (
        <Picker.Item key={i} label={r.nombre} value={r.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Número de contacto</Text>
      <TextInput
        placeholder="Número de contacto"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

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

        <TouchableOpacity
          style={styles.button}
          onPress={saveClient}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 18,
    paddingBottom: 50,
    backgroundColor: "#f4f6f9"
  },

    label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    fontSize: 16,
    color: "#222"
  },

  ////////////////// BOTONES //////////////////

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

    switchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15
  },

  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#800020",
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#fff"
  },

  optionActive: {
    backgroundColor: "#800020"
  },

  optionText: {
    color: "#800020",
    fontWeight: "bold",
    fontSize: 16
  },

  optionTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

    rowButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15
  },

    halfButton: {
    flex: 1,
    backgroundColor: "#800020",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
    clientLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 10
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

      });

export default AgregarScreen;