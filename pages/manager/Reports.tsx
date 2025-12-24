import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { generateCSV, formatDate, formatTime, getStatusColor } from '../../utils/helpers';
import { Download, Search, Filter, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const { users, attendanceRecords } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Combine user info with attendance
  const reportData = useMemo(() => {
    return attendanceRecords.map(record => {
      const user = users.find(u => u.id === record.userId);
      return {
        ...record,
        employeeName: user?.name || 'Unknown',
        employeeId: user?.employeeId || 'N/A',
        department: user?.department || 'N/A',
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, users]);

  // Filter Logic
  const filteredData = reportData.filter(item => {
    const matchesSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || item.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments: string[] = ['All', ...Array.from(new Set(users.filter(u => u.role === 'employee').map(u => u.department))) as string[]];

  const handleExport = () => {
    const exportData = filteredData.map(({ id, userId, ...rest }) => rest);
    generateCSV(exportData, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Reports</h1>
           <p className="text-slate-500 text-sm mt-1">Comprehensive logs and exportable data.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search employee name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-shadow shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={filterDept} 
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none min-w-[180px] shadow-sm cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm">
                <Calendar size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Employee</th>
                <th className="px-8 py-4">Dept</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Check In</th>
                <th className="px-8 py-4">Check Out</th>
                <th className="px-8 py-4">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 text-slate-700 font-medium whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900">{row.employeeName}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{row.employeeId}</div>
                    </td>
                    <td className="px-8 py-5 text-slate-600">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{row.department}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(row.status)} border border-current border-opacity-20`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-mono text-slate-600 text-xs">{formatTime(row.checkInTime)}</td>
                    <td className="px-8 py-5 font-mono text-slate-600 text-xs">{formatTime(row.checkOutTime)}</td>
                    <td className="px-8 py-5 font-bold text-slate-800">{row.totalHours.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                        <Search size={32} className="mb-2 opacity-50" />
                        <p>No records found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
          <span className="font-medium">Showing {filteredData.length} records</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-medium shadow-sm" disabled>Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-medium shadow-sm" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;