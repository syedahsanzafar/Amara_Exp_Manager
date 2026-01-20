// ===== Configuration =====
const CONFIG = {
    BIN_ID: '696f363743b1c97be93c5fe2',
    MASTER_KEY: '$2a$10$FAreA8FhhM2chMUDvbLCK.H9pKbBzuArhUryvH1y.u31Sft/hD6NC',
    API_URL: 'https://api.jsonbin.io/v3/b'
};

// ===== Database Management =====
class ExpenseDatabase {
    constructor() {
        this.dbName = 'AmaraExpenseDB';
        this.expenses = this.loadLocalExpenses();
        this.isOnline = false;
    }

    loadLocalExpenses() {
        const stored = localStorage.getItem(this.dbName);
        return stored ? JSON.parse(stored) : [];
    }

    saveLocalExpenses() {
        localStorage.setItem(this.dbName, JSON.stringify(this.expenses));
    }

    async checkOnlineStatus() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/${CONFIG.BIN_ID}/latest`, {
                method: 'HEAD', // Light request just to check connectivity
                headers: { 'X-Master-Key': CONFIG.MASTER_KEY }
            });
            this.isOnline = response.ok;
        } catch (error) {
            this.isOnline = false;
        }
        return this.isOnline;
    }

    async syncWithCloud() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/${CONFIG.BIN_ID}/latest`, {
                headers: { 'X-Master-Key': CONFIG.MASTER_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.record && Array.isArray(data.record)) {
                    this.expenses = data.record;
                    this.saveLocalExpenses();
                    this.isOnline = true;
                    return true;
                }
            }
        } catch (error) {
            console.error('Sync failed:', error);
            this.isOnline = false;
        }
        return false;
    }

    async pushToCloud() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/${CONFIG.BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': CONFIG.MASTER_KEY
                },
                body: JSON.stringify(this.expenses)
            });
            this.isOnline = response.ok;
        } catch (error) {
            console.error('Push failed:', error);
            this.isOnline = false;
        }
    }

    async addExpense(amount, detail) {
        const expense = {
            id: Date.now(),
            amount: parseFloat(amount),
            detail: detail.trim(),
            date: new Date().toISOString(),
            category: this.categorizeExpense(detail)
        };
        this.expenses.push(expense);
        this.saveLocalExpenses();
        await this.pushToCloud();
        return expense;
    }

    categorizeExpense(detail) {
        const detailLower = detail.toLowerCase();
        const categories = {
            'Shopping': ['shop', 'shopping', 'clothes', 'dress', 'shoe', 'fashion', 'mall'],
            'Groceries': ['grocery', 'groceries', 'food', 'vegetable', 'fruit', 'market', 'supermarket'],
            'Fees': ['fee', 'fees', 'tuition', 'school', 'education', 'course', 'class'],
            'Petrol': ['petrol', 'gas', 'fuel', 'diesel', 'gasoline'],
            'Car Maintenance': ['car', 'vehicle', 'maintenance', 'repair', 'service', 'mechanic', 'oil change', 'tire'],
            'Utilities': ['electric', 'electricity', 'water', 'gas bill', 'utility', 'internet', 'phone'],
            'Healthcare': ['doctor', 'medicine', 'medical', 'hospital', 'pharmacy', 'health'],
            'Entertainment': ['movie', 'cinema', 'game', 'entertainment', 'fun', 'party'],
            'Transportation': ['taxi', 'uber', 'bus', 'train', 'transport', 'fare'],
            'Dining': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'eat']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => detailLower.includes(keyword))) {
                return category;
            }
        }
        return 'Other';
    }

    getExpensesByMonth(year, month) {
        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        });
    }

    getRecentExpenses(limit = 5) {
        return [...this.expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    getCategoryBreakdown(expenses) {
        const breakdown = {};
        expenses.forEach(expense => {
            const category = expense.category;
            if (!breakdown[category]) {
                breakdown[category] = { total: 0, count: 0, expenses: [] };
            }
            breakdown[category].total += expense.amount;
            breakdown[category].count += 1;
            breakdown[category].expenses.push(expense);
        });
        return breakdown;
    }
}

// ===== UI Controller =====
class UIController {
    constructor(db) {
        this.db = db;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.loginScreen = document.getElementById('loginScreen');
        this.loginForm = document.getElementById('loginForm');
        this.passwordInput = document.getElementById('password');
        this.loginError = document.getElementById('loginError');
        this.mainApp = document.getElementById('mainApp');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.currentMonthDisplay = document.getElementById('currentMonth');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        this.expenseForm = document.getElementById('expenseForm');
        this.amountInput = document.getElementById('amount');
        this.detailInput = document.getElementById('detail');
        this.successMessage = document.getElementById('successMessage');
        this.recentExpensesList = document.getElementById('recentExpensesList');
        this.reportMonth = document.getElementById('reportMonth');
        this.reportDateRange = document.getElementById('reportDateRange');
        this.totalExpense = document.getElementById('totalExpense');
        this.expenseCount = document.getElementById('expenseCount');
        this.categoryBreakdown = document.getElementById('categoryBreakdown');
        this.detailedExpensesList = document.getElementById('detailedExpensesList');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');

        // Status indicator elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = this.statusIndicator.querySelector('.status-text');
    }

    attachEventListeners() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        this.expenseForm.addEventListener('submit', (e) => this.handleAddExpense(e));
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
    }

    async updateStatusDisplay() {
        const isOnline = await this.db.checkOnlineStatus();
        this.statusIndicator.classList.toggle('online', isOnline);
        this.statusIndicator.classList.toggle('offline', !isOnline);
        this.statusText.textContent = isOnline ? 'Online' : 'Offline';
    }

    async handleLogin(e) {
        e.preventDefault();
        const password = this.passwordInput.value;
        if (password === 'ahsan1') {
            this.loginScreen.classList.add('hidden');
            this.mainApp.classList.remove('hidden');
            this.updateCurrentMonth();

            // Initial status check and sync
            await this.updateStatusDisplay();
            await this.db.syncWithCloud();
            this.updateStatusDisplay(); // Refresh after sync

            this.updateRecentExpenses();
            this.updateReport();

            // Setup periodic status check (every 30 seconds)
            setInterval(() => this.updateStatusDisplay(), 30000);
        } else {
            this.loginError.textContent = 'Incorrect password. Please try again.';
            this.passwordInput.value = '';
            this.passwordInput.focus();
        }
    }

    handleLogout() {
        this.mainApp.classList.add('hidden');
        this.loginScreen.classList.remove('hidden');
        this.passwordInput.value = '';
        this.loginError.textContent = '';
    }

    switchTab(tabName) {
        this.tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
        this.tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === `${tabName}Tab`));
        if (tabName === 'report') this.updateReport();
    }

    async handleAddExpense(e) {
        e.preventDefault();
        const amount = this.amountInput.value;
        const detail = this.detailInput.value;

        if (amount && detail) {
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span>Saving...</span>';

            await this.db.addExpense(amount, detail);
            await this.updateStatusDisplay();

            this.successMessage.classList.remove('hidden');
            setTimeout(() => this.successMessage.classList.add('hidden'), 3000);

            this.expenseForm.reset();
            this.amountInput.focus();
            this.updateRecentExpenses();

            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    updateCurrentMonth() {
        const now = new Date();
        const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        this.currentMonthDisplay.textContent = monthName;
    }

    updateRecentExpenses() {
        const recent = this.db.getRecentExpenses(5);
        if (recent.length === 0) {
            this.recentExpensesList.innerHTML = this.getEmptyState('No expenses yet', 'Add your first expense to get started');
            return;
        }
        this.recentExpensesList.innerHTML = recent.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-detail">${this.escapeHtml(expense.detail)}</div>
                    <div class="expense-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-amount">RS. ${expense.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateReport();
    }

    updateReport() {
        const expenses = this.db.getExpensesByMonth(this.currentYear, this.currentMonth);
        const monthName = new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        this.reportMonth.textContent = monthName;
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        this.reportDateRange.textContent = `${firstDay.getDate()} - ${lastDay.getDate()}`;
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        this.totalExpense.textContent = `RS. ${total.toFixed(2)}`;
        this.expenseCount.textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
        this.updateCategoryBreakdown(expenses, total);
        this.updateDetailedList(expenses);
    }

    updateCategoryBreakdown(expenses, total) {
        const breakdown = this.db.getCategoryBreakdown(expenses);
        const categories = Object.entries(breakdown).sort((a, b) => b[1].total - a[1].total);
        if (categories.length === 0) {
            this.categoryBreakdown.innerHTML = this.getEmptyState('No expenses this month', 'Start adding expenses to see the breakdown');
            return;
        }
        const categoryIcons = {
            'Shopping': '🛍️', 'Groceries': '🛒', 'Fees': '📚', 'Petrol': '⛽',
            'Car Maintenance': '🔧', 'Utilities': '💡', 'Healthcare': '⚕️',
            'Entertainment': '🎬', 'Transportation': '🚗', 'Dining': '🍽️', 'Other': '📦'
        };
        this.categoryBreakdown.innerHTML = categories.map(([category, data]) => {
            const percentage = total > 0 ? (data.total / total * 100) : 0;
            const icon = categoryIcons[category] || '📦';
            return `
                <div class="category-item">
                    <div class="category-header">
                        <div class="category-name">
                            <div class="category-icon">${icon}</div>
                            <div class="category-title">${category}</div>
                        </div>
                        <div class="category-total">RS. ${data.total.toFixed(2)}</div>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="category-stats">
                        <span>${data.count} transaction${data.count !== 1 ? 's' : ''}</span>
                        <span>${percentage.toFixed(1)}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateDetailedList(expenses) {
        if (expenses.length === 0) {
            this.detailedExpensesList.innerHTML = this.getEmptyState('No expenses this month', 'Add expenses to see them here');
            return;
        }
        const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        this.detailedExpensesList.innerHTML = sorted.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-detail">${this.escapeHtml(expense.detail)} <span style="color: var(--text-muted); font-weight: normal; font-size: 0.9rem;">(${expense.category})</span></div>
                    <div class="expense-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-amount">RS. ${expense.amount.toFixed(2)}</div>
            </div>
        `).join('');
        document.getElementById('detailCount').textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getEmptyState(title, description) {
        return `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <h4>${title}</h4>
                <p>${description}</p>
            </div>
        `;
    }
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    const db = new ExpenseDatabase();
    const ui = new UIController(db);
    document.getElementById('password').focus();
});
