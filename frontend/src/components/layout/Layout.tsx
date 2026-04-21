import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Receipt, PieChart, FileText, RefreshCw, Target, LogOut, Menu, X, Calendar as CalendarIcon, Award } from 'lucide-react';
import { authService } from '../../services/authService';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budgets', icon: PieChart, label: 'Budgets' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/recurring', icon: RefreshCw, label: 'Recurring' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/savings', icon: Target, label: 'Goals' },
    { path: '/achievements', icon: Award, label: 'Achievements' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass-panel border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-surface/40">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Finance Tracker
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-primary-400" />
                  )}
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 px-4 py-4 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 truncate">
                  <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-xs text-white/50 truncate max-w-[120px]">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="mb-4 flex items-center justify-between bg-black/20 rounded-xl p-2 border border-white/5">
              <button onClick={() => document.body.className = ''} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-transparent hover:border-white transition-all" title="Midnight"></button>
              <button onClick={() => document.body.className = 'theme-cyberpunk'} className="w-6 h-6 rounded-full bg-fuchsia-900 border-2 border-transparent hover:border-white transition-all" title="Cyberpunk"></button>
              <button onClick={() => document.body.className = 'theme-ocean'} className="w-6 h-6 rounded-full bg-teal-900 border-2 border-transparent hover:border-white transition-all" title="Ocean"></button>
              <button onClick={() => document.body.className = 'theme-forest'} className="w-6 h-6 rounded-full bg-emerald-900 border-2 border-transparent hover:border-white transition-all" title="Forest"></button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen relative z-10">
        {/* Top bar (Mobile only) */}
        <header className="lg:hidden glass-panel border-b border-white/10 sticky top-0 z-30">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white/60 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white">
                {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <div className="w-6" /> {/* Spacer */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 h-[calc(100vh-64px)] lg:h-screen overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
