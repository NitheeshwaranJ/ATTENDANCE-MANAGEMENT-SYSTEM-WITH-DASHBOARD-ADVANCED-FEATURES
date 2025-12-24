import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { formatTime, calculateDuration } from '../../utils/helpers';
import StatCard from '../../components/StatCard';
import Toast from '../../components/Toast';
import { Clock, CalendarCheck, AlertCircle, PlayCircle, StopCircle, CheckCircle, Timer } from 'lucide-react';
import { AttendanceStatus } from '../../types';

const EmployeeDashboard: React.FC = () => {
  const { currentUser, checkIn, checkOut, getTodayRecord, getEmployeeRecords } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayRecord = getTodayRecord(currentUser.id);
  const isCheckedIn = !!todayRecord?.checkInTime && !todayRecord?.checkOutTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;
  const history = getEmployeeRecords(currentUser.id);

  // Calculate quick stats
  const presentDays = history.filter(r => r.status === AttendanceStatus.PRESENT).length;
  const lateDays = history.filter(r => r.status === AttendanceStatus.LATE).length;
  const totalHours = history.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  const handleCheckIn = () => {
    checkIn(currentUser.id);
    setToast({
      show: true,
      message: 'Successfully checked in! Have a productive day.',
      type: 'success'
    });
  };

  const handleCheckOut = () => {
    checkOut(currentUser.id);
    setToast({
      show: true,
      message: 'Successfully checked out! See you tomorrow.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-8">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      {/* Greeting Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Good {currentTime.getHours() < 12 ? 'Morning' : 'Afternoon'}, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mt-2">Ready to make today count?</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-3">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
             <Timer size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Time</p>
            <p className="font-mono text-xl font-bold text-slate-800 leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Action Card */}
        <div className="md:col-span-8 bg-gradient-to-br from-indigo-600 via-primary-600 to-violet-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 p-24 bg-purple-500 opacity-20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 h-full">
            <div className="space-y-6 text-center md:text-left max-w-lg">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-4">
                    <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-green-400 animate-pulse' : 'bg-slate-300'}`}></div>
                    {isCheckedOut ? "Shift Completed" : isCheckedIn ? "Active Shift" : "Ready to Start"}
                  </div>
                  <h2 className="text-4xl font-bold mb-2 leading-tight">
                    {isCheckedOut 
                      ? "You're all done for today!" 
                      : isCheckedIn 
                        ? "Have a productive session." 
                        : "Let's clock in."}
                  </h2>
                  <p className="text-indigo-100 text-lg opacity-90">
                    {isCheckedOut 
                      ? "Great job! Rest up and we'll see you tomorrow." 
                      : isCheckedIn 
                        ? `Started working at ${formatTime(todayRecord!.checkInTime)}` 
                        : "Record your attendance to start your workday."}
                  </p>
               </div>

               {isCheckedIn && (
                 <div className="inline-block">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200 mb-1">Duration</p>
                    <p className="text-3xl font-mono font-bold">{calculateDuration(todayRecord!.checkInTime, currentTime.toISOString())}</p>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 w-full md:w-auto min-w-[200px]">
               <button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn || isCheckedOut}
                  className={`
                    group relative px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 overflow-hidden
                    ${isCheckedIn || isCheckedOut
                      ? 'bg-black/20 text-white/40 cursor-not-allowed border border-white/5' 
                      : 'bg-white text-primary-700 hover:scale-[1.02] hover:shadow-xl active:scale-95'}
                  `}
                >
                  {isCheckedOut 
                     ? <CheckCircle size={24} /> 
                     : isCheckedIn 
                        ? <CheckCircle size={24} className="text-green-500" />
                        : <PlayCircle size={24} className="fill-current" />}
                  <span>{isCheckedOut ? 'Completed' : (isCheckedIn ? 'Checked In' : 'Check In')}</span>
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn || isCheckedOut}
                  className={`
                    px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 border
                    ${!isCheckedIn || isCheckedOut
                      ? 'bg-transparent border-white/10 text-white/30 cursor-not-allowed' 
                      : 'bg-rose-500 border-transparent text-white hover:bg-rose-600 hover:scale-[1.02] active:scale-95'}
                  `}
                >
                  <StopCircle size={24} />
                  <span>{isCheckedOut ? 'Ended' : 'Check Out'}</span>
                </button>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="md:col-span-4 flex flex-col gap-6">
           <StatCard 
            label="Days Present" 
            value={presentDays} 
            icon={CalendarCheck} 
            color="green" 
            subtext="This Month"
          />
          <StatCard 
            label="Total Hours" 
            value={`${totalHours.toFixed(1)}h`} 
            icon={Clock} 
            color="indigo" 
            subtext="Avg 8.2h / day"
          />
          <StatCard 
            label="Late Arrivals" 
            value={lateDays} 
            icon={AlertCircle} 
            color="yellow" 
            subtext="Needs attention"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm text-primary-600 font-semibold hover:text-primary-700">View History</button>
        </div>
        <div className="divide-y divide-slate-50">
          {history.slice(0, 5).map((record) => (
            <div key={record.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} group-hover:scale-110 transition-transform`}>
                  {record.status === 'Present' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{new Date(record.date).toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric'})}</p>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${record.status === 'Present' ? 'text-emerald-600' : 'text-amber-600'}`}>{record.status}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-slate-100 px-3 py-1 rounded-lg inline-block">
                  <p className="font-mono text-sm font-semibold text-slate-700">
                    {formatTime(record.checkInTime)} - {formatTime(record.checkOutTime)}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">{record.totalHours.toFixed(1)} hrs work</p>
              </div>
            </div>
          ))}
          {history.length === 0 && (
             <div className="p-12 text-center text-slate-400">No recent activity found. Start checking in!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;