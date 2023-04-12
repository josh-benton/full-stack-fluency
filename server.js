const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static("client"))

//test get handler
app.get("/test", (req, res) => {
  res.json("Hello World!");
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
  });
});

//get handler for specifid id
app.get("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  pool.query(
    "SELECT * FROM todo_list WHERE id = $1",
    [taskId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      } else {
        res.send(result.rows);
      }
    }
  );
});

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

//patch handler
app.patch("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { task } = req.body;
  const query =
    "UPDATE todo_list SET task = COALESCE($1, task) WHERE id = $2 RETURNING *";
  const values = [task || null, taskId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (result.rowCount === 0) {
      res.status(404).send(`Task with ID ${taskId} not found`);
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

//put handler
app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { task } = req.body;
  const query =
    "UPDATE todo_list SET task = COALESCE($1, task) WHERE id = $2 RETURNING *";
  const values = [task || null, taskId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (result.rowCount === 0) {
      res.status(404).send(`Task with ID ${taskId} not found`);
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

//delete handler
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  pool.query("DELETE FROM todo_list WHERE id = $1", [taskId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else if (result.rowCount === 0) {
      res.status(404).send(`Task with ID ${taskId} not found`);
    } else {
      res.status(204).send(`Task was successfully deleted`);
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is listening on port 3000...");
});
