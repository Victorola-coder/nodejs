document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  loadProfile();
});

async function loadProfile() {
  try {
    const response = await fetch("/api/employees/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load profile");

    const profile = await response.json();

    // Fill form with profile data
    document.getElementById("email").value = profile.email;
    document.getElementById("fullName").value = profile.fullName;
    document.getElementById("department").value = profile.department || "";
    document.getElementById("position").value = profile.position || "";
  } catch (error) {
    alert("Error loading profile");
    console.error(error);
  }
}

// Update profile
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const profileData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/employees/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) throw new Error("Failed to update profile");

    alert("Profile updated successfully");
  } catch (error) {
    alert("Error updating profile");
    console.error(error);
  }
});

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/login.html";
});
