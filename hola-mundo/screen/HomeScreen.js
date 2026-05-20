import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import {
  PieChart
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const BASE_URL = "http://192.168.100.113:3001";

export default function HomeScreen() {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({

    clientes: 0,

    contabilidad: 0,
    bancos: 0,
    nominas: 0,
    comercial: 0,

    windows10: 0,
    windows11: 0,
    windowsServer: 0,

    sql2016: 0,
    sql2019: 0,
    sql2022: 0

  });

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {

    try {

      const response = await fetch(
        `${BASE_URL}/dashboard`
      );

      const data = await response.json();

      setStats(data);

    } catch (error) {

      console.log("ERROR DASHBOARD:", error);

    } finally {

      setLoading(false);

    }

  };

  const pieData = [

    {
      name: "Contabilidad",
      cantidad: stats.contabilidad,
      color: "#800020",
      legendFontColor: "#222",
      legendFontSize: 18
    },

    {
      name: "Bancos",
      cantidad: stats.bancos,
      color: "#b22222",
      legendFontColor: "#222",
      legendFontSize: 18
    },

    {
      name: "Nóminas",
      cantidad: stats.nominas,
      color: "#d14b4b",
      legendFontColor: "#222",
      legendFontSize: 18
    },

    {
      name: "Comercial",
      cantidad: stats.comercial,
      color: "#e07b7b",
      legendFontColor: "#222",
      legendFontSize: 18
    }

  ];

  if (loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#800020"
        />

        <Text style={styles.loadingText}>
          Cargando Dashboard...
        </Text>

      </View>

    );

  }

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >



      <View style={styles.header}>

        <Text style={styles.title}>
          Dashboard
        </Text>

        <Text style={styles.subtitle}>
          Resumen general del sistema
        </Text>

      </View>


      <View style={styles.clientCard}>

        <View style={styles.clientIcon}>

          <Ionicons
            name="people"
            size={50}
            color="#800020"
          />

        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.clientNumber}>
            {stats.clientes}
          </Text>

          <Text style={styles.clientTitle}>
            Clientes Totales
          </Text>

          <Text style={styles.clientSubtitle}>
            Todos los clientes registrados
          </Text>

        </View>

      </View>



      <View style={styles.systemsContainer}>

        <Text style={styles.sectionTitle}>
          Sistemas
        </Text>

        <View style={styles.systemsGrid}>

          <View style={styles.systemCard}>

            <View style={styles.iconBox}>

              <Ionicons
                name="calculator"
                size={28}
                color="#800020"
              />

            </View>

            <Text style={styles.systemNumber}>
              {stats.contabilidad}
            </Text>

            <Text style={styles.systemTitle}>
              Contabilidad
            </Text>

          </View>

          <View style={styles.systemCard}>

            <View style={styles.iconBox}>

              <Ionicons
                name="card"
                size={28}
                color="#800020"
              />

            </View>

            <Text style={styles.systemNumber}>
              {stats.bancos}
            </Text>

            <Text style={styles.systemTitle}>
              Bancos
            </Text>

          </View>

          <View style={styles.systemCard}>

            <View style={styles.iconBox}>

              <Ionicons
                name="document-text"
                size={28}
                color="#800020"
              />

            </View>

            <Text style={styles.systemNumber}>
              {stats.nominas}
            </Text>

            <Text style={styles.systemTitle}>
              Nóminas
            </Text>

          </View>

          <View style={styles.systemCard}>

            <View style={styles.iconBox}>

              <Ionicons
                name="cart"
                size={28}
                color="#800020"
              />

            </View>

            <Text style={styles.systemNumber}>
              {stats.comercial}
            </Text>

            <Text style={styles.systemTitle}>
              Comercial
            </Text>

          </View>

        </View>

      </View>



{/* INFRAESTRUCTURA */}

