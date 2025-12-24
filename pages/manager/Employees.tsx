import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Mail, Hash, UserPlus, MoreHorizontal } from 'lucide-react';

const Employees: React.FC = () => {
  const { users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const employees = users.filter(u => u.role === 'employee' && (
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Members</h1>
           <p className="text-slate-500 text-sm mt-1">Manage employee profiles and details.</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
           <UserPlus size={18} />
           Add Employee
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[600px]">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map(employee => (
            <div key={employee.id} className="group flex flex-col items-center bg-white rounded-2xl p-6 border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative">
               <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600">
                  <MoreHorizontal size={20} />
               </button>
               
               <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <img 
                    src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.name}`} 
                    alt={employee.name} 
                    className="w-24 h-24 rounded-full bg-slate-100 object-cover border-4 border-white shadow-md relative z-10"
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full z-20"></div>
               </div>
               
              <h3 className="text-lg font-bold text-slate-900 text-center">{employee.name}</h3>
              <span className="inline-block px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full mt-2 mb-6 border border-slate-100">
                {employee.department}
              </span>
              
              <div className="w-full space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="p-1.5 bg-slate-50 rounded-md text-slate-400">
                    <Mail size={14} />
                  </div>
                  <span className="truncate font-medium">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="p-1.5 bg-slate-50 rounded-md text-slate-400">
                    <Hash size={14} />
                  </div>
                  <span className="font-mono text-xs">{employee.employeeId}</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                View Profile
              </button>
            </div>
          ))}
          {employees.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={24} />
              </div>
              <p>No employees found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;