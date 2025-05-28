import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const exercises = [
  {
    title: 'Тренировка для всего тела',
    description: 'ПЕРВАЯ тренировка для НОВИЧКОВ в тренажерном зале I Полная инструкция всего за 11 МИНУТ',
    image: 'https://img.youtube.com/vi/ekriAfLg1Ms/hqdefault.jpg',
    link: 'https://youtu.be/ekriAfLg1Ms?si=y-1ZHblhC0fB_-TQ',
  },
  {
    title: 'Тренировка для пресса',
    description: 'Лучшая Тренировка На Пресс И Как Сделать 6 Кубиков!',
    image: 'https://img.youtube.com/vi/aKlKHqvdJyA/hqdefault.jpg',
    link: 'https://youtu.be/aKlKHqvdJyA?si=r5Z5Wkljzg3k3Frs',
  },
  {
    title: 'Утренняя разминка',
    description: 'Делай Это Каждое Утро для Рельефного и Спортивного Тела',
    image: 'https://img.youtube.com/vi/XEp0DujLDNE/hqdefault.jpg',
    link: 'https://youtu.be/XEp0DujLDNE?si=SuKZKYNTchIRQgip',
  },
  {
    title: 'Тренировка для спины',
    description: 'Делай ЭТО для СПИНЫ Дома | Тренировка Без Оборудования',
    image: 'https://img.youtube.com/vi/BNwrJmQauyU/hqdefault.jpg',
    link: 'https://youtu.be/BNwrJmQauyU?si=igLkNIfPTQ61n_48',
  },
  {
    title: 'Тренировка для осанки',
    description: 'КАК ИСПРАВИТЬ СУТУЛОСТЬ. Упражнения для спины. МЫШЕЧНЫЙ КОРСЕТ ДЛЯ ОСАНКИ',
    image: 'https://img.youtube.com/vi/XZybMYaD1CU/hqdefault.jpg',
    link: 'https://youtu.be/XZybMYaD1CU?si=3qHLWUrrN7rloyMf',
  },
  {
    title: 'Тренировка на грудь',
    description: 'ПРОКАЧАЙ ГРУДЬ ЗА 6 МИНУТ (ТРЕНИРОВКА ДОМА)',
    image: 'https://img.youtube.com/vi/rTA_aRCfD0M/hqdefault.jpg',
    link: 'https://youtu.be/rTA_aRCfD0M?si=mKLSSzzFdYodAOg2',
  },
  {
    title: 'Пилатес 1',
    description: 'Пилатес для красивой фигуры | Приятная силовая на все тело | 15 минут',
    image: 'https://img.youtube.com/vi/yyj9sF7hzPQ/hqdefault.jpg',
    link: 'https://youtu.be/yyj9sF7hzPQ?si=xW6DxG0xKJoMpx-M',
  },
  {
    title: 'Пилатес 2',
    description: 'Пилатес для красивой и подтянутой фигуры | Мягкая силовая тренировка на все тело',
    image: 'https://img.youtube.com/vi/Opm34N5AmD4/hqdefault.jpg',
    link: 'https://youtu.be/Opm34N5AmD4?si=7GsXyjVxNVh5t_J-',
  },
  {
    title: 'Вечерняя растяжка',
    description: '15-минут тренировки | Растяжка после рабочего дня. Комплекс упражнений для начинающих',
    image: 'https://img.youtube.com/vi/OrRu3cLS97o/hqdefault.jpg',
    link: 'https://youtu.be/OrRu3cLS97o?si=dhzervNAmqoOh3Vl',
  },
  {
    title: 'Тренировка для ног',
    description: 'ПРОКАЧАЙ НОГИ ЗА 6 МИНУТ (ТРЕНИРОВКА ДОМА)',
    image: 'https://img.youtube.com/vi/H21pTB9nJ7I/hqdefault.jpg',
    link: 'https://youtu.be/H21pTB9nJ7I?si=hTRZZx4yDq8xZsbo',
  },
];

