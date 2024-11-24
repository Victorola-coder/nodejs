async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const response = await fetch("/auth/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
  } catch (error) {
    window.location.href = "/login.html";
  }
}
