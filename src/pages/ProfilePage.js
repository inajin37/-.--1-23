import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const ProfilePage = ({ userId, setUserId, setUsername }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [username, setLocalUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Если пользователь не авторизован — переброс на страницу логина
    if (!userId) {
      navigate('/login', { replace: true });
    } else {
      // Запрос данных профиля
      fetch(`http://localhost:5000/api/profile/${userId}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status} - ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setLocalUsername(data.username || 'Пользователь');
          setEmail(data.email || 'email@example.com');
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setError(`Ошибка загрузки профиля: ${err.message}. Проверь сервер или попробуй позже.`);
          setLocalUsername('Пользователь');
          setEmail('email@example.com');
        });
    }
  }, [userId, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!userId) {
      setError('Пользователь не авторизован');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Ошибка сервера');
      }
      const data = await res.json();
      setUsername(data.user.username); // Обновляем родительское состояние
      setSuccess('Профиль обновлён');
      setPassword(''); // Очистим поле пароля после успешного обновления
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    if (userId) {
      setUserId(null);
      setUsername('');
      navigate('/login', { replace: true }); // Перенаправление на логин
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-gray-100 text-black'} font-yanone shadow-md`}>
      <div className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white shadow-md'} rounded-xl p-5 w-[50vh] flex flex-col`}>
        <h1 className="text-4xl text-center mb-4">Редактирование профиля</h1>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-xl p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-purple-600`}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-xl p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-purple-600`}
        />
        <input
          type="password"
          placeholder="Новый пароль (оставьте пустым, чтобы не менять)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-xl p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-purple-600`}
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <button
          onClick={handleUpdateProfile}
          className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-4 py-2 text-white text-xl transition-all border-2 border-transparent hover:border-purple-600 w-[150px] mx-auto`}
        >
          Сохранить
        </button>
        <button
          onClick={handleLogout}
          className={`${theme === 'dark' ? 'bg-red-600 hover:bg-[#1E1E1E]' : 'bg-red-500 hover:bg-white hover:text-black'} rounded-xl px-4 py-2 text-white text-xl transition-all border-2 border-transparent hover:border-red-600 w-[150px] mx-auto mt-4`}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
