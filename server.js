const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/tasks", (req, res) => {
    pool.query("SELECT * FROM todo_list", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error querying the database");
        } else {
            res.send(result.rows);
        }
    })
})

app.listen(PORT, () => {
  console.log("Server is listening on port 3000...");
});
