import { AttendanceRecord, AttendanceStatus } from '../types';

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (dateString: string | null): string => {
  if (!dateString) return '--:--';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDuration = (start: string | null, end: string | null): string => {
  if (!start || !end) return '0h 0m 0s';
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const getStatusColor = (status: AttendanceStatus): string => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'bg-green-100 text-green-800';
    case AttendanceStatus.ABSENT:
      return 'bg-red-100 text-red-800';
    case AttendanceStatus.LATE:
      return 'bg-yellow-100 text-yellow-800';
    case AttendanceStatus.HALF_DAY:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const generateCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getTodayStr = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};