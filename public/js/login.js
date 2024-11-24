document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and role
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);

    // Redirect based on role
    if (data.role === "manager") {
      window.location.href = "/dashboard.html";
    } else {
      window.location.href = "/profile.html";
    }
  } catch (error) {
    alert(error.message);
  }
});
