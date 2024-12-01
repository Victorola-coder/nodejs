const readline = require("readline");
const { io } = require("socket.io-client");
const chalk = require("chalk");

const socket = io("http://localhost:3000");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Global state
let currentUser = null;
let currentChat = null;

// Main menu display function
function showMainMenu() {
  console.clear();
  console.log(chalk.cyan("=== Chat Room Application ==="));
  console.log(chalk.cyan("========================="));
  console.log(chalk.cyan("1) Login"));
  console.log(chalk.cyan("2) Register"));
  console.log(chalk.cyan("3) Quit"));
  console.log(chalk.cyan("========================="));

  rl.question("User Command > ", handleMainMenuChoice);
}

// Handle main menu choices
async function handleMainMenuChoice(choice) {
  switch (choice) {
    case "1":
      await showLoginMenu();
      break;
    case "2":
      await showRegisterMenu();
      break;
    case "3":
      console.log(chalk.yellow("Goodbye!"));
      process.exit(0);
    default:
      console.log(chalk.red("Invalid choice. Please try again."));
      showMainMenu();
  }
}

// Login menu
async function showLoginMenu() {
  console.clear();
  console.log(chalk.cyan("=== Login ==="));

  rl.question("Username: ", (username) => {
    rl.question("Password: ", (password) => {
      socket.emit("login", { username, password }, (response) => {
        if (response.success) {
          currentUser = username;
          console.log(chalk.green("Login successful!"));
          showUserList();
        } else {
          console.log(chalk.red(response.message));
          setTimeout(showMainMenu, 2000);
        }
      });
    });
  });
}

// Register menu
async function showRegisterMenu() {
  console.clear();
  console.log(chalk.cyan("=== Register ==="));

  rl.question("Username: ", (username) => {
    rl.question("Email: ", (email) => {
      rl.question("Password: ", (password) => {
        socket.emit("register", { username, email, password }, (response) => {
          if (response.success) {
            console.log(chalk.green("Registration successful! Please login."));
            setTimeout(showMainMenu, 2000);
          } else {
            console.log(chalk.red(response.message));
            setTimeout(showMainMenu, 2000);
          }
        });
      });
    });
  });
}

// User list display
function showUserList() {
  console.clear();
  console.log(chalk.cyan("=== Users ==="));
  console.log(chalk.yellow("\nOffline Users:"));
  offlineUsers.forEach((user) => {
    console.log(chalk.gray(`- ${user}`));
  });

  console.log(chalk.yellow("\nOnline Users:"));
  onlineUsers.forEach((user) => {
    if (user !== currentUser) {
      console.log(chalk.green(`- ${user}`));
    }
  });

  console.log(chalk.cyan("\nm) direct message    q) quit"));
  rl.question("> ", handleUserListChoice);
}

// Handle user list choices
function handleUserListChoice(choice) {
  switch (choice.toLowerCase()) {
    case "m":
      showDirectMessagePrompt();
      break;
    case "q":
      currentUser = null;
      showMainMenu();
      break;
    default:
      console.log(chalk.red("Invalid choice. Please try again."));
      showUserList();
  }
}

// Direct message prompt
function showDirectMessagePrompt() {
  rl.question("Enter username to message: ", (username) => {
    if (username === "GoBackToMainMenu") {
      showUserList();
      return;
    }

    if (!onlineUsers.includes(username)) {
      console.log(chalk.red("User not found or offline."));
      setTimeout(showDirectMessagePrompt, 2000);
      return;
    }

    currentChat = username;
    showChatWindow(username);
  });
}

// Chat window
function showChatWindow(username) {
  console.clear();
  console.log(chalk.cyan(`=== Chat with ${username} ===`));
  console.log(chalk.gray("Type GoBackToMainMenu to return\n"));

  // Start message input loop
  messageLoop();
}

// Message input loop
function messageLoop() {
  rl.question("You> ", (message) => {
    if (message === "GoBackToMainMenu") {
      currentChat = null;
      showUserList();
      return;
    }

    socket.emit("directMessage", {
      to: currentChat,
      message: message,
    });

    messageLoop();
  });
}

// Socket event handlers
let onlineUsers = [];
let offlineUsers = [];

socket.on("userListUpdate", ({ online, offline }) => {
  onlineUsers = online;
  offlineUsers = offline;
  if (currentUser && !currentChat) {
    showUserList();
  }
});

socket.on("message", ({ from, message }) => {
  if (currentChat === from) {
    console.log(`\n${from}> ${message}`);
  } else {
    console.log(chalk.yellow(`\nNew message from ${from}: ${message}`));
  }
  if (currentChat) {
    rl.prompt();
  }
});

// Start the application
showMainMenu();
