document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  setupEventListeners();
});

// Check authentication on page load
async function checkAuth() {
  const response = await fetch("/auth/check");
  const data = await response.json();

  if (!data.authenticated || data.role !== "manager") {
    window.location.href = "/login.html";
  }

  loadEmployees();
}

// Load all employees
async function loadEmployees() {
  try {
    const response = await fetch("/employee/list");
    const employees = await response.json();

    const tableBody = document.getElementById("employeeList");
    tableBody.innerHTML = employees
      .map(
        (employee) => `
        <tr>
            <td>${employee.fullName}</td>
            <td>${employee.email}</td>
            <td>${employee.department || "-"}</td>
            <td>${employee.position || "-"}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editEmployee('${
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
    alert("Failed to load employees");
  }
}

// Setup event listeners
function setupEventListeners() {
  // Add Employee Form Submit
  document
    .getElementById("addEmployeeForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
        fullName: formData.get("fullName"),
        department: formData.get("department"),
        position: formData.get("position"),
      };

      try {
        const response = await fetch("/employee/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          bootstrap.Modal.getInstance(
            document.getElementById("addEmployeeModal")
          ).hide();
          e.target.reset();
          loadEmployees();
        } else {
          const result = await response.json();
          alert(result.error || "Failed to add employee");
        }
      } catch (error) {
        alert("Failed to add employee");
      }
    });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/auth/logout");
    window.location.href = "/login.html";
  });
}

// Delete employee
async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) {
    return;
  }

  try {
    const response = await fetch(`/employee/delete/${id}`, {
      method: "POST",
    });

    if (response.ok) {
      loadEmployees();
    } else {
      alert("Failed to delete employee");
    }
  } catch (error) {
    alert("Failed to delete employee");
  }
}

// Edit employee
async function editEmployee(id) {
  try {
    const response = await fetch(`/employee/${id}`);
    const employee = await response.json();

    // Create edit form modal
    const modal = createEditModal(employee);
    document.body.appendChild(modal);

    new bootstrap.Modal(modal).show();
  } catch (error) {
    alert("Failed to load employee data");
  }
}

function createEditModal(employee) {
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = `editModal-${employee._id}`;
  modalDiv.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Employee</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <form onsubmit="updateEmployee(event, '${employee._id}')">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="${
                employee.email
              }" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" name="fullName" class="form-control" value="${
                employee.fullName
              }" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Department</label>
              <input type="text" name="department" class="form-control" value="${
                employee.department || ""
              }">
            </div>
            <div class="mb-3">
              <label class="form-label">Position</label>
              <input type="text" name="position" class="form-control" value="${
                employee.position || ""
              }">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
  return modalDiv;
}

async function updateEmployee(event, id) {
  event.preventDefault();

  const form = event.target;
  const data = {
    fullName: form.fullName.value,
    department: form.department.value,
    position: form.position.value,
  };

  try {
    const response = await fetch(`/employee/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(
        document.getElementById(`editModal-${id}`)
      ).hide();
      loadEmployees();
    } else {
      alert("Failed to update employee");
    }
  } catch (error) {
    alert("Failed to update employee");
  }
}

function showAddModal() {
  const modal = new bootstrap.Modal(
    document.getElementById("addEmployeeModal")
  );
  modal.show();
}
