const form = document.getElementById('expenseForm');
const table = document.getElementById('expensesTable').querySelector('tbody');

function saveExpenses(expenses) {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getExpenses() {
  return JSON.parse(localStorage.getItem('expenses')) || [];
}

function addExpenseToTable({ date, amount, note }) {
  const row = table.insertRow();
  row.innerHTML = `<td>${date}</td><td>${amount}</td><td>${note}</td>`;
}

form.onsubmit = function (e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const note = document.getElementById('note').value;
  const date = new Date().toLocaleDateString('ar-SA');

  const expense = { date, amount: parseFloat(amount), note };
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  addExpenseToTable(expense);
  updateChart(expenses);

  form.reset();
};

window.onload = function () {
  const expenses = getExpenses();
  expenses.forEach(addExpenseToTable);
  updateChart(expenses);
};

function printExpenses() {
  window.print();
}

// Chart logic
let chart;

function updateChart(expenses) {
  const dailyTotals = {};

  expenses.forEach(exp => {
    if (!dailyTotals[exp.date]) dailyTotals[exp.date] = 0;
    dailyTotals[exp.date] += exp.amount;
  });

  const labels = Object.keys(dailyTotals);
  const data = Object.values(dailyTotals);

  const ctx = document.getElementById('expensesChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'إجمالي المصروفات اليومية',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}