const API_ENDPOINTS = {
  EMPLOYEES: "/employee/list",
  PROFILE: "/employee/profile",
  ADD_EMPLOYEE: "/employee/add",
  DELETE_EMPLOYEE: "/employee", // /:id will be appended
};

// DOM Elements
const employeesTable = document.getElementById("employeesTable");
const addEmployeeForm = document.getElementById("addEmployeeForm");
const logoutBtn = document.getElementById("logoutBtn");

function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
  }
}

async function loadEmployees() {
  try {
    const response = await fetch(API_ENDPOINTS.EMPLOYEES, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch employees");

    const employees = await response.json();
    const tbody = employeesTable.querySelector("tbody");
    tbody.innerHTML = "";

    employees.forEach((employee) => {
      tbody.innerHTML += `
                <tr>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.position}</td>
                    <td>${employee.department}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editEmployee('${employee._id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${employee._id}')">Delete</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Error loading employees:", error);
    alert("Failed to load employees");
  }
}

// add new employee
addEmployeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addEmployeeForm);
  const employeeData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) throw new Error("Failed to add employee");

    // close modal and reset form
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addEmployeeModal")
    );
    modal.hide();
    addEmployeeForm.reset();

    // reload employees list
    loadEmployees();
  } catch (error) {
    console.error("Error adding employee:", error);
    alert("Failed to add employee");
  }
});

// delete employee
async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete employee");

    loadEmployees();
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Failed to delete employee");
  }
}

// edit employee data
async function editEmployee(id) {
  try {
    // Fetch employee data
    const response = await fetch(`/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch employee");

    const employee = await response.json();

    // Populate edit form
    document.getElementById("editEmployeeId").value = employee._id;
    document.getElementById("editName").value = employee.name;
    document.getElementById("editEmail").value = employee.email;
    document.getElementById("editPosition").value = employee.position;
    document.getElementById("editDepartment").value = employee.department;

    // Show edit modal
    const editModal = new bootstrap.Modal(
      document.getElementById("editEmployeeModal")
    );
    editModal.show();
  } catch (error) {
    console.error("Error fetching employee:", error);
    alert("Failed to fetch employee details");
  }
}

// Add event listener for edit form submission
document
  .getElementById("editEmployeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editEmployeeId").value;
    const formData = new FormData(e.target);
    const employeeData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editEmployeeModal")
      );
      modal.hide();
      e.target.reset();

      // Reload employees list
      loadEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    }
  });

// logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  checkRole();
});

function showAddModal() {
  const modal = new bootstrap.Modal(
    document.getElementById("addEmployeeModal")
  );
  modal.show();
}

// Add role check
function checkRole() {
  const role = localStorage.getItem("userRole");
  if (role === "normal") {
    // Hide manager-only elements
    document
      .querySelectorAll(".manager-only")
      .forEach((el) => (el.style.display = "none"));
    // Load only user's profile
    loadOwnProfile();
  } else {
    // Load all employees for managers
    loadEmployees();
  }
}

// Load own profile for normal users
async function loadOwnProfile() {
  try {
    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");

    const profile = await response.json();
    displayProfile(profile);
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Failed to load profile");
  }
}
