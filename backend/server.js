const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./complaints.db");

db.serialize(() => {

  // USERS TABLE WITH ROLE
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      mobile TEXT,
      college TEXT,
      branch TEXT,
      hostel TEXT,
      block TEXT,
      room TEXT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // COMPLAINT TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      category TEXT,
      description TEXT,
      status TEXT
    )
  `);

  // 🔥 CREATE DEFAULT ADMIN
  db.run(`
    INSERT OR IGNORE INTO users 
    (id, name, mobile, college, branch, hostel, block, room, username, password, role)
    VALUES (1,'Admin','9999999999','Admin','Admin','Main','A','000','admin','123','admin')
  `);
});


// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, user) => {
      if (user) res.send(user);
      else res.status(401).send("Invalid Login");
    }
  );
});


// REGISTER STUDENT
app.post("/register", (req, res) => {
  const { name, mobile, college, branch, hostel, block, room, username, password } = req.body;

  db.run(
    `INSERT INTO users 
    (name,mobile,college,branch,hostel,block,room,username,password,role)
    VALUES (?,?,?,?,?,?,?,?,?,'student')`,
    [name, mobile, college, branch, hostel, block, room, username, password],
    function(err){
      if(err) return res.status(400).send("Username already exists");
      res.send("Registered");
    }
  );
});


// ADD COMPLAINT
app.post("/add", (req, res) => {
  const { userId, category, description } = req.body;

  db.run(
    `INSERT INTO complaints (userId, category, description, status)
     VALUES (?,?,?,?)`,
    [userId, category, description, "Pending"],
    () => res.send("Added")
  );
});


// GET COMPLAINTS (ROLE BASED)
app.get("/all/:userId/:role", (req, res) => {
  const { userId, role } = req.params;

  if(role === "admin"){
    db.all(`
      SELECT complaints.*, users.name, users.room, users.block
      FROM complaints
      JOIN users ON complaints.userId = users.id
    `, [], (err, rows) => res.send(rows));
  } else {
    db.all(
      "SELECT * FROM complaints WHERE userId=?",
      [userId],
      (err, rows) => res.send(rows)
    );
  }
});


// RESOLVE (ADMIN ONLY)
app.put("/update/:id", (req, res) => {
  db.run(
    "UPDATE complaints SET status='Resolved' WHERE id=?",
    [req.params.id],
    () => res.send("Updated")
  );
});

app.listen(5000, () => console.log("✅ Backend running on 5000"));