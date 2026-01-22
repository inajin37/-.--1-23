import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const MainPage = ({ userId, setUserId, username, setUsername }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isRegistered, setIsRegistered] = useState(!!userId);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [exercisesCount, setExercisesCount] = useState('00');
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setTime(`${hours}:${minutes}`);
      setDate(`${day}.${month}.${year}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchMetrics().finally(() => setLoading(false));
    }
  }, [userId]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/metrics/${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await res.json();
      setHeight(data.height?.toString() || '');
      setWeight(data.weight?.toString() || '');
      setCalories(data.calories?.toString() || '');
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setHeight('');
      setWeight('');
      setCalories('');
    }
  };

  const saveMetrics = async () => {
    try {
      const data = {
        height: Number(height) || 0,
        weight: Number(weight) || 0,
        calories: Number(calories) || 0,
      };
      const res = await fetch(`http://localhost:5000/api/metrics/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Failed to save metrics');
      }
      console.log('Metrics saved successfully:', await res.json());
    } catch (err) {
      console.error('Error saving metrics:', err);
    }
  };

  const handleSave = (type) => {
    saveMetrics();
    setIsModalOpen(null);
  };

  // Разделяем username на имя и фамилию
  const [firstName, lastName] = (username || 'Гость').split(' ');

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#0e1426]  text-white' : 'bg-gray-100 text-black'} font-yanone`}>
      <div className="w-full max-w-[1165px] flex flex-col gap-4 p-4">
        <Header showNav={true} isRegistered={isRegistered} username={username} className="shadow-md" />
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5 flex flex-col md:flex-row justify-between`}>
          <div className="font-yanone max-w-[500px] text-left mb-4 md:mb-0">
            <h3 className="font-yanone text-5xl mb-4">Календарь</h3>
            <p className="font-yanone text-2xl">
              В этом разделе вы можете смотреть свой прогресс. Отмечая все дни когда вы занимались спортом. Это поможет вам понять ваш прогресс, дисциплину и поменять план тренировок.
            </p>
            <Link
              to="/calendar"
              className={`${theme === 'dark' ? 'bg-[#FFD700] hover:bg-[#0d0361]  hover:border-[#FFD700]' : 'bg-[#8f2429]  hover:bg-white hover:border-[#8f2429]  hover:text-black'} rounded-sm px-4 py-2 font-yanone text-xl transition-all border-2 border-transparent mt-4 inline-block text-white`}
            >
              Перейти
            </Link>
          </div>
          <img
            src="/images/calendar.jpg"
            alt="Календарь тренировок"
            className="w-[500px] h-[300px] rounded-sm object-cover"
          />
        </section>
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5 flex justify-between`}>
          <img
            src="/images/workout-plan.png"
            alt="План тренировок"
            className="w-[500px] h-[300px] rounded-sm object-cover"
            onClick={() => setIsModalOpen('exercises')}
          />
          <div className="font-yanone max-w-[500px] text-right">
            <h3 className="font-yanone text-5xl mb-4">План тренировок</h3>
            <p className="font-yanone text-2xl">
              В этом разделе вы можете планировать свои тренировки. Записывая их как заметки по дням. Что помогает чётко знать что вам нужно делать в тот или иной день.
            </p>
            <Link
              to="/plan"
              className={`${theme === 'dark' ? 'bg-[#FFD700] hover:bg-[#0d0361]  hover:border-[#FFD700]' : 'bg-[#8f2429]  hover:bg-white hover:border-[#8f2429]  hover:text-black'} rounded-sm px-4 py-2 font-yanone text-xl transition-all border-2 border-transparent mt-4 inline-block text-white`}
            >
              Перейти
            </Link>
          </div>
        </section>
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5 flex justify-between`}>
          <div className="font-yanone max-w-[500px]">
            <h3 className="font-yanone text-5xl mb-4">Упражнения</h3>
            <p className="font-yanone text-2xl">
              В этом разделе вы можете посмотреть видео ролики с упражнениями. И составить свой план тренировок. Это поможет качественно составить план для хорошего развития.
            </p>
            <Link
              to="/exercises"
              className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361]  hover:border-[#FFD700]' : 'bg-[#8f2429]  hover:bg-white hover:border-[#8f2429]  hover:text-black'} rounded-sm px-4 py-2 font-yanone text-xl transition-all border-2 border-transparent mt-4 inline-block text-white`}
            >
              Перейти
            </Link>
          </div>
          <img
            src="/images/exer.jpg"
            alt="Упражнения"
            className="w-[500px] h-[300px] rounded-sm object-cover"
            onClick={() => setIsModalOpen('exercises')}
          />
        </section>
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5`}>
          <div className="flex justify-between mb-8">
            <div className="font-yanone text-5xl flex flex-col">
              <span>{firstName}</span>
              <span>{lastName || ''}</span>
            </div>
            <div className="text-right">
              <div id="time" className="font-anta text-4xl">{time}</div>
              <div id="date" className="font-anta text-4xl mt-4">{date}</div>
            </div>
          </div>
          <div className="flex justify-center gap-5 mb-8">
            <div
              className={`${theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '} border-2 rounded-sm w-[300px] h-[250px] text-center p-4 flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => setIsModalOpen('height')}
            >
              <p className="font-yanone text-6xl mt-10">Рост</p>
              {loading ? (
                <p className="font-anta text-6xl mt-2">...</p>
              ) : (
                <p className="font-anta text-6xl mt-2">{height.padStart(2, '0')}</p>
              )}
              <p className="font-yanone text-2xl mt-2">см</p>
            </div>
            <div
              className={`${theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '} border-2 rounded-sm w-[300px] h-[250px] text-center p-4 flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => setIsModalOpen('weight')}
            >
              <p className="font-yanone text-6xl mt-10">Вес</p>
              {loading ? (
                <p className="font-anta text-6xl mt-2">...</p>
              ) : (
                <p className="font-anta text-6xl mt-2">{weight.padStart(2, '0')}</p>
              )}
              <p className="font-yanone text-2xl mt-2">кг</p>
            </div>
            <div
              className={`${theme === 'dark' ? 'border-[#FFD700]' : 'border-[#8f2429] '} border-2 rounded-sm w-[300px] h-[250px] text-center p-4 flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => setIsModalOpen('calories')}
            >
              <p className="font-yanone text-6xl mt-10">Ккал</p>
              {loading ? (
                <p className="font-anta text-6xl mt-2">...</p>
              ) : (
                <p className="font-anta text-6xl mt-2">{calories.padStart(2, '0')}</p>
              )}
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white' : 'bg-white text-black'} rounded-sm p-6 w-[400px]`}>
                <h3 className="font-yanone text-3xl mb-4">
                  {isModalOpen === 'height' ? 'Изменить рост' : isModalOpen === 'weight' ? 'Изменить вес' : isModalOpen === 'calories' ? 'Изменить калории' : 'Изменить количество упражнений'}
                </h3>
                <input
                  type="number"
                  value={isModalOpen === 'height' ? height : isModalOpen === 'weight' ? weight : isModalOpen === 'calories' ? calories : exercisesCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isModalOpen === 'height') setHeight(value);
                    else if (isModalOpen === 'weight') setWeight(value);
                    else if (isModalOpen === 'calories') setCalories(value);
                    else setExercisesCount(value);
                  }}
                  className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-[#FFD700]' : 'bg-white text-black border-[#8f2429] '} border-2 rounded-sm p-2 w-full mb-4`}
                  placeholder="Введите значение"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsModalOpen(null)}
                    className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361]  hover:border-[#FFD700]'  : 'bg-[#8f2429]  hover:text-black hover:bg-white hover: border-[#8f2429] '} rounded-sm px-4 py-2 text-white transition-all border-2 border-transparent`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => handleSave(isModalOpen)}
                    className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361]  hover:border-[#FFD700]'  : 'bg-[#8f2429]  hover:text-black hover:bg-white hover: border-[#8f2429] '} rounded-sm px-4 py-2 text-white transition-all border-2 border-transparent`}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white shadow-md'} rounded-sm p-5`}>
          <div className="font-yanone text-2xl">
            <p>Телефонный номер: +996700000000</p>
            <p>Email: xxxx@gmail.com</p>
            <p>GitHub: xxxx</p>
          </div>
        </section>
        <Footer className="shadow-md" />
      </div>
    </div>
  );
};

export default MainPage;