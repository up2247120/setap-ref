const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let goal = JSON.parse(localStorage.getItem('goal')) || 0;
let editingIndex = -1;

document.getElementById('add-btn').addEventListener('click', () => {
  const desc = document.getElementById('description').value;
  const amt = parseFloat(document.getElementById('amount').value);
  const cat = document.getElementById('category').value;

  if (!desc || isNaN(amt)) return alert('Please enter all fields.');

  const expense = { desc, amt, cat };

  if (editingIndex >= 0) {
    expenses[editingIndex] = expense;
    editingIndex = -1;
  } else {
    expenses.push(expense);
  }

  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderDashboard();
  resetForm();
  alert(editingIndex >= 0 ? 'Expense Updated!' : 'Expense Added!');
});

document.getElementById('set-goal-btn').addEventListener('click', () => {
  goal = parseFloat(document.getElementById('goal').value);
  if (isNaN(goal)) return alert("Enter a valid goal.");
  localStorage.setItem('goal', JSON.stringify(goal));
  alert('Goal Set!');
});

function renderDashboard() {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  const summary = {};
  expenses.forEach(e => {
    summary[e.cat] = (summary[e.cat] || 0) + e.amt;
  });

  const categories = Object.keys(summary);
  const values = Object.values(summary);

  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Spending by Category (£)',
        data: values,
        backgroundColor: '#00796b'
      }]
    }
  });

  const list = document.getElementById('expense-list');
  list.innerHTML = '';
  expenses.forEach((e, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${e.desc} - £${e.amt.toFixed(2)} [${e.cat}]
      <button onclick="editExpense(${index})">✏️</button>
      <button onclick="deleteExpense(${index})">🗑️</button>
    `;
    list.appendChild(li);
  });
}

function editExpense(index) {
  const e = expenses[index];
  document.getElementById('description').value = e.desc;
  document.getElementById('amount').value = e.amt;
  document.getElementById('category').value = e.cat;
  editingIndex = index;
  showTab('add');
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderDashboard();
  }
}

function resetForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').selectedIndex = 0;
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => div.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
  if (tab === 'dashboard') renderDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});
