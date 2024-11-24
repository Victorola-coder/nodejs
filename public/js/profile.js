document.addEventListener("DOMContentLoaded", async () => {
  // Load profile data
  try {
    const response = await fetch("/employee/profile");
    const data = await response.json();

    if (response.ok) {
      document.getElementById("email").value = data.email;
      document.getElementById("fullName").value = data.fullName;
      document.getElementById("department").value = data.department || "";
      document.getElementById("position").value = data.position || "";
    } else {
      alert("Failed to load profile");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById("fullName").value,
    department: document.getElementById("department").value,
    position: document.getElementById("position").value,
  };

  try {
    const response = await fetch("/employee/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/auth/logout");
  window.location.href = "/html/login.html";
});
