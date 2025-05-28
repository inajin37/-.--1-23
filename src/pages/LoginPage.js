import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const LoginPage = ({ setUserId, setUsername }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Ошибка сервера');
      }
      const data = await res.json();
      setUserId(data.userId);
      setUsername(data.username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-gray-100 text-black'} font-yanone`}>
      <div className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-xl p-5 w-[50vh] flex flex-col shadow-md`}>
        <h1 className="text-4xl text-center mb-4">Вход</h1>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-xl p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-purple-600`}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#1E1E1E] text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-xl p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-purple-600`}
        />
        <label className="flex items-center mb-4 text-xl">
          <input type="checkbox" className="mr-2" />
          Запомнить меня
        </label>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className={`${theme === 'dark' ? 'bg-purple-600 hover:bg-[#1E1E1E]' : 'bg-[#3440EB] hover:text-black hover:bg-white hover:border-[#3440EB]'} rounded-xl px-4 py-2 text-white text-xl transition-all border-2 border-transparent hover:border-purple-600 w-[150px] mx-auto`}
        >
          Войти
        </button>
        <Link
          to="/signup"
          className={`${theme === 'dark' ? 'text-purple-600 hover:text-purple-400' : 'text-[#3440EB] hover:text-blue-500'} text-xl text-center mt-4`}
        >
          У вас нет аккаунта? Регистрация
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;