const API_URL = "http://localhost:3000/students";

// Load Students
async function loadStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();
  renderTable(students);
}

// Render Student Table
function renderTable(students) {
  const tableBody = document.querySelector("#studentTable tbody");
  tableBody.innerHTML = "";

  students.forEach((s) => {
    const percentage = s.percentage ? s.percentage.toFixed(2) : "0.00";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.m1}</td>
      <td>${s.m2}</td>
      <td>${s.m3}</td>
      <td>${s.total || 0}</td>
      <td>${percentage}%</td>
      <td>${s.grade || "-"}</td>
      <td>
        <button onclick="editStudent('${s.id}')" style="background-color:orange;color:white;border:none;padding:5px;border-radius:4px;cursor:pointer;">Edit</button>
        <button onclick="deleteStudent('${s.id}')" style="background-color:red;color:white;border:none;padding:5px;border-radius:4px;cursor:pointer;">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add Student to the Table
document.getElementById("addBtn").addEventListener("click", async () => {
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const m1 = Number(document.getElementById("m1").value);
  const m2 = Number(document.getElementById("m2").value);
  const m3 = Number(document.getElementById("m3").value);
  const errorMsg = document.getElementById("errorMsg");

  // Clear old message
  errorMsg.textContent = "";

  // Validation for empty fields
  if (!id || !name || !roll || isNaN(m1) || isNaN(m2) || isNaN(m3)) {
    errorMsg.textContent = "Please fill all fields!";
    return;
  }

  // Marks validation
  if (m1 < 0 || m1 > 100 || m2 < 0 || m2 > 100 || m3 < 0 || m3 > 100) {
    errorMsg.textContent = "Invalid Marks";
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, roll, m1, m2, m3 }),
  });

  // Clear inputs
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  loadStudents();
});

// Delete Student Button
async function deleteStudent(id) {
  if (confirm("Delete this student?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStudents();
  }
}

// Edit Student Button 
async function editStudent(id) {
  const newName = prompt("Enter new name:");
  if (newName) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    loadStudents();
  }
}

// Export CSV Button
document.getElementById("exportBtn").addEventListener("click", async () => {
  const res = await fetch(API_URL);
  const students = await res.json();
  let csv = "ID,Name,Roll,M1,M2,M3,Total,Percentage,Grade\n";
  students.forEach((s) => {
    csv += `${s.id},${s.name},${s.roll},${s.m1},${s.m2},${s.m3},${s.total},${s.percentage},${s.grade}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "students.csv";
  a.click();
});

// Dark Mode Button 
document.getElementById("darkModeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

loadStudents();
