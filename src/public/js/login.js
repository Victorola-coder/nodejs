document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.classList.add("loading");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      window.location.href = "/index.html";
    } else {
      alert(data.message);
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }
  } catch (error) {
    alert("Error logging in");
    submitButton.disabled = false;
    submitButton.classList.remove("loading");
  }
});
