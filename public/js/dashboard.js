// Check authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token || userRole !== "manager") {
    window.location.href = "/login.html";
    return;
  }

  loadEmployees();
});

// Load all employees
async function loadEmployees() {
  try {
    const response = await fetch("/employees", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load employees");

    const employees = await response.json();
    const tbody = document.getElementById("employeeList");
    tbody.innerHTML = employees
      .map(
        (employee) => `
            <tr>
                <td>${employee.fullName}</td>
                <td>${employee.email}</td>
                <td>${employee.department || "-"}</td>
                <td>${employee.position || "-"}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editEmployee('${
                      employee._id
                    }')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${
                      employee._id
                    }')">Delete</button>
                </td>
            </tr>
        `
      )
      .join("");
  } catch (error) {
    alert("Error loading employees");
    console.error(error);
  }
}

// Add new employee
document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const employeeData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/employee/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      // Close modal and reload list
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addEmployeeModal")
      );
      modal.hide();
      e.target.reset();
      loadEmployees();
    } catch (error) {
      alert("Error adding employee");
      console.error(error);
    }
  });

// Edit employee
async function editEmployee(id) {
  try {
    const response = await fetch(`/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch employee");

    const employee = await response.json();
    const form = document.getElementById("editEmployeeForm");

    // Fill form with employee data
    form.querySelector('[name="fullName"]').value = employee.fullName;
    form.querySelector('[name="department"]').value = employee.department || "";
    form.querySelector('[name="position"]').value = employee.position || "";
    document.getElementById("editEmployeeId").value = employee._id;

    // Show modal
    new bootstrap.Modal(document.getElementById("editEmployeeModal")).show();
  } catch (error) {
    alert("Error fetching employee details");
    console.error(error);
  }
}

// Handle edit form submission
document
  .getElementById("editEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editEmployeeId").value;
    const formData = new FormData(e.target);
    const employeeData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/employee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      // Close modal and reload list
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editEmployeeModal")
      );
      modal.hide();
      loadEmployees();
    } catch (error) {
      alert("Error updating employee");
      console.error(error);
    }
  });

// Delete employee
async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const response = await fetch(`/employee/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete employee");

    loadEmployees();
  } catch (error) {
    alert("Error deleting employee");
    console.error(error);
  }
}

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/login.html";
});
