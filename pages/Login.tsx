import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Role } from '../types';
import { UserCheck, ShieldCheck, Mail, Lock, ArrowRight, Activity } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('alice@company.com');
  const [role, setRole] = useState<Role>('employee');
  const { login, isAuthenticated } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
    }
  }, [isAuthenticated, navigate, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto flex h-screen items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/50">
          
          {/* Left Side - Visual */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary-600 to-indigo-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 text-center space-y-6">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mx-auto shadow-inner border border-white/20">
                <Activity size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">WorkPulse</h1>
                <p className="text-indigo-200">Efficient Attendance Management for Modern Teams</p>
              </div>
              <div className="pt-8 grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-bold text-lg">Real-time</h3>
                  <p className="text-xs text-indigo-200">Instant tracking updates</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-bold text-lg">Analytics</h3>
                  <p className="text-xs text-indigo-200">Deep insight reports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-gray-100/80 rounded-xl">
              <button
                type="button"
                onClick={() => { setRole('employee'); setEmail('alice@company.com'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  role === 'employee' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserCheck size={18} />
                <span>Employee</span>
              </button>
              <button
                type="button"
                onClick={() => { setRole('manager'); setEmail('bob@company.com'); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  role === 'manager' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShieldCheck size={18} />
                <span>Manager</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    defaultValue="password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 border-gray-300" />
                  <span className="text-gray-500">Remember me</span>
                </label>
                <a href="#" className="text-primary-600 font-medium hover:text-primary-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:shadow-primary-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Sign In</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;