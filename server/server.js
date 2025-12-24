
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGODB MODELS ---

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  employeeId: String,
  department: String,
  avatar: String,
});

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkInTime: Date,
  checkOutTime: Date,
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'], default: 'Absent' },
  totalHours: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// --- SEED FUNCTION (For Demo Purposes) ---
const seedDatabase = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('Seeding database...');
    const hashedPwd = await bcrypt.hash('password', 10);
    const users = [
      { name: 'Alice Johnson', email: 'alice@company.com', password: hashedPwd, role: 'employee', employeeId: 'EMP001', department: 'Engineering', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson' },
      { name: 'Bob Smith', email: 'bob@company.com', password: hashedPwd, role: 'manager', employeeId: 'MGR001', department: 'Product', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith' },
      { name: 'Charlie Brown', email: 'charlie@company.com', password: hashedPwd, role: 'employee', employeeId: 'EMP002', department: 'Design', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown' },
    ];
    await User.insertMany(users);
    console.log('Database seeded!');
  }
};

// --- ROUTES ---

// 1. Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, role } = req.body; // In a real app, use password. For this demo flow, we trust the role switch if pwd matches.
    // simplified for the demo UI which allows role switching, but normally we check password
    const user = await User.findOne({ email, role });
    
    if (!user) return res.status(400).json({ message: 'User not found or role mismatch' });

    // Note: In production, check password: await bcrypt.compare(req.body.password, user.password)

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // Return user without password
    const { password, ...userData } = user.toObject();
    res.json({ token, user: { ...userData, id: userData._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get All Users (For Manager)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users.map(u => ({ ...u.toObject(), id: u._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Attendance Records
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find({});
    res.json(records.map(r => ({ ...r.toObject(), id: r._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Check In
app.post('/api/attendance/checkin', async (req, res) => {
  try {
    const { userId } = req.body;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Check if already checked in
    const existing = await Attendance.findOne({ userId, date: dateStr });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    let status = 'Present';
    if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
      status = 'Late';
    }

    const newRecord = new Attendance({
      userId,
      date: dateStr,
      checkInTime: now,
      status,
      totalHours: 0
    });

    await newRecord.save();
    res.json({ ...newRecord.toObject(), id: newRecord._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Check Out
app.post('/api/attendance/checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const record = await Attendance.findOne({ userId, date: dateStr });
    if (!record) return res.status(404).json({ message: 'No check-in record found for today' });

    const startTime = new Date(record.checkInTime).getTime();
    const endTime = now.getTime();
    const hours = (endTime - startTime) / (1000 * 60 * 60);

    record.checkOutTime = now;
    record.totalHours = parseFloat(hours.toFixed(2));
    
    await record.save();
    res.json({ ...record.toObject(), id: record._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and Start Server
// Replace 'mongodb://localhost:27017/workpulse' with your Atlas Connection String if cloud
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workpulse')
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
