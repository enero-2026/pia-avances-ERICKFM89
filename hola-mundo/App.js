import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, FlatList, Image
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screen/HomeScreen";
import EditarScreen from "./screen/EditScreen";
import AgregarScreen from "./screen/AgregarScreen";
import LoginScreen from "./screen/LoginScreen";


const Tab = createBottomTabNavigator();
const BASE_URL = "http://192.168.100.113:3001";


export default function App() {

  const [logged, setLogged] = useState(false);

  if (!logged) return <LoginScreen onLogin={() => setLogged(true)} />;

  return (

    
<NavigationContainer>
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: "#800020"
      },

      headerTintColor: "#fff",

      headerTitleAlign: "center",

      tabBarStyle: {
        backgroundColor: "#800020"
      },

      tabBarActiveTintColor: "#fff",

      tabBarInactiveTintColor: "#f2c6cc",

      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = "home";
        }
        else if (route.name === "Ver Clientes") {
          iconName = "people";
        }

        else if (route.name === "Agregar Cliente") {
          iconName = "person-add";
        }

        else if (route.name === "Editar Cliente") {
          iconName = "create";
        }

        else if (route.name === "Salir") {
          iconName = "log-out";
        }

        return (
          <Ionicons
            name={iconName}
            size={size}
            color={color}
          />
        );
      }
    })}
  >

    <Tab.Screen
      name="Home"
      component={HomeScreen}
    />

    <Tab.Screen
      name="Ver Clientes"
      component={ClientesScreen}
    />

    <Tab.Screen
      name="Agregar Cliente"
      component={AgregarScreen}
      options={{ title: "Agregar Cliente" }}
    />

    <Tab.Screen
      name="Editar Cliente"
      component={EditarScreen}
    />

    <Tab.Screen name="Salir">
      {() => (
        <LogoutScreen
          onLogout={() => setLogged(false)}
        />
      )}
    </Tab.Screen>

  </Tab.Navigator>
</NavigationContainer>
  );
}


//////////////////// CLIENTES ////////////////////


function ClientesScreen() {

  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  //////////////////// GET CLIENTES ////////////////////
  const getClientes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/clientes-lista`);
      const data = await res.json();
      setClientes(data);
    } catch {
      Alert.alert("Error cargando clientes");
    }
  };

  //////////////////// LOAD ////////////////////
useFocusEffect(
  useCallback(() => {
    getClientes();
  }, [])
);

  //////////////////// FILTRO ////////////////////
  const clientesFiltrados = clientes.filter(c =>
    `${c.NombreCliente} ${c.NumeroCliente}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );


  //////////////////// UI ////////////////////
  return (
    <View style={{ flex: 1, padding: 15 }}>

      <Text style={styles.label}>Ingresa el Nombre o el Numero de la Empresa</Text>
      <TextInput
        placeholder="Buscar por nombre o número"
        value={filtro}
        onChangeText={setFiltro}
        style={styles.input}
      />

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {

          const abierto = clienteSeleccionado?.id === item.id;

          return (
            <View>

              <TouchableOpacity
                style={styles.clientItem}
                onPress={() => {
                  if (abierto) {
                    setClienteSeleccionado(null);
                  } else {
                    setClienteSeleccionado(item);
                  }
                }}
              >
  <View style={{ flex: 1 }}>

    <Text style={styles.clientName}>
      {item.NombreCliente}
    </Text>

    <Text style={styles.clientNumber}>
      Cliente #{item.NumeroCliente}
    </Text>

  </View>

  {item.ImagenEmpresa ? (
    <Image
      source={{ uri: `${BASE_URL}${item.ImagenEmpresa}` }}
      style={styles.clientLogo}
    />
  ) : (
    <View style={styles.emptyLogo}>
      <Ionicons name="business" size={28} color="#666" />
    </View>
  )}
              </TouchableOpacity>

              {abierto && (
                <View style={styles.card}>

                  <Text style={styles.cardTitle}>
                    {item.NombreCliente}
                  </Text>

                  <Text style={styles.section}>
                    Datos generales
                  </Text>

                  <View style={styles.rowWrap}>

                    <View style={styles.block}>
                      <Text style={styles.blockTitle}>Número</Text>
                      <Text>{item.NumeroCliente || "N/A"}</Text>
                    </View>

                    <View style={styles.block}>
                      <Text style={styles.blockTitle}>RFC</Text>
                      <Text>{item.RFC || "N/A"}</Text>
                    </View>

                    <View style={styles.block}>
                      <Text style={styles.blockTitle}>Teléfono</Text>
                      <Text>{item.Telefono || "N/A"}</Text>
                    </View>

                  </View>

                  <Text style={styles.section}>
                    Sistemas
                  </Text>

                  <View style={styles.rowWrap}>

                    {item.Contabilidad && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>
                          Contabilidad
                        </Text>

                        <Text>
                          {item.ContabilidadVersion || "Sin versión"}
                        </Text>
                      </View>
                    )}

                    {item.Bancos && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>
                          Bancos
                        </Text>

                        <Text>
                          {item.BancosVersion || "Sin versión"}
                        </Text>
                      </View>
                    )}

                    {item.Nominas && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>
                          Nóminas
                        </Text>

                        <Text>
                          {item.NominasVersion || "Sin versión"}
                        </Text>
                      </View>
                    )}

                    {item.Comercial && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>
                          Comercial
                        </Text>

                        <Text>
                          {item.ComercialVersion || "Sin versión"}
                        </Text>
                      </View>
                    )}

                  </View>

                  {!item.Contabilidad &&
                   !item.Bancos &&
                   !item.Nominas &&
                   !item.Comercial && (
                    <Text style={styles.emptyText}>
                      No tiene sistemas registrados
                    </Text>
                  )}

                  <Text style={styles.section}>
                    Servidor
                  </Text>

                  <View style={styles.rowWrap}>

                    <View style={styles.block}>
                      <Text style={styles.blockTitle}>
                        SQL Server
                      </Text>

                      <Text>
                        {item.SQLServerVersion || "No definido"}
                      </Text>
                    </View>

                    <View style={styles.block}>
                      <Text style={styles.blockTitle}>
                        Windows
                      </Text>

                      <Text>
                        {item.WindowsVersion || "No definido"}
                      </Text>
                    </View>

                  </View>

                </View>
              )}

            </View>
          );
        }}
      />

    </View>
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
      <Text style={styles.title}>Da clic en el Botón para salir</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// STYLES ////////////////////
const styles = StyleSheet.create({

  ////////////////// GENERAL //////////////////

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
    backgroundColor: "#f4f6f9",
    paddingTop: 40
  },

  formContainer: {
    padding: 18,
    paddingBottom: 50,
    backgroundColor: "#f4f6f9"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#800020"
  },

  ////////////////// INPUTS //////////////////

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

  ////////////////// CLIENTES //////////////////

  clientItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800020",
    marginBottom: 5
  },

  clientNumber: {
    fontSize: 14,
    color: "#666"
  },

  searchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222"
  },

  listContainer: {
    marginTop: 10
  },

  ////////////////// CARD INFO //////////////////

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

  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#800020",
    marginBottom: 18
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 12,
    color: "#222"
  },

  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  block: {
    width: "48%",
    backgroundColor: "#f8f9fc",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ececec"
  },

  blockTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
    color: "#800020"
  },

  emptyText: {
    color: "#777",
    fontStyle: "italic",
    marginTop: 5
  },

  deleteButton: {
  backgroundColor: "#b00020",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10
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

  emptyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center"
  },

});