const ExercisesPage = ({ userId, setUserId }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Инициализация состояния с учётом localStorage
  const [exerciseList, setExerciseList] = useState(() => {
    const savedExercises = localStorage.getItem(`exercises_${userId}`);
    return savedExercises ? [...exercises, ...JSON.parse(savedExercises)] : exercises;
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [newExercise, setNewExercise] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
  }); // Состояние для нового упражнения

  // Проверка авторизации
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Загрузка упражнений с сервера (если есть API)
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/exercises/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setExerciseList([...exercises, ...data]);
          }
        })
        .catch((err) => console.error('Error fetching exercises:', err));
    }
  }, [userId]);

  // Сохранение упражнений в localStorage при изменении exerciseList
  useEffect(() => {
    if (userId) {
      const addedExercises = exerciseList.slice(exercises.length); // Сохраняем только добавленные упражнения
      localStorage.setItem(`exercises_${userId}`, JSON.stringify(addedExercises));
    }
  }, [exerciseList, userId]);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик добавления упражнения
  const addExercise = () => {
    if (newExercise.title.trim() === '' || newExercise.description.trim() === '') {
      console.log('Title or description is empty');
      return;
    }

    const exerciseData = {
      title: newExercise.title,
      description: newExercise.description,
      image: newExercise.image,
      link: newExercise.link,
    };

    setExerciseList((prev) => [...prev, exerciseData]);
    setNewExercise({ title: '', description: '', image: '', link: '' });
    setIsModalOpen(false);
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-gray-100 text-black'} font-yanone shadow-md`}>
      <div className="w-full max-w-[1165px] flex flex-col gap-4 p-4">
        <Header userId={userId} setUserId={setUserId} />
        <div className="flex flex-wrap gap-2 justify-start">
          {exerciseList.map((exercise, index) => (
            <div
              key={index}
              className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} w-[220px] h-[400px] rounded-xl p-5 text-center shadow-md`}
            >
              <div className="w-full h-[139px] rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={exercise.image} alt={exercise.title} className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="h-[80px] text-xl mt-2">{exercise.title}</h3>
              <p className="h-[90px] text-sm">{exercise.description}</p>
              <a
                href={exercise.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-4 py-2 text-white font-yanone text-xl transition-all border-2 border-transparent hover:border-purple-600 inline-block`}
              >
                Перейти
              </a>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-4 py-2 text-white font-yanone text-xl transition-all border-2 border-transparent hover:border-purple-600 mt-4`}
          >
            Добавить упражнение
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white' : 'bg-white text-black'} rounded-xl p-6 w-[600px]`}>
              <h3 className="text-2xl mb-4">Добавить новое упражнение</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="title"
                  value={newExercise.title}
                  onChange={handleInputChange}
                  placeholder="Название упражнения"
                  className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-purple-600 focus:border-purple-400' : 'bg-white text-black border-[#3440EB] focus:border-blue-700'} rounded-xl p-2 text-xl border-2 focus:ring-2 focus:ring-purple-600 w-full`}
                />
                <textarea
                  name="description"
                  value={newExercise.description}
                  onChange={handleInputChange}
                  placeholder="Описание упражнения"
                  className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-purple-600 focus:border-purple-400' : 'bg-white text-black border-[#3440EB] focus:border-blue-700'} rounded-xl p-2 text-xl border-2 focus:ring-2 focus:ring-purple-600 w-full h-32 resize-none`}
                />
                <input
                  type="text"
                  name="image"
                  value={newExercise.image}
                  onChange={handleInputChange}
                  placeholder="URL изображения"
                  className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-purple-600 focus:border-purple-400' : 'bg-white text-black border-[#3440EB] focus:border-blue-700'} rounded-xl p-2 text-xl border-2 focus:ring-2 focus:ring-purple-600 w-full`}
                />
                {newExercise.image && (
                  <img
                    src={newExercise.image}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/128?text=Image+Not+Found')}
                  />
                )}
                <input
                  type="text"
                  name="link"
                  value={newExercise.link}
                  onChange={handleInputChange}
                  placeholder="Ссылка на видео"
                  className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-purple-600 focus:border-purple-400' : 'bg-white text-black border-[#3440EB] focus:border-blue-700'} rounded-xl p-2 text-xl border-2 focus:ring-2 focus:ring-purple-600 w-full`}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={addExercise}
                  className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-4 py-2 text-white transition-all border-2 border-transparent hover:border-purple-600 w-full text-xl`}
                >
                  Добавить
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`${theme === 'dark' ? 'bg-red-600 hover:bg-[#1E1E1E]' : 'bg-red-500 hover:text-black hover:bg-white hover:border-red-500'} rounded-xl px-4 py-2 text-white transition-all border-2 border-transparent hover:border-red-600 w-full text-xl`}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ExercisesPage;
