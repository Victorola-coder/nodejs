document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "/dashboard.html";
    } else {
      const errorDiv = document.getElementById("error-message");
      errorDiv.textContent = result.error || "Login failed";
      errorDiv.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
