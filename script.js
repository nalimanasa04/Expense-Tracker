// --- SIGNUP PAGE LOGIC ---
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (username === "" || password === "") {
      alert("Please fill in all fields!");
      return;
    }

    if (localStorage.getItem(username)) {
      alert("User already exists! Please login.");
      return;
    }

    // Save credentials
    localStorage.setItem(username, password);
    alert("Account created successfully! Please login.");
    window.location.href = "login.html";
  });
}

// --- LOGIN PAGE LOGIC ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
      localStorage.setItem("currentUser", username);
      alert("Login successful!");
      window.location.href = "main.html";
    } else {
      alert("Invalid username or password!");
    }
  });
}

// --- MAIN PAGE LOGIC ---
const addBtn = document.getElementById("addBtn");
if (addBtn) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
  }

  const transactionTable = document.getElementById("transactionTable");
  const totalIncome = document.getElementById("totalIncome");
  const totalExpense = document.getElementById("totalExpense");
  const balance = document.getElementById("balance");

  let transactions = JSON.parse(localStorage.getItem(currentUser + "_transactions")) || [];

  renderTransactions();

  addBtn.addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    if (!amount || !date) {
      alert("Please fill all fields!");
      return;
    }

    transactions.push({ amount, type, date });
    localStorage.setItem(currentUser + "_transactions", JSON.stringify(transactions));
    renderTransactions();
  });

  function renderTransactions() {
    transactionTable.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach((t, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>₹${t.amount}</td>
        <td>${t.type}</td>
        <td>${t.date}</td>
        <td><button class="deleteBtn" data-index="${index}">Delete</button></td>
      `;
      transactionTable.appendChild(row);

      if (t.type === "Income") income += t.amount;
      else expense += t.amount;
    });

    totalIncome.textContent = `₹${income}`;
    totalExpense.textContent = `₹${expense}`;
    balance.textContent = `₹${income - expense}`;

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        transactions.splice(index, 1);
        localStorage.setItem(currentUser + "_transactions", JSON.stringify(transactions));
        renderTransactions();
      });
    });
  }
}

// --- LOGOUT BUTTON ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
