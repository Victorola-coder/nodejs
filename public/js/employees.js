document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();
  setupEventListeners();
});

// Load all employees
async function loadEmployees() {
  try {
    const response = await fetch("/employee/list");
    const employees = await response.json();

    const tableBody = document.getElementById("employeeList");
    tableBody.innerHTML = "";

    employees.forEach((employee) => {
      const row = `
                <tr>
                    <td>${employee.fullName}</td>
                    <td>${employee.email}</td>
                    <td>${employee.department || "-"}</td>
                    <td>${employee.position || "-"}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editEmployee('${
                          employee._id
                        }')">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${
                          employee._id
                        }')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading employees:", error);
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
      const employeeData = {
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
          body: JSON.stringify(employeeData),
        });

        if (response.ok) {
          // Close modal and reload list
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("addEmployeeModal")
          );
          modal.hide();
          e.target.reset();
          loadEmployees();
        } else {
          const data = await response.json();
          alert(data.error || "Failed to add employee");
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("Failed to add employee");
      }
    });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/auth/logout");
    window.location.href = "/html/login.html";
  });
}

// Delete employee
async function deleteEmployee(employeeId) {
  if (!confirm("Are you sure you want to delete this employee?")) {
    return;
  }

  try {
    const response = await fetch(`/employee/delete/${employeeId}`, {
      method: "POST",
    });

    if (response.ok) {
      loadEmployees();
    } else {
      alert("Failed to delete employee");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Failed to delete employee");
  }
}

// Edit employee
async function editEmployee(employeeId) {
  try {
    const response = await fetch(`/employee/${employeeId}`);
    const employee = await response.json();

    // Create and show edit modal
    const modalHtml = `
            <div class="modal fade" id="editEmployeeModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Employee</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="editEmployeeForm">
                            <div class="modal-body">
                                <input type="hidden" name="employeeId" value="${employeeId}">
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-control" value="${
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
            </div>
        `;

    // Add modal to document
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(
      document.getElementById("editEmployeeModal")
    );
    modal.show();

    // Handle form submission
    document
      .getElementById("editEmployeeForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const updateData = {
          fullName: formData.get("fullName"),
          department: formData.get("department"),
          position: formData.get("position"),
        };

        try {
          const response = await fetch(`/employee/update/${employeeId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            modal.hide();
            document.getElementById("editEmployeeModal").remove();
            loadEmployees();
          } else {
            alert("Failed to update employee");
          }
        } catch (error) {
          console.error("Error updating employee:", error);
          alert("Failed to update employee");
        }
      });

    // Clean up modal when hidden
    document
      .getElementById("editEmployeeModal")
      .addEventListener("hidden.bs.modal", function () {
        this.remove();
      });
  } catch (error) {
    console.error("Error editing employee:", error);
    alert("Failed to edit employee");
  }
}
