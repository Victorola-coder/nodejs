const API_ENDPOINTS = {
  EMPLOYEES: "/employee/list",
  PROFILE: "/employee/profile",
  ADD_EMPLOYEE: "/employee/add",
  DELETE_EMPLOYEE: "/employee",
};

document.addEventListener("DOMContentLoaded", async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;

  const employeesTable = document.getElementById("employeesTable");
  const addEmployeeForm = document.getElementById("addEmployeeForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const editEmployeeForm = document.getElementById("editEmployeeForm");

  await checkRole();

  // Setup event listeners
  if (addEmployeeForm) {
    addEmployeeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addEmployeeForm);
      const employeeData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(API_ENDPOINTS.ADD_EMPLOYEE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(employeeData),
        });

        if (!response.ok) throw new Error("Failed to add employee");

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addEmployeeModal")
        );
        modal.hide();
        addEmployeeForm.reset();
        await loadEmployees();
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("Failed to add employee");
      }
    });
  }

  if (editEmployeeForm) {
    editEmployeeForm.addEventListener("submit", handleEditSubmit);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return false;
  }

  try {
    const response = await fetch("/auth/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.authenticated) {
      throw new Error("Not authenticated");
    }

    if (!localStorage.getItem("userRole")) {
      localStorage.setItem("userRole", data.role);
    }

    return true;
  } catch (error) {
    console.error("Auth error:", error);
    handleLogout();
    return false;
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/login.html";
}

async function loadEmployees() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    const response = await fetch("/employee/list", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return;
      }
      throw new Error("Failed to fetch employees");
    }

    const employees = await response.json();
    const tbody = document.querySelector("#employeesTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    employees.forEach((employee) => {
      tbody.innerHTML += `
                <tr>
                    <td>${employee.name || ""}</td>
                    <td>${employee.email || ""}</td>
                    <td>${employee.position || ""}</td>
                    <td>${employee.department || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editEmployee('${
                          employee._id
                        }')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${
                          employee._id
                        }')">Delete</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Error loading employees:", error);
    alert("Failed to load employees");
  }
}

async function checkRole() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token || !userRole) {
    handleLogout();
    return;
  }

  if (userRole === "normal") {
    // Hide manager-only elements
    document
      .querySelectorAll(".manager-only")
      .forEach((el) => (el.style.display = "none"));
    await loadOwnProfile();
  } else if (userRole === "manager") {
    await loadEmployees();
  }
}

// Keep your existing functions for editEmployee, deleteEmployee, etc.
// ... rest of your code ...
