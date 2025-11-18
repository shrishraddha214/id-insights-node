const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SHRADDHA",
  database: "user_system"
});

// REGISTER route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) return res.json({ status: "error", err });
        res.json({ status: "success" });
    });
});

// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   const hash = await bcrypt.hash(password, 10);

//   db.query(
//     "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
//     [name, email, hash],
//     (err) => {
//       if (err)
//         return res.send("Registration failed — maybe email already exists.");
//       res.send("Registration successful!");
//     }
//   );
// });

// LOGIN route
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
//     if (rows.length === 0) return res.send("User not found!");

//     const user = rows[0];

//     const match = await bcrypt.compare(password, user.password_hash);

//     if (!match) return res.send("Incorrect password!");

//     res.send({
//       message: "Login successful",
//       name: user.name,
//       email: user.email,
//     });
//   });
// });

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) return res.json({ status: "error", err });

        if (result.length === 0) {
            return res.json({ status: "failed", message: "User not found" });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ status: "failed", message: "Incorrect password" });
        }

        res.json({ status: "success", user });
    });
});

//admin route can be added here
app.get("/admin/users", (req, res) => {
    const sql = "SELECT id, name, email FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.json({ status: "error", err });
        res.json({ status: "success", users: result });
    });
});


app.listen(3000, () => console.log("Server running on port 3000"));
