
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AttendanceRecord, AttendanceStatus, Role } from '../types';
import { getTodayStr } from '../utils/helpers';

// --- CONFIGURATION ---
// SET THIS TO TRUE TO USE THE MONGODB BACKEND
const USE_API = false; 
const API_URL = 'http://localhost:5000/api';

// --- HELPER FOR API CALLS ---
const api = {
  async login(email: string, role: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password: 'password' }) // Sending dummy password for demo flow
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  async fetchUsers() {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },
  async fetchAttendance() {
    const res = await fetch(`${API_URL}/attendance`);
    return res.json();
  },
  async checkIn(userId: string) {
    const res = await fetch(`${API_URL}/attendance/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },
  async checkOut(userId: string) {
    const res = await fetch(`${API_URL}/attendance/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};

// --- MOCK DATA GENERATION (Fallback) ---
const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'employee', employeeId: 'EMP001', department: 'Engineering', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'manager', employeeId: 'MGR001', department: 'Product', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@company.com', role: 'employee', employeeId: 'EMP002', department: 'Design', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown' },
  { id: '4', name: 'Diana Prince', email: 'diana@company.com', role: 'employee', employeeId: 'EMP003', department: 'Engineering', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince' },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const users = MOCK_USERS.filter(u => u.role === 'employee');
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    users.forEach(user => {
      const rand = Math.random();
      let status = AttendanceStatus.PRESENT;
      let checkIn = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 30), 0);
      let checkOut = new Date(date);
      checkOut.setHours(17, Math.floor(Math.random() * 30), 0);

      if (rand > 0.9) {
        status = AttendanceStatus.ABSENT;
        // @ts-ignore
        checkIn = null;
        // @ts-ignore
        checkOut = null;
      } else if (rand > 0.8) {
        status = AttendanceStatus.LATE;
        checkIn.setHours(10, 15, 0);
      }

      if (status !== AttendanceStatus.ABSENT) {
        records.push({
          id: `${user.id}-${dateStr}`,
          userId: user.id,
          date: dateStr,
          checkInTime: checkIn.toISOString(),
          checkOutTime: checkOut.toISOString(),
          status,
          totalHours: 8 + (Math.random() * 0.5),
        });
      }
    });
  }
  return records;
};

interface AppState {
  currentUser: User | null;
  users: User[];
  attendanceRecords: AttendanceRecord[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, role: Role) => Promise<void>;
  logout: () => void;
  checkIn: (userId: string) => Promise<void>;
  checkOut: (userId: string) => Promise<void>;
  getEmployeeRecords: (userId: string) => AttendanceRecord[];
  getTodayRecord: (userId: string) => AttendanceRecord | undefined;
  refreshData: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      users: MOCK_USERS,
      attendanceRecords: generateMockAttendance(),
      isLoading: false,
      error: null,

      refreshData: async () => {
        if (!USE_API) return;
        try {
          const [usersData, attendanceData] = await Promise.all([
            api.fetchUsers(),
            api.fetchAttendance()
          ]);
          set({ users: usersData, attendanceRecords: attendanceData });
        } catch (error) {
          console.error("Failed to refresh data", error);
        }
      },

      login: async (email, role) => {
        if (USE_API) {
          try {
            set({ isLoading: true, error: null });
            const data = await api.login(email, role);
            
            // Initial Data Load on Login
            const [usersData, attendanceData] = await Promise.all([
              api.fetchUsers(),
              api.fetchAttendance()
            ]);

            set({ 
              currentUser: data.user, 
              isAuthenticated: true, 
              users: usersData,
              attendanceRecords: attendanceData,
              isLoading: false 
            });
            
            // Store token for future requests if needed
            localStorage.setItem('token', data.token);
            
          } catch (err) {
            set({ isLoading: false, error: 'Login failed. Ensure backend is running.' });
            alert('Login failed. Ensure server is running at localhost:5000');
          }
        } else {
          // Mock Login
          const user = get().users.find(u => u.email === email && u.role === role);
          if (user) {
            set({ currentUser: user, isAuthenticated: true });
          } else {
            alert('Invalid credentials');
          }
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ currentUser: null, isAuthenticated: false });
      },

      checkIn: async (userId) => {
        if (USE_API) {
          try {
            const newRecord = await api.checkIn(userId);
            set(state => ({
              attendanceRecords: [...state.attendanceRecords, newRecord]
            }));
          } catch (err) {
            console.error(err);
          }
        } else {
          // Mock CheckIn
          const todayStr = getTodayStr();
          const existing = get().attendanceRecords.find(r => r.userId === userId && r.date === todayStr);
          if (existing) return;

          const now = new Date();
          let status = AttendanceStatus.PRESENT;
          if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
            status = AttendanceStatus.LATE;
          }

          const newRecord: AttendanceRecord = {
            id: `${userId}-${todayStr}`,
            userId,
            date: todayStr,
            checkInTime: now.toISOString(),
            checkOutTime: null,
            status,
            totalHours: 0,
          };

          set(state => ({
            attendanceRecords: [...state.attendanceRecords, newRecord]
          }));
        }
      },

      checkOut: async (userId) => {
        if (USE_API) {
           try {
            const updatedRecord = await api.checkOut(userId);
            set(state => ({
              attendanceRecords: state.attendanceRecords.map(r => 
                r.id === updatedRecord.id ? updatedRecord : r
              )
            }));
           } catch (err) {
             console.error(err);
           }
        } else {
          // Mock CheckOut
          const todayStr = getTodayStr();
          const now = new Date();
          
          set(state => ({
            attendanceRecords: state.attendanceRecords.map(record => {
              if (record.userId === userId && record.date === todayStr) {
                const startTime = new Date(record.checkInTime!).getTime();
                const endTime = now.getTime();
                const hours = (endTime - startTime) / (1000 * 60 * 60);
                
                return {
                  ...record,
                  checkOutTime: now.toISOString(),
                  totalHours: parseFloat(hours.toFixed(2))
                };
              }
              return record;
            })
          }));
        }
      },

      getEmployeeRecords: (userId) => {
        return get().attendanceRecords.filter(r => r.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getTodayRecord: (userId) => {
        const todayStr = getTodayStr();
        // For mongo, we need to match partial ISO strings or logic, but since we store YYYY-MM-DD in both:
        return get().attendanceRecords.find(r => r.userId === userId && r.date === todayStr);
      }
    }),
    {
      name: 'workpulse-storage',
      partialize: (state) => ({ 
        // Only persist auth state, fetch fresh data on reload if using API
        users: USE_API ? [] : state.users, 
        attendanceRecords: USE_API ? [] : state.attendanceRecords,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Hydrate data if user is logged in
        if (USE_API && state?.isAuthenticated) {
          state.refreshData();
        }
      }
    }
  )
);
