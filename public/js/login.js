document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const credentials = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      window.location.href =
        data.role === "manager" ? "/dashboard.html" : "/profile.html";
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    alert(error.message);
  }
});

async function login(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      window.location.href = "/dashboard.html";
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    alert(error.message);
  }
}
