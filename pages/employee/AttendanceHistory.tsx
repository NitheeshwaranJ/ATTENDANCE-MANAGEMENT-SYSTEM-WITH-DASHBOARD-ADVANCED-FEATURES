import React from 'react';
import { useStore } from '../../store/useStore';
import { getStatusColor, formatTime } from '../../utils/helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend } from 'date-fns';

const AttendanceHistory: React.FC = () => {
  const { currentUser, getEmployeeRecords } = useStore();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  if (!currentUser) return null;

  const records = getEmployeeRecords(currentUser.id);
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getDayRecord = (date: Date) => {
    return records.find(r => isSameDay(new Date(r.date), date));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance History</h1>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 font-medium text-gray-900 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid Body */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 bg-white">
            {/* Empty cells for start of month */}
            {Array.from({ length: days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-32 bg-gray-50/50" />
            ))}

            {days.map((day) => {
                const record = getDayRecord(day);
                const isToday = isSameDay(day, new Date());
                const isWknd = isWeekend(day);

                return (
                    <div 
                        key={day.toISOString()} 
                        className={`h-32 p-2 relative group transition-colors ${!isSameMonth(day, currentMonth) ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`
                                text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                ${isToday ? 'bg-primary-600 text-white' : isWknd ? 'text-gray-400' : 'text-gray-700'}
                            `}>
                                {format(day, 'd')}
                            </span>
                            {record && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(record.status)}`}>
                                    {record.status}
                                </span>
                            )}
                        </div>

                        {record ? (
                            <div className="mt-2 space-y-1">
                                <div className="text-xs text-gray-600 flex justify-between">
                                    <span>In:</span>
                                    <span className="font-mono">{formatTime(record.checkInTime)}</span>
                                </div>
                                <div className="text-xs text-gray-600 flex justify-between">
                                    <span>Out:</span>
                                    <span className="font-mono">{formatTime(record.checkOutTime)}</span>
                                </div>
                                <div className="text-xs font-semibold text-primary-600 mt-2 text-right">
                                    {record.totalHours.toFixed(1)}h
                                </div>
                            </div>
                        ) : (
                            !isWknd && isSameMonth(day, currentMonth) && day < new Date() && (
                                <div className="mt-8 text-center">
                                    <span className="text-xs text-red-400 font-medium">No Record</span>
                                </div>
                            )
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
