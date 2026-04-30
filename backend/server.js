const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ariadne898@",
  database: "PIAPP"
});

// 🔌 Verificar conexión
db.connect(err => {
  if (err) {
    console.log("Error de conexión:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

//////////////////// REGISTRO ////////////////////
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.json({ success: false, message: "Usuario ya existe" });
          }
          return res.status(500).send(err);
        }

        res.json({ success: true, message: "Usuario registrado" });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//////////////////// LOGIN ////////////////////
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.json({ success: false, message: "Usuario no existe" });
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Contraseña incorrecta" });
    }
  });
});

//////////////////// VERSIONES ////////////////////
app.get("/versiones/:sistema", (req, res) => {
  const { sistema } = req.params;

  db.query(
    "SELECT version FROM versiones WHERE sistema = ?",
    [sistema],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

//////////////////// GUARDAR CLIENTE ////////////////////
app.post("/clientes", (req, res) => {
  const {
    NombreCliente,
    NumeroCliente,
    RFC,
    RegimenFiscal,
    Telefono,
    Contabilidad,
    Bancos,
    Nominas,
    Comercial,
    SQLServer,
    Windows,
    ContabilidadVersion,
    BancosVersion,
    NominasVersion,
    ComercialVersion,
    SQLServerVersion,
    WindowsVersion
  } = req.body;

  db.query(
    `INSERT INTO clientes 
    (NombreCliente, NumeroCliente, RFC, RegimenFiscal, Telefono,
     Contabilidad, Bancos, Nominas, Comercial,
     ContabilidadVersion, BancosVersion, NominasVersion, ComercialVersion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
    NombreCliente,
    NumeroCliente,
    RFC,
    RegimenFiscal,
    Telefono,
    Contabilidad,
    Bancos,
    Nominas,
    Comercial,
    SQLServer,
    Windows,
    ContabilidadVersion,
    BancosVersion,
    NominasVersion,
    ComercialVersion,
    SQLServerVersion,
    WindowsVersion
    ],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Cliente guardado" });
    }
  );
});

//////////////////// OBTENER CLIENTES ////////////////////
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

//////////////////// SERVIDOR ////////////////////
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});