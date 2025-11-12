const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Frontend Server
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "students.json");

// Read all data of the students
app.get("/students", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).send("Error reading data file");
    const students = JSON.parse(data || "[]");
    res.json(students);
  });
});

// Add new students
app.post("/students", (req, res) => {
  const student = req.body;
  fs.readFile(DATA_FILE, (err, data) => {
    const students = JSON.parse(data || "[]");
    const total = student.m1 + student.m2 + student.m3;
    const percentage = total / 3;
    const grade =
      percentage >= 90
        ? "A"
        : percentage >= 75
        ? "B"
        : percentage >= 60
        ? "C"
        : percentage >= 40
        ? "D"
        : "F";
    const newStudent = { ...student, total, percentage, grade };
    students.push(newStudent);

    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), () => {
      res.status(201).json(newStudent);
    });
  });
});

// Edit Student
app.put("/students/:id", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const students = JSON.parse(data || "[]");
    const index = students.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).send("Not found");

    students[index] = { ...students[index], ...req.body };

    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), () => {
      res.json(students[index]);
    });
  });
});

// Delete Student
app.delete("/students/:id", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    let students = JSON.parse(data || "[]");
    students = students.filter((s) => s.id !== req.params.id);
    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), () => {
      res.json({ message: "Deleted" });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