<View style={styles.infrastructureContainer}>

  <Text style={styles.sectionTitle}>
    Infraestructura
  </Text>

  {/* SQL SERVER */}

  <View style={styles.infrastructureCardVertical}>

    <View style={styles.infrastructureHeader}>

      <View style={styles.infrastructureIcon}>
        <MaterialCommunityIcons
          name="database"
          size={38}
          color="#35208a"
        />
      </View>

      <Text style={styles.infrastructureTitle}>
        SQL Server
      </Text>

    </View>

    <View style={styles.versionList}>

      <Text style={styles.versionText}>
        SQL Server 2016: {stats.sql2016}
      </Text>

      <Text style={styles.versionText}>
        SQL Server 2019: {stats.sql2019}
      </Text>

      <Text style={styles.versionText}>
        SQL Server 2022: {stats.sql2022}
      </Text>

    </View>

  </View>

  {/* WINDOWS */}

  <View style={styles.infrastructureCardVertical}>

    <View style={styles.infrastructureHeader}>

      <View style={styles.infrastructureIcon}>
        <Ionicons
          name="logo-windows"
          size={38}
          color="#35208a"
        />
      </View>

      <Text style={styles.infrastructureTitle}>
        Windows
      </Text>

    </View>

    <View style={styles.versionList}>

      <Text style={styles.versionText}>
        Windows 10: {stats.windows10}
      </Text>

      <Text style={styles.versionText}>
        Windows 11: {stats.windows11}
      </Text>

      <Text style={styles.versionText}>
        Windows Server: {stats.windowsServer}
      </Text>

    </View>

  </View>

</View>


      <View style={styles.chartContainer}>

        <Text style={styles.chartTitle}>
          Distribución de Sistemas
        </Text>

        <Text style={styles.chartSubtitle}>
          Cantidades registradas por módulo
        </Text>

        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={260}
          chartConfig={{
            color: () => "#800020"
          }}
          accessor={"cantidad"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    padding: 15
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7"
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#800020",
    fontWeight: "bold"
  },

  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#800020"
  },

  subtitle: {
    marginTop: 5,
    color: "#666",
    fontSize: 16
  },

  clientCard: {
    backgroundColor: "#fff0f3",
    borderRadius: 30,
    padding: 25,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5
  },

  clientIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ffe2e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  },

  clientNumber: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#800020"
  },

  clientTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#800020"
  },

  clientSubtitle: {
    marginTop: 6,
    color: "#666",
    fontSize: 16
  },

  systemsContainer: {
    marginTop: 25
  },

  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#800020",
    marginBottom: 18
  },

  systemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  systemCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4
  },

  iconBox: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#ffecef",
    justifyContent: "center",
    alignItems: "center"
  },

  systemNumber: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#800020",
    marginTop: 15
  },

  systemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#800020",
    marginTop: 5
  },

  infrastructureContainer: {
    marginTop: 20
  },

  infraBox: {
    flex: 1
  },

  infraHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  infrastructureIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#dcdcff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },

  infraTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#35208a"
  },


  versionList: {
    marginLeft: 10
  },

  versionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 14
  },

  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 10,
    marginTop: 25,
    marginBottom: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5
  },

  chartTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#800020",
    textAlign: "center"
  },

  chartSubtitle: {
    textAlign: "center",
    color: "#555",
    marginTop: 6,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "bold"
  },

  infrastructureCardVertical: {
  backgroundColor: "#eef0ff",
  borderRadius: 30,
  padding: 22,
  marginBottom: 18,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3
  },

  shadowOpacity: 0.08,
  shadowRadius: 5,

  elevation: 4
},

infrastructureHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20
},

infrastructureTitle: {
  fontSize: 30,
  fontWeight: "bold",
  color: "#35208a",
  marginLeft: 15
},

versionList: {
  marginTop: 5
},

versionText: {
  fontSize: 22,
  fontWeight: "700",
  color: "#444",
  marginBottom: 14,
  lineHeight: 32
}
});
