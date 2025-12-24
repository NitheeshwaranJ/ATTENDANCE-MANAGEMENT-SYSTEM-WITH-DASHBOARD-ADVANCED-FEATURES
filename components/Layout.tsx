import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  CalendarDays, 
  LogOut, 
  Users, 
  FileBarChart,
  UserCircle,
  Menu,
  X,
  Activity,
  ChevronRight
} from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  const employeeLinks = [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee/history', icon: CalendarDays, label: 'My History' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/manager/reports', icon: FileBarChart, label: 'Reports' },
    { to: '/manager/employees', icon: Users, label: 'Employees' },
  ];

  const links = currentUser.role === 'manager' ? managerLinks : employeeLinks;

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-600 rounded-lg">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">WorkPulse</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-2xl
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl shadow-lg shadow-primary-500/20">
               <Activity size={24} className="text-white" />
             </div>
             <span className="text-2xl font-bold text-white tracking-tight">WorkPulse</span>
           </div>
        </div>

        {/* User Profile Snippet */}
        <div className="p-6">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center gap-3">
            <div className="relative">
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-600"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 relative z-10">
                    <link.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                    {link.label}
                  </div>
                  {/* Active Indicator */}
                  {isActive && <ChevronRight size={16} className="opacity-70" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-[-2px] transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-full relative w-full pt-16 md:pt-0">
        {/* Top Header - Desktop */}
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-bold text-slate-800">
             {currentUser.role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </div>
             <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
               <UserCircle size={20} />
             </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;