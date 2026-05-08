const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

//////////////////// CARPETA PUBLICA ////////////////////

app.use("/uploads", express.static("uploads"));

//////////////////// MULTER ////////////////////

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }

});

const upload = multer({
  storage
});
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ariadne898@",
  database: "PIAPP"
});

//  Verificar conexión
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
app.post("/clientes",upload.single("imagen"), (req, res) => {
  const {
    NombreCliente,
    NumeroCliente,
    RFC,
    RegimenFiscalID,
    Telefono,
    Contabilidad,
    Bancos,
    Nominas,
    Comercial,
    ContabilidadVersion,
    BancosVersion,
    NominasVersion,
    ComercialVersion,
    SQLServerVersion,
    WindowsVersion
  } = req.body;

  const ImagenEmpresa = req.file
    ? `/uploads/${req.file.filename}`
    : null;

  db.query(
    `INSERT INTO clientes 
(NombreCliente, NumeroCliente, RFC, RegimenFiscalID, Telefono,
 Contabilidad, Bancos, Nominas, Comercial,
 ContabilidadVersion, BancosVersion, NominasVersion, ComercialVersion,
 SQLServerVersion, WindowsVersion, ImagenEmpresa)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      NombreCliente,
      NumeroCliente,
      RFC,
      RegimenFiscalID,
      Telefono,
      Contabilidad,
      Bancos,
      Nominas,
      Comercial,
      ContabilidadVersion,
      BancosVersion,
      NominasVersion,
      ComercialVersion,
      SQLServerVersion,
      WindowsVersion,
      ImagenEmpresa
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

////////////////////  BUSCAR CLIENTES ////////////////////
app.get("/clientes/buscar", (req, res) => {
  const { nombre, numero } = req.query;

  let query = "SELECT * FROM clientes WHERE 1=1";
  let params = [];

  if (nombre) {
    query += " AND NombreCliente LIKE ?";
    params.push(`%${nombre}%`);
  }

  if (numero) {
    query += " AND NumeroCliente LIKE ?";
    params.push(`%${numero}%`);
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

////////////////////  OBTENER CLIENTE POR ID ////////////////////
app.get("/clientes/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result[0]);
  });
});

////////////////////  EDITAR CLIENTE ////////////////////
app.put("/clientes/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;

  const {
    NombreCliente,
    NumeroCliente,
    RFC,
    RegimenFiscalID,
    Telefono,
    Contabilidad,
    Bancos,
    Nominas,
    Comercial,
    ContabilidadVersion,
    BancosVersion,
    NominasVersion,
    ComercialVersion,
    SQLServerVersion,
    WindowsVersion
  } = req.body;
    let ImagenEmpresa = null;

    if (req.file) {
      ImagenEmpresa = `/uploads/${req.file.filename}`;
    }
  db.query(
    `UPDATE clientes SET
      NombreCliente = ?,
      NumeroCliente = ?,
      RFC = ?,
      RegimenFiscalID = ?,
      Telefono = ?,
      Contabilidad = ?,
      Bancos = ?,
      Nominas = ?,
      Comercial = ?,
      ContabilidadVersion = ?,
      BancosVersion = ?,
      NominasVersion = ?,
      ComercialVersion = ?,
      SQLServerVersion = ?,
      WindowsVersion = ?,
      ImagenEmpresa = COALESCE(?, ImagenEmpresa)
    WHERE id = ?`,
    [
      NombreCliente,
      NumeroCliente,
      RFC,
      RegimenFiscalID,
      Telefono,
      Contabilidad,
      Bancos,
      Nominas,
      Comercial,
      ContabilidadVersion,
      BancosVersion,
      NominasVersion,
      ComercialVersion,
      SQLServerVersion,
      WindowsVersion,
      ImagenEmpresa,
      id
    ],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Cliente actualizado" });
    }
  );
});

//////////////////// ELIMINAR CLIENTE ////////////////////
app.delete("/clientes/:id", (req, res) => {

  const { id } = req.params;

  db.query(
    "DELETE FROM clientes WHERE id = ?",
    [id],
    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.json({
        success: true,
        message: "Cliente eliminado"
      });

    }
  );
});

//////////////////// SERVIDOR ////////////////////
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});

//////////////////// REGIMENES ////////////////////
app.get("/regimenes", (req, res) => {
  db.query("SELECT id, nombre FROM regimenes_fiscales", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

//////////////////// LISTA SIMPLE DE CLIENTES ////////////////////
app.get("/clientes-lista", (req, res) => {
  db.query(
    `SELECT 
      id,
      NombreCliente,
      NumeroCliente,
      RFC,
      Telefono,
      Contabilidad,
      Bancos,
      Nominas,
      Comercial,
      ContabilidadVersion,
      BancosVersion,
      NominasVersion,
      ComercialVersion,
      SQLServerVersion,
      WindowsVersion,
      ImagenEmpresa
    FROM clientes`,
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

