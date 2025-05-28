import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const CalendarPage = ({ userId, setUserId }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 20, 0, 20));
  const [workoutDays, setWorkoutDays] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/workoutDays/${userId}`)
        .then((res) => res.json())
        .then((data) => setWorkoutDays(data || {}))
        .catch((err) => console.error('Error fetching workout days:', err));
    }
  }, [userId]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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
                theme === 'dark' ? 'border-purple-600' : 'border-[#3440EB]'
              }`}
            ></td>
          );
        } else {
          const dateKey = `${dayCounter}-${month}-${year}`;
          const dayStatus = workoutDays[dateKey] || { done: false, notDone: false };
          row.push(
            <td
              key={`${i}-${j}`}
              className={`border p-2 w-[14%] text-center ${
                theme === 'dark' ? 'border-purple-600' : 'border-[#3440EB]'
              }`}
            >
              {dayCounter}
              <label className="block my-1 text-sm">
                <input
                  type="checkbox"
                  className={`mr-1 ${theme === 'dark' ? 'accent-purple-600' : 'accent-[#3440EB]'}`}
                  checked={dayStatus.done}
                  onChange={(e) => {
                    const newStatus = { done: e.target.checked, notDone: false };
                    setWorkoutDays({ ...workoutDays, [dateKey]: newStatus });
                    fetch(`http://localhost:5000/api/workoutDays/${userId}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ date: dateKey, done: newStatus.done, notDone: newStatus.notDone }),
                    }).catch((err) => console.error('Error saving workout day:', err));
                  }}
                />
                Выполнено
              </label>
              <label className="block my-1 text-sm">
                <input
                  type="checkbox"
                  className={`mr-1 ${theme === 'dark' ? 'accent-gray-600' : 'accent-[#3440EB]'}`}
                  checked={dayStatus.notDone}
                  onChange={(e) => {
                    const newStatus = { done: false, notDone: e.target.checked };
                    setWorkoutDays({ ...workoutDays, [dateKey]: newStatus });
                    fetch(`http://localhost:5000/api/workoutDays/${userId}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ date: dateKey, done: newStatus.done, notDone: newStatus.notDone }),
                    }).catch((err) => console.error('Error saving workout day:', err));
                  }}
                />
                Не выполнено
              </label>
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-gray-100 text-black'} font-yanone`}>
      <div className="w-full max-w-[1165px] flex flex-col gap-4 p-4">
        <Header userId={userId} setUserId={setUserId} />
        <section className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-xl p-4 flex flex-col items-center min-h-[600px] shadow-md`}>
          <div className="flex justify-between w-full p-2 text-xl">
            <button
              onClick={handlePrevMonth}
              className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-2 py-1 text-white transition-all border-2 border-transparent hover:border-purple-600`}
            >
              ◀
            </button>
            <span id="monthYear">
              {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-2 py-1 text-white transition-all border-2 border-transparent hover:border-purple-600`}
            >
              ▶
            </button>
          </div>
          <table
            className={`border w-full border-collapse rounded-xl text-center ${
              theme === 'dark' ? 'bg-[#1E1E1E] border-purple-600' : 'bg-gray-100 border-[#3440EB]'
            }`}
          >
            <thead>
              <tr>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                  <th
                    key={index}
                    className={`border p-2 w-[14%] ${
                      theme === 'dark' ? 'border-purple-600' : 'border-[#3440EB]'
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="calendarBody">{generateCalendar()}</tbody>
          </table>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default CalendarPage;