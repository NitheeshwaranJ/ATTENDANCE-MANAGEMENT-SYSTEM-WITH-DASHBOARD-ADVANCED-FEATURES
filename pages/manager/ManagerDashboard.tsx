import React from 'react';
import { useStore } from '../../store/useStore';
import StatCard from '../../components/StatCard';
import { getTodayStr } from '../../utils/helpers';
import { Users, UserCheck, UserX, Clock, ArrowUpRight, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AttendanceStatus } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { users, attendanceRecords } = useStore();
  
  const employees = users.filter(u => u.role === 'employee');
  const employeeIds = employees.map(u => u.id);
  const todayStr = getTodayStr();
  
  // Today's stats - Only for Employees
  const todayRecords = attendanceRecords.filter(r => r.date === todayStr && employeeIds.includes(r.userId));
  
  // Calculate counts
  const onTimeCount = todayRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
  const lateCount = todayRecords.filter(r => r.status === AttendanceStatus.LATE).length;
  const totalPresentCount = onTimeCount + lateCount;
  const absentCount = Math.max(0, employees.length - totalPresentCount);
  
  // Chart Data: Attendance by Dept
  const deptData = employees.reduce((acc, curr) => {
    const dept = curr.department;
    if (!acc[dept]) acc[dept] = 0;
    const isPresent = todayRecords.find(r => r.userId === curr.id && (r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE));
    if (isPresent) acc[dept]++;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.keys(deptData).map(dept => ({
    name: dept,
    present: deptData[dept],
    total: employees.filter(e => e.department === dept).length
  }));

  const pieData = [
    { name: 'On Time', value: onTimeCount, color: '#10b981' }, // Emerald-500
    { name: 'Late', value: lateCount, color: '#f59e0b' }, // Amber-500
    { name: 'Absent', value: absentCount, color: '#ef4444' }, // Red-500
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manager Dashboard</h1>
           <p className="text-slate-500">Real-time insights and performance metrics.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={16} /> Filter
           </button>
           <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all hover:-translate-y-0.5">
              Export Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Staff" value={employees.length} icon={Users} color="blue" />
        <StatCard 
          label="Present" 
          value={totalPresentCount} 
          icon={UserCheck} 
          color="green" 
          subtext={`${((totalPresentCount/Math.max(employees.length, 1))*100).toFixed(0)}% Rate`} 
        />
        <StatCard label="Late Arrivals" value={lateCount} icon={Clock} color="yellow" />
        <StatCard label="Absent" value={absentCount} icon={UserX} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Department Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Department Attendance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#f1f5f9" radius={[6, 6, 0, 0]} name="Total Staff" />
                <Bar dataKey="present" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Present Today" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Status Overview</h3>
          <div className="h-80 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-slate-800">{totalPresentCount}</span>
              <span className="text-xs text-slate-400 font-medium uppercase">Checked In</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Live Status Feed</h3>
          <button className="text-sm text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 group">
            View All <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Employee</th>
                <th className="px-8 py-4">Department</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Check In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.slice(0, 5).map(emp => {
                const record = todayRecords.find(r => r.userId === emp.id);
                const status = record?.status || AttendanceStatus.ABSENT;
                
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 text-primary-700 flex items-center justify-center font-bold text-sm shadow-inner">
                           {emp.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                           <p className="text-xs text-slate-500">{emp.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{emp.department}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm
                        ${status === AttendanceStatus.PRESENT ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                          status === AttendanceStatus.LATE ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-mono font-medium">
                      {record?.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;