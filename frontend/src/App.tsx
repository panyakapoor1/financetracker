import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import RecurringTransactions from './pages/RecurringTransactions';
import SavingsGoals from './pages/SavingsGoals';
import CalendarView from './pages/Calendar';
import Achievements from './pages/Achievements';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Layout><Transactions /></Layout></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Layout><Budgets /></Layout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
          <Route path="/recurring" element={<PrivateRoute><Layout><RecurringTransactions /></Layout></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Layout><CalendarView /></Layout></PrivateRoute>} />
          <Route path="/savings" element={<PrivateRoute><Layout><SavingsGoals /></Layout></PrivateRoute>} />
          <Route path="/achievements" element={<PrivateRoute><Layout><Achievements /></Layout></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <div className="text-center glass-panel p-12 rounded-3xl">
                  <h1 className="text-7xl font-bold text-primary-500 mb-4 drop-shadow-lg">404</h1>
                  <p className="text-xl text-white/60 mb-8">Page not found</p>
                  <a href="/dashboard" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-500 transition-colors">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
