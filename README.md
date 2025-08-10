# Employee Salary Management

A comprehensive React Native mobile application for managing employee salary data with local storage.

## Features

### 🔐 Security
- **Local Storage**: All data stored securely on device
- **Data Privacy**: Complete control over your employee data
- **Settings Management**: Easy configuration and changes

### 👥 Employee Management
- **Add Employees**: Complete employee information with validation
- **Edit Employees**: Update employee details anytime
- **Delete Employees**: Remove employees with confirmation
- **Search**: Find employees by name, position, department, or email
- **Active/Inactive Status**: Track employee status

### 📊 Data & Analytics
- **Employee Statistics**: Total, active, and inactive employee counts
- **Salary Analytics**: Total salary calculations
- **Local Storage**: All data stored securely on device
- **Data Export**: Clear all data option for privacy

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Responsive Design**: Optimized for mobile devices
- **Floating Action Button**: Quick access to add new employees
- **Pull to Refresh**: Update data with swipe gesture
- **Form Validation**: Comprehensive input validation

## Employee Data Fields

- **Name** (Required)
- **Position** (Required)
- **Department** (Required)
- **Salary** (Required)
- **Start Date** (Required)
- **End Date** (Optional)
- **Email** (Optional)
- **Phone** (Optional)
- **Active Status** (Toggle)

## Screens

### 1. Employee List (Home)
- Overview of all employees
- Search functionality
- Statistics dashboard
- Floating action button for adding employees

### 2. Add Employee
- Comprehensive form with validation
- All employee fields included
- Success/error handling

### 3. Edit Employee
- Pre-populated form with existing data
- Update functionality
- Validation and error handling

### 4. Settings
- Currency selection (ETB/USD)
- Data management options
- App information

## Technical Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS) for styling
- **AsyncStorage** for local data persistence
- **Expo Router** for navigation
- **React Native Vector Icons** for icons

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd schedule_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## Project Structure

```
schedule_tracker/
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Employee list
│   │   ├── settings.tsx   # Settings screen
│   │   └── _layout.tsx    # Tab layout
│   ├── add-employee.tsx   # Add employee screen
│   ├── edit-employee.tsx  # Edit employee screen
│   └── _layout.tsx        # Main app layout
├── components/             # Reusable components
│   ├── EmployeeCard.tsx   # Employee display card
│   ├── EmployeeForm.tsx   # Add/edit form
│   ├── PinVerification.tsx # PIN verification
│   └── PinSetup.tsx       # First-time PIN setup
├── types/                  # TypeScript definitions
│   └── employee.ts        # Employee and settings types
├── utils/                  # Utility functions
│   ├── storage.ts         # AsyncStorage operations
│   └── helpers.ts         # Helper functions
└── assets/                # Images and fonts
```

## Key Components

### StorageService
Handles all local storage operations:
- Employee CRUD operations
- Settings management
- PIN operations

### EmployeeCard
Displays employee information with:
- Edit and delete actions
- Status indicators
- Formatted data display

### EmployeeForm
Comprehensive form for adding/editing employees with:
- Input validation
- Error handling
- Responsive design

### PinVerification/PinSetup
Security components for:
- PIN verification
- First-time PIN setup
- PIN management

## Data Persistence

All data is stored locally using AsyncStorage:
- Employee records
- App settings
- PIN configuration

## Security Features

- **PIN Protection**: Optional 4-digit PIN
- **Local Storage**: Data stays on device
- **Confirmation Dialogs**: Prevent accidental deletions
- **Input Validation**: Prevent invalid data entry

## Future Enhancements

- [ ] Data export/import functionality
- [ ] Salary history tracking
- [ ] Department-wise analytics
- [ ] Backup to cloud storage
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Salary comparison tools
- [ ] Employee photo support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
