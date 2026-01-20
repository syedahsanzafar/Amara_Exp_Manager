# Amara Monthly Expense Manager

A beautiful, modern web application for tracking and categorizing monthly expenses with automatic categorization and detailed reporting.

## Features

### 🔐 Secure Login
- Password-protected access (Password: `ahsan1`)
- Personalized welcome message: "Welcome Amara"
- Beautiful animated login screen

### ✨ Add Expense Tab
- **Amount Input**: Enter expense amounts with currency symbol
- **Detail Input**: Describe your expense with quick suggestion chips
- **Auto-Save**: Expenses are automatically saved to local storage
- **Recent Expenses**: View your last 5 expenses at a glance
- **Success Feedback**: Visual confirmation when expenses are added

### 📊 Report Tab
- **Monthly View**: Navigate between months to view different periods
- **Date Range**: Shows expenses from 1st to last day of each month
- **Total Summary**: Large, prominent display of total monthly expenses
- **Category Breakdown**: Expenses automatically grouped by category with:
  - Visual progress bars
  - Percentage of total spending
  - Transaction counts
  - Category icons
- **Detailed List**: Complete list of all expenses for the selected month

### 🏷️ Automatic Categorization

The app intelligently categorizes expenses based on keywords in the detail field:

| Category | Keywords |
|----------|----------|
| **Shopping** | shop, shopping, clothes, dress, shoe, fashion, mall |
| **Groceries** | grocery, groceries, food, vegetable, fruit, market, supermarket |
| **Fees** | fee, fees, tuition, school, education, course, class |
| **Petrol** | petrol, gas, fuel, diesel, gasoline |
| **Car Maintenance** | car, vehicle, maintenance, repair, service, mechanic, oil change, tire |
| **Utilities** | electric, electricity, water, gas bill, utility, internet, phone |
| **Healthcare** | doctor, medicine, medical, hospital, pharmacy, health |
| **Entertainment** | movie, cinema, game, entertainment, fun, party |
| **Transportation** | taxi, uber, bus, train, transport, fare |
| **Dining** | restaurant, cafe, coffee, lunch, dinner, breakfast, eat |
| **Other** | Anything that doesn't match above categories |

## Technology Stack

- **HTML5**: Semantic structure with SEO best practices
- **CSS3**: Modern design with:
  - CSS Variables for theming
  - Gradients and glassmorphism effects
  - Smooth animations and transitions
  - Fully responsive design
- **Vanilla JavaScript**: 
  - Object-oriented architecture
  - LocalStorage for data persistence
  - No external dependencies

## Design Features

### Premium Aesthetics
- Dark theme with vibrant gradient accents
- Glassmorphism effects with backdrop blur
- Smooth micro-animations for enhanced UX
- Floating blob animations on login screen
- Hover effects and interactive elements

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface
- Optimized for tablets and desktops

## Data Storage

All expense data is stored locally in your browser using `localStorage`:
- **Database Name**: `AmaraExpenseDB`
- **Data Persistence**: Data remains even after closing the browser
- **Privacy**: All data stays on your device

## How to Use

1. **Login**: Open `index.html` and enter password: `ahsan1`
2. **Add Expense**: 
   - Enter the amount
   - Describe the expense (use suggestion chips for common categories)
   - Click "Add Expense"
3. **View Reports**:
   - Click the "Report" tab
   - Use arrow buttons to navigate between months
   - View categorized breakdown and detailed list

## File Structure

```
Amara Monthly Expense Manager/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and design system
├── script.js           # Application logic and data management
└── README.md           # This file
```

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Features Implemented

✅ Login with password "ahsan1"  
✅ Welcome message "Welcome Amara"  
✅ Two tabs: Add Expense and Report  
✅ Amount and Detail input fields  
✅ LocalStorage database for persistence  
✅ Monthly expense totals (1st to last day)  
✅ Automatic expense categorization  
✅ Category-based reporting with visual breakdown  
✅ Beautiful, modern UI with animations  
✅ Fully responsive design  
✅ Recent expenses display  
✅ Month navigation in reports  

## Future Enhancement Ideas

- Export reports to PDF/Excel
- Budget tracking and alerts
- Multiple user support
- Data backup and restore
- Charts and graphs
- Recurring expense tracking
- Custom categories
- Dark/Light theme toggle

## Credits

Created for Amara's personal expense management needs.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
