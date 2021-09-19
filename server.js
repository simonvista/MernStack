const express = require("express");
const app = express();
const todoRoutes = express.Router();

const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection setup successfully");
});

// Handle Todo Model as follows:
let Todo = require("./todo.model");
// Get All
todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});
// Get One
todoRoutes.route("/:id").get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});
// Add One
todoRoutes.route("/add").post((req, res) => {
  let todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added sucessfully" });
    })
    .catch((err) => {
      res.status(400).send("todo added failed");
    });
});
// Edit One
todoRoutes.route("/update/:id").post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) {
      res.status(404).send("todo not found");
    } else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;
      todo
        .save()
        .then((todo) => {
          res.json("Todo updated");
        })
        .catch((err) => {
          res.status(400).send("Updating todo failed");
        });
    }
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
