import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

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

function EditarScreen( navigation ) {


  const [clientesOptions, setClientesOptions] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [rfc, setRfc] = useState("");
  const [telefono, setTelefono] = useState("");
  const [regimen, setRegimen] = useState("");
  const [regimenOptions, setRegimenOptions] = useState([]);

  const [contabilidad, setContabilidad] = useState(false);
  const [bancos, setBancos] = useState(false);
  const [nominas, setNominas] = useState(false);
  const [comercial, setComercial] = useState(false);

  const [contaVersion, setContaVersion] = useState("");
  const [bancosVersion, setBancosVersion] = useState("");
  const [nominasVersion, setNominasVersion] = useState("");
  const [comercialVersion, setComercialVersion] = useState("");

  // NUEVO
  const [contaOptions, setContaOptions] = useState([]);
  const [bancosOptions, setBancosOptions] = useState([]);
  const [nominasOptions, setNominasOptions] = useState([]);
  const [comercialOptions, setComercialOptions] = useState([]);

  const [sqlServerVersion, setSqlServerVersion] = useState("");
  const [sqlServerOptions, setSqlServerOptions] = useState([]);

  const [windowsVersion, setWindowsVersion] = useState("");
  const [windowsOptions, setWindowsOptions] = useState([]);

  const [imagen, setImagen] = useState(null);

  //////////////////// GET CLIENTES ////////////////////
  const getClientes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/clientes-lista`);
      const data = await res.json();
      setClientesOptions(data);
    } catch {
      Alert.alert("Error cargando clientes");
    }
  };
////////////////////////////LOAD//////////////////////////////
  useFocusEffect(
  useCallback(() => {
    getClientes();
  }, [])
);

  //////////////////// GET REGIMENES ////////////////////
  const getRegimenes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/regimenes`);
      const data = await res.json();
      setRegimenOptions(data);
    } catch {
      Alert.alert("Error cargando regímenes");
    }
  };

  //////////////////// GET VERSIONES ////////////////////
  const getVersions = async (sistema, setter) => {
    try {
      const res = await fetch(`${BASE_URL}/versiones/${sistema}`);
      const data = await res.json();
      setter(data);
    } catch {
      Alert.alert("Error cargando versiones");
    }
  };

//////////////////// FOTO ////////////////////

const tomarFoto = async () => {

  const permiso = await ImagePicker.requestCameraPermissionsAsync();

  if (!permiso.granted) {
    Alert.alert("Permiso denegado");
    return;
  }

  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
  });

  if (!resultado.canceled) {
    setImagen(resultado.assets[0].uri);
  }
};
  
  //////////////////// CARGAR CLIENTE ////////////////////
