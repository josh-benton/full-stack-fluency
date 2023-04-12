const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

//test get handler
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

//get handler for api
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

//post handler
app.post("/api/tasks", (req, res) => {
    console.log(req.body);
    const { task } = req.body;
    pool.query(
      "INSERT INTO todo_list (task) VALUES ($1) RETURNING *",
      [task],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(201).json(result.rows[0]);
        }
      }
    );
  });

//put handler

//delete handler

app.listen(PORT, () => {
  console.log("Server is listening on port 3000...");
});
