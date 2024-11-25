let currentUser = null;

// Check authentication on page load
async function checkAuth() {
  try {
    const response = await fetch("/employee/profile");
    if (!response.ok) {
      window.location.href = "/login.html";
      return;
    }
    currentUser = await response.json();

    if (currentUser.role === "manager") {
      document.getElementById("managerSection").style.display = "block";
      loadEmployees();
    }

    displayProfile();
  } catch (err) {
    window.location.href = "/login.html";
  }
}

// Load all employees (for managers)
async function loadEmployees() {
  try {
    const response = await fetch("/employee");
    const employees = await response.json();

    const tbody = document.getElementById("employeeList");
    tbody.innerHTML = "";

    employees.forEach((emp) => {
      tbody.innerHTML += `
                <tr>
                    <td>${emp.fullName}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department || "-"}</td>
                    <td>${emp.position || "-"}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#editEmployeeModal" 
                            data-employee-id="${emp._id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${
                          emp._id
                        }')">Delete</button>
                    </td>
                </tr>
            `;
    });
  } catch (err) {
    alert("Error loading employees");
  }
}

// Function to display user profile
function displayProfile() {
  const profileInfo = document.getElementById("profileInfo");
  profileInfo.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${currentUser.fullName}</h5>
                <p class="card-text">
                    <strong>Email:</strong> ${currentUser.email}<br>
                    <strong>Department:</strong> ${
                      currentUser.department || "-"
                    }<br>
                    <strong>Position:</strong> ${
                      currentUser.position || "-"
                    }<br>
                    <strong>Role:</strong> ${currentUser.role}
                </p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                    Edit Profile
                </button>
            </div>
        </div>
    `;
}

// Function to pre-fill edit profile modal when it's opened
document
  .getElementById("editProfileModal")
  .addEventListener("show.bs.modal", function (event) {
    document.getElementById("editFullName").value = currentUser.fullName;
    document.getElementById("editDepartment").value =
      currentUser.department || "";
    document.getElementById("editPosition").value = currentUser.position || "";
  });

// Add new employee
async function addEmployee() {
  const form = document.getElementById("addEmployeeForm");
  const formData = new FormData(form);
  const employeeData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (response.ok) {
      bootstrap.Modal.getInstance(
        document.getElementById("addEmployeeModal")
      ).hide();
      loadEmployees();
      form.reset();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (err) {
    alert("Error adding employee");
  }
}

// Delete employee
async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const response = await fetch(`/employee/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadEmployees();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (err) {
    alert("Error deleting employee");
  }
}

// Logout
document.getElementById("logoutLink").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await fetch("/auth/logout");
    window.location.href = "/login.html";
  } catch (err) {
    alert("Error logging out");
  }
});

// Initialize page
checkAuth();

// Handle edit employee modal
document
  .getElementById("editEmployeeModal")
  .addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Get the employee ID from data attribute
    const employeeId = button.getAttribute("data-employee-id");

    // Store the current employee ID for the save function
    this.setAttribute("data-employee-id", employeeId);

    // Fetch employee data and populate the form
    fetch(`/employee/${employeeId}`)
      .then((response) => response.json())
      .then((employee) => {
        document.getElementById("editEmployeeFullName").value =
          employee.fullName;
        document.getElementById("editEmployeeDepartment").value =
          employee.department || "";
        document.getElementById("editEmployeePosition").value =
          employee.position || "";
      })
      .catch((error) => console.error("Error:", error));
  });

// Function to save employee edits
function saveEmployeeEdit() {
  const modal = document.getElementById("editEmployeeModal");
  const employeeId = modal.getAttribute("data-employee-id");

  const updatedData = {
    fullName: document.getElementById("editEmployeeFullName").value,
    department: document.getElementById("editEmployeeDepartment").value,
    position: document.getElementById("editEmployeePosition").value,
  };

  fetch(`/employee/${employeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data._id) {
        // Close modal
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        // Reload employee list
        loadEmployees();
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Make functions globally available
window.saveEmployeeEdit = saveEmployeeEdit;
window.deleteEmployee = deleteEmployee;

// Load employees when page loads (if user is manager)
document.addEventListener("DOMContentLoaded", function () {
  checkAuth().then(() => {
    if (currentUser.role === "manager") {
      loadEmployees();
    }
  });
});
