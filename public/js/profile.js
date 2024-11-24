// Check authentication on page load
checkAuth();

async function checkAuth() {
  const response = await fetch("/auth/check");
  const data = await response.json();

  if (!data.authenticated) {
    window.location.href = "/login.html";
    return;
  }

  // Hide manager links for non-managers
  if (data.role !== "manager") {
    document
      .querySelectorAll(".manager-only")
      .forEach((el) => (el.style.display = "none"));
  }

  loadProfile();
}

async function loadProfile() {
  try {
    const response = await fetch("/employee/profile");
    const user = await response.json();

    document.getElementById("email").value = user.email;
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("department").value = user.department || "";
    document.getElementById("position").value = user.position || "";
  } catch (error) {
    alert("Failed to load profile");
  }
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fullName: document.getElementById("fullName").value,
    department: document.getElementById("department").value,
    position: document.getElementById("position").value,
  };

  try {
    const response = await fetch("/employee/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  } catch (error) {
    alert("Failed to update profile");
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/auth/logout");
  window.location.href = "/login.html";
});