const cargarCliente = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/clientes/${id}`);
    const c = await res.json();

    setClienteId(c.id);
    setCompanyName(c.NombreCliente);
    setCompanyNumber(c.NumeroCliente);
    setRfc(c.RFC);
    setTelefono(c.Telefono);
    setRegimen(c.RegimenFiscalID);

    setContabilidad(!!c.Contabilidad);
    setBancos(!!c.Bancos);
    setNominas(!!c.Nominas);
    setComercial(!!c.Comercial);

    setContaVersion(c.ContabilidadVersion || "");
    setBancosVersion(c.BancosVersion || "");
    setNominasVersion(c.NominasVersion || "");
    setComercialVersion(c.ComercialVersion || "");

    setSqlServerVersion(c.SQLServerVersion || "");
    setWindowsVersion(c.WindowsVersion || "");
setImagen(
  c?.ImagenEmpresa
    ? `${BASE_URL}${c.ImagenEmpresa}`
    : null
);

    if (c.Contabilidad) getVersions("contabilidad", setContaOptions);
    if (c.Bancos) getVersions("bancos", setBancosOptions);
    if (c.Nominas) getVersions("nominas", setNominasOptions);
    if (c.Comercial) getVersions("comercial", setComercialOptions);
    
    getVersions("sqlserver", setSqlServerOptions);
    getVersions("windows", setWindowsOptions);

  } catch {
    Alert.alert("Error cargando cliente");
  }
};

  //////////////////// ACTUALIZAR ////////////////////
const updateClient = async () => {

  if (!clienteId) {
    Alert.alert("Selecciona un cliente");
    return;
  }

  try {

    //////////////////// FORMDATA ////////////////////

    const formData = new FormData();

    formData.append("NombreCliente", companyName);
    formData.append("NumeroCliente", companyNumber);
    formData.append("RFC", rfc);
    formData.append("RegimenFiscalID", regimen);
    formData.append("Telefono", telefono);

    formData.append("Contabilidad", contabilidad ? 1 : 0);
    formData.append("Bancos", bancos ? 1 : 0);
    formData.append("Nominas", nominas ? 1 : 0);
    formData.append("Comercial", comercial ? 1 : 0);

    formData.append("ContabilidadVersion", contaVersion);
    formData.append("BancosVersion", bancosVersion);
    formData.append("NominasVersion", nominasVersion);
    formData.append("ComercialVersion", comercialVersion);

    formData.append("SQLServerVersion", sqlServerVersion);
    formData.append("WindowsVersion", windowsVersion);

    //////////////////// IMAGEN ////////////////////

    if (imagen && !imagen.includes("/uploads/")) {

      const filename = imagen.split("/").pop();

      const match = /\.(\w+)$/.exec(filename);

      const type = match
        ? `image/${match[1]}`
        : `image`;

      formData.append("imagen", {
        uri: imagen,
        name: filename,
        type
      });
    }

    //////////////////// FETCH ////////////////////

    const res = await fetch(
      `${BASE_URL}/clientes/${clienteId}`,
      {
        method: "PUT",
        body: formData
      }
    );

    const data = await res.json();

    if (data.success) {
      Alert.alert("Cliente actualizado");
       navigation.goBack();
    }

  } catch (error) {

    console.log(error);

    Alert.alert("Error actualizando");
  }
};
    //////////////////// ELIMINAR ////////////////////
const deleteClient = () => {

  if (!clienteId) {
    Alert.alert("Selecciona un cliente");
    return;
  }

  Alert.alert(
    "Eliminar cliente",
    "¿Seguro que deseas eliminar este cliente?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },

      {
        text: "Eliminar",
        style: "destructive",

        onPress: async () => {

          try {

            const res = await fetch(
              `${BASE_URL}/clientes/${clienteId}`,
              {
                method: "DELETE"
              }
            );

            const data = await res.json();

            if (data.success) {

              Alert.alert("Cliente eliminado");

              ////////////////// LIMPIAR FORM //////////////////

              setClienteSeleccionado("null");
              setClienteId(null);

              setCompanyName("");
              setCompanyNumber("");
              setRfc("");
              setTelefono("");
              setRegimen("");

              setContabilidad(false);
              setBancos(false);
              setNominas(false);
              setComercial(false);

              setContaVersion("");
              setBancosVersion("");
              setNominasVersion("");
              setComercialVersion("");

              setSqlServerVersion("");
              setWindowsVersion("");

              getClientes();
            }

          } catch {
            Alert.alert("Error eliminando cliente");
          }

        }
      }
    ]
  );
};

  //////////////////// UI ////////////////////
  return (
    <ScrollView contentContainerStyle={styles.formContainer}>

      <Text style={styles.label}>Seleccionar Cliente</Text>

      <Picker
        selectedValue={clienteSeleccionado}
        onValueChange={(value) => {
          setClienteSeleccionado(value);

          if (value !== null) {
            cargarCliente(value);
          }
        }}
      >
        <Picker.Item label="Selecciona un cliente" value={null} />
        {clientesOptions.map((c, i) => (
          <Picker.Item key={i} label={`${c.NombreCliente} (${c.NumeroCliente})`} value={c.id} />
        ))}
      </Picker>

      {clienteId && (
        <>
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
        {typeof imagen === "string" && imagen.trim().length > 5 ? (
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
        ) : null}
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} />

          <Text style={styles.label}>Número</Text>
          <TextInput style={styles.input} value={companyNumber} onChangeText={setCompanyNumber} />

          <Text style={styles.label}>RFC</Text>
          <TextInput style={styles.input} value={rfc} onChangeText={setRfc} />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} />

          <Text style={styles.label}>Régimen Fiscal</Text>
          <Picker selectedValue={regimen} onValueChange={setRegimen} onFocus={getRegimenes}>
            <Picker.Item label="Selecciona régimen" value="" />
            {regimenOptions.map((r, i) => (
              <Picker.Item key={i} label={r.nombre} value={r.id} />
            ))}
          </Picker>

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

          <TouchableOpacity style={styles.button} onPress={updateClient}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteClient}
          >
            <Text style={styles.buttonText}>
              Eliminar Cliente
            </Text>
          </TouchableOpacity>

          
        </>
        
        
      )}

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

  ////////////////// SWITCH //////////////////

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

    deleteButton: {
  backgroundColor: "#b00020",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10
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

    });

    export default EditarScreen;