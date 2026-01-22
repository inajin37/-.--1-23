import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

const PlanPage = ({ userId, setUserId }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState(new Date(2025, 4, 20, 0, 20));
  const [displayDate, setDisplayDate] = useState(new Date(2025, 4, 20, 0, 20));
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Загружаем задачи при монтировании и смене даты
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchTasks().finally(() => setLoading(false));
    }
  }, [userId, calendarDate]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      console.log('Fetched tasks data:', data);
      setTasks(data || {});
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks({});
    }
  };

  const currentDay = calendarDate.getDate();
  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getFullYear();

  const getSelectedDate = () => {
    return `${currentDay}-${currentMonth}-${currentYear}`;
  };

  const addTask = async () => {
    if (taskInput.trim() !== '') {
      const date = getSelectedDate();
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      const updatedTasksForDate = [...(tasks[date] || []), newTask];
      const updatedTasks = { ...tasks, [date]: updatedTasksForDate };
      setTasks(updatedTasks);
      setTaskInput('');

      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, task: newTask }),
        });
        if (!res.ok) {
          throw new Error('Failed to save task');
        }
        console.log('Task saved successfully:', await res.json());
      } catch (err) {
        console.error('Error saving task:', err);
        // Откатываем изменения в случае ошибки
        setTasks(tasks);
      }
    }
  };

  const toggleTask = async (taskId) => {
    const date = getSelectedDate();
    const taskToUpdate = tasks[date].find(task => task.id === taskId);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    const updatedTasksForDate = tasks[date].map(task =>
      task.id === taskId ? updatedTask : task
    );
    const updatedTasks = { ...tasks, [date]: updatedTasksForDate };
    setTasks(updatedTasks);

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${userId}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      console.log('Task updated successfully:', await res.json());
    } catch (err) {
      console.error('Error updating task:', err);
      setTasks(tasks); // Откатываем изменения
    }
  };

  const removeTask = async (taskId) => {
    const date = getSelectedDate();
    const updatedTasksForDate = tasks[date].filter(task => task.id !== taskId);
    const updatedTasks = { ...tasks };
    if (updatedTasksForDate.length === 0) {
      delete updatedTasks[date];
    } else {
      updatedTasks[date] = updatedTasksForDate;
    }
    setTasks(updatedTasks);

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${userId}/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      console.log('Task deleted successfully:', await res.json());
    } catch (err) {
      console.error('Error deleting task:', err);
      setTasks(tasks); // Откатываем изменения
    }
  };

  const renderTasks = () => {
    const date = getSelectedDate();
    const taskList = tasks[date] || [];
    console.log('Rendering tasks for date:', date, 'Tasks:', taskList);
    return taskList.map((task) => (
      <li
        key={task.id}
        className={`${
          task.completed ? theme === 'dark' ? 'bg-[#FFD700]text-white' : 'bg-[#8f2429] ' : theme === 'dark' ? 'bg-[#2E2E2E]' : 'bg-gray-200'
        } my-1 p-2 rounded-md flex justify-between items-center text-xl`}
      >
        <span className={task.completed ? 'text-green-500' : ''}>{task.text}</span>
        <div className="flex gap-2">
          <button
            onClick={() => toggleTask(task.id)}
            className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white transition-all border-2 border-transparent hover:border-[#FFD700]`}
          >
            ✔
          </button>
          <button
            onClick={() => removeTask(task.id)}
            className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-3 py-1 text-white transition-all border-2 border-transparent hover:border-[#FFD700]`}
          >
            X
          </button>
        </div>
      </li>
    ));
  };

  const generateCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 7 : firstDay;

    const totalCells = lastDate + (adjustedFirstDay - 1);
    const rowsNeeded = Math.ceil(totalCells / 7);

    const calendar = [];
    let dayCounter = 1;

 for (let i = 0; i < rowsNeeded; i++) {
      const row = [];
      for (let j = 1; j <= 7; j++) {
        if ((i === 0 && j < adjustedFirstDay) || dayCounter > lastDate) {
          row.push(
            <td
              key={`${i}-${j}`}
              className={`border p-2 w-[14%] ${
                theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '
              }`}
            ></td>
          );
        } else {
          const isSelected = dayCounter === currentDay && month === currentMonth && year === currentYear;
          const selectedDay = dayCounter;
          row.push(
            <td
              key={`${i}-${j}`}
              className={`border p-2 w-[14%] text-center cursor-pointer hover:bg-purple-500 ${
                theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '
              } ${isSelected ? 'bg-[#FFD700]text-white' : ''}`}
              onClick={() => {
                const newDate = new Date(year, month, selectedDay);
                setCalendarDate(newDate);
                setDisplayDate(newDate);
                setIsModalOpen(false);
              }}
            >
              {dayCounter}
            </td>
          );
          dayCounter++;
        }
      }
      calendar.push(<tr key={i}>{row}</tr>);
    }
    return calendar;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
    setDisplayDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
    setDisplayDate(newDate);
  };

  const changeDay = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setDate(calendarDate.getDate() + direction);
    setCalendarDate(newDate);
    setDisplayDate(newDate);
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#0e1426]  text-white' : 'bg-gray-100 text-black '} font-yanone`}>
      <div className="w-full max-w-[1165px] flex flex-col gap-4 p-4">
        <Header userId={userId} setUserId={setUserId} />
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5 flex flex-col items-center`}>
          <div className="flex items-center gap-2 mb-4 text-xl">
            <button
              onClick={() => changeDay(-1)}
              className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white transition-all border-2 border-transparent hover:border-[#FFD700]`}
            >
              ◀
            </button>
            <span id="day-display">{currentDay}</span>
            <span id="month-display">{months[currentMonth]}</span>
            <button
              onClick={() => changeDay(1)}
              className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white transition-all border-2 border-transparent hover:border-[#FFD700]`}
            >
              ▶
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white transition-all border-2 border-transparent hover:border-[#FFD700]`}
            >
              Выбрать дату
            </button>
          </div>
          <div className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white'} rounded-sm p-5 w-full max-w-[1125px] text-center`}>
            <h3 className="text-2xl mb-4">Список задач</h3>
            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <ul className="list-none p-0">{renderTasks()}</ul>
            )}
            <div className="mt-2">
              <input
                id="task-input"
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-[#FFD700]focus:border-purple-400' : 'bg-white text-black border-[#8f2429]  focus:border-[#8f2429] '} rounded-sm p-2 w-[200px] text-xl border-2 focus:ring-2 focus:ring-[#FFD700]`}
                placeholder="Введите задачу"
              />
              <button
                onClick={addTask}
                className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white ml-2 text-xl transition-all border-2 border-transparent hover:border-[#FFD700]`}
              >
                Добавить
              </button>
            </div>
          </div>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white' : 'bg-white text-black'} rounded-sm p-6 w-[600px]`}>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePrevMonth}
                  className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white ml-2 text-xl transition-all border-2 border-transparent hover:border-[#FFD700]`}
                >
                  ◀
                </button>
                <span className="text-xl">
                  {displayDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={handleNextMonth}
                  className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-2 py-1 text-white ml-2 text-xl transition-all border-2 border-transparent hover:border-[#FFD700]`}
                >
                  ▶
                </button>
              </div>
              <table className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-gray-200'} w-full border-collapse rounded-sm text-center`}>
                <thead>
                  <tr>
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                      <th
                        key={index} className={`border p-2 w-[14%] ${theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '
                        }`}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{generateCalendar()}</tbody>
              </table>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-4 py-2 text-white mt-4 w-full transition-all border-2 border-transparent hover:border-[#FFD700]`}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default PlanPage;