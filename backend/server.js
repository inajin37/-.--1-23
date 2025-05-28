const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Настройка подключения к MongoDB с обработкой ошибок
mongoose.connect('mongodb://localhost:27017/fitnessApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(bodyParser.json());

// Схема пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Схема задач: каждая задача — отдельный документ
const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  id: { type: Number, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Создаём индекс для оптимизации запросов
taskSchema.index({ userId: 1, date: 1 });

const Task = mongoose.model('Task', taskSchema);

// Схема метрик пользователя (рост, вес, калории)
const userMetricsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  height: { type: Number, required: true }, // Рост в см
  weight: { type: Number, required: true }, // Вес в кг
  calories: { type: Number, required: true }, // Калории в ккал
  updatedAt: { type: Date, default: Date.now },
});
const UserMetrics = mongoose.model('UserMetrics', userMetricsSchema);

// Схема дней тренировок
const workoutDaySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  done: Boolean,
  notDone: Boolean,
});
const WorkoutDay = mongoose.model('WorkoutDay', workoutDaySchema);

// Схема для заметок
const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String, required: true },
});
const Note = mongoose.model('Note', noteSchema);

// Регистрация
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const username = `${firstName} ${lastName}`;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered', userId: user._id, username });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Вход
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    res.json({ message: 'Login successful', userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Получение задач
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const taskDocs = await Task.find({ userId: req.params.userId });
    const tasks = taskDocs.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push({ id: task.id, text: task.text, completed: task.completed });
      return acc;
    }, {});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Сохранение новой задачи
app.post('/api/tasks/:userId', async (req, res) => {
  const { date, task } = req.body;
  try {
    const newTask = new Task({
      userId: req.params.userId,
      date,
      id: task.id,
      text: task.text,
      completed: task.completed,
    });
    await newTask.save();
    res.json({ message: 'Task saved', task });
  } catch (err) {
    res.status(500).json({ message: 'Error saving task', error: err.message });
  }
});

// Обновление задачи
app.put('/api/tasks/:userId/:taskId', async (req, res) => {
  const { completed } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { userId: req.params.userId, id: req.params.taskId },
      { $set: { completed } },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// Удаление задачи
app.delete('/api/tasks/:userId/:taskId', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      userId: req.params.userId,
      id: req.params.taskId,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

// Получение метрик пользователя
app.get('/api/metrics/:userId', async (req, res) => {
  try {
    const metrics = await UserMetrics.findOne({ userId: req.params.userId });
    res.json(metrics || { height: 0, weight: 0, calories: 0 }); // Возвращаем нули, если данных нет
  } catch (err) {
    res.status(500).json({ message: 'Error fetching metrics', error: err.message });
  }
});

// Сохранение или обновление метрик пользователя
app.post('/api/metrics/:userId', async (req, res) => {
  const { height, weight, calories } = req.body;
  try {
    let metrics = await UserMetrics.findOne({ userId: req.params.userId });
    if (!metrics) {
      metrics = new UserMetrics({ userId: req.params.userId, height, weight, calories });
    } else {
      metrics.height = height;
      metrics.weight = weight;
      metrics.calories = calories;
    }
    await metrics.save();
    res.json({ message: 'Metrics saved', height, weight, calories });
  } catch (err) {
    res.status(500).json({ message: 'Error saving metrics', error: err.message });
  }
});

// Получение и сохранение дней тренировок
app.get('/api/workoutDays/:userId', async (req, res) => {
  try {
    const workoutDays = await WorkoutDay.find({ userId: req.params.userId });
    const result = workoutDays.reduce((acc, day) => {
      acc[day.date] = { done: day.done, notDone: day.notDone };
      return acc;
    }, {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workout days', error: err.message });
  }
});

app.post('/api/workoutDays/:userId', async (req, res) => {
  const { date, done, notDone } = req.body;
  try {
    let workoutDay = await WorkoutDay.findOne({ userId: req.params.userId, date });
    if (!workoutDay) {
      workoutDay = new WorkoutDay({ userId: req.params.userId, date, done, notDone });
    } else {
      workoutDay.done = done;
      workoutDay.notDone = notDone;
    }
    await workoutDay.save();
    res.json({ message: 'Workout day saved', date, done, notDone });
  } catch (err) {
    res.status(500).json({ message: 'Error saving workout day', error: err.message });
  }
});

// Получение профиля
app.get('/api/profile/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Новые маршруты для заметок
app.get('/api/notes/:userId', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    const result = notes.reduce((acc, note) => {
      acc[note.date] = note.note;
      return acc;
    }, {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err.message });
  }
});

app.post('/api/notes/:userId', async (req, res) => {
  const { date, note } = req.body;
  try {
    let noteDoc = await Note.findOne({ userId: req.params.userId, date });
    if (!noteDoc) {
      noteDoc = new Note({ userId: req.params.userId, date, note });
    } else {
      noteDoc.note = note;
    }
    await noteDoc.save();
    res.json({ message: 'Note saved', date, note });
  } catch (err) {
    res.status(500).json({ message: 'Error saving note', error: err.message });
  }
});

// Обновление профиля
app.put('/api/profile/:userId', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Хешируем новый пароль
    }
    await user.save();
    res.json({ message: 'Profile updated', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});