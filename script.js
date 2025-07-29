const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let goal = JSON.parse(localStorage.getItem('goal')) || 0;
let myChart = null;  // Chart.js instance

document.getElementById('add-btn').addEventListener('click', () => {
  const desc = document.getElementById('description').value.trim();
  const amt = parseFloat(document.getElementById('amount').value);
  const cat = document.getElementById('category').value;

  if (!desc || isNaN(amt) || amt <= 0) {
    return alert('Please enter a valid description and amount greater than zero.');
  }

  expenses.push({ desc, amt, cat });
  localStorage.setItem('expenses', JSON.stringify(expenses));

  renderDashboard();
  alert('Expense Added!');

  // Clear inputs for better UX
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').selectedIndex = 0;
});

document.getElementById('set-goal-btn').addEventListener('click', () => {
  const newGoal = parseFloat(document.getElementById('goal').value);

  if (isNaN(newGoal) || newGoal <= 0) {
    return alert('Please enter a valid savings goal greater than zero.');
  }

  goal = newGoal;
  localStorage.setItem('goal', JSON.stringify(goal));
  alert('Goal Set!');

  // Clear input after setting goal
  document.getElementById('goal').value = '';
});

function renderDashboard() {
  const ctx = document.getElementById('spendingChart').getContext('2d');

  const summary = {};
  expenses.forEach(e => {
    summary[e.cat] = (summary[e.cat] || 0) + e.amt;
  });

  const categories = Object.keys(summary);
  const values = Object.values(summary);

  // Destroy existing chart before creating a new one
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Spending by Category (£)',
        data: values,
        backgroundColor: '#00796b'
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

  // Render the expense list
  const list = document.getElementById('expense-list');
  list.innerHTML = '';
  expenses.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.desc} - £${e.amt.toFixed(2)} [${e.cat}]`;
    list.appendChild(li);
  });
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(div => div.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';

  if (tab === 'dashboard') {
    renderDashboard();
  }
}

// Initialize dashboard view on page load
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});
