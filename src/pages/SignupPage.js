import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const SignupPage = ({ setUserId, setUsername }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация полей
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Все поля обязательны');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
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
    <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-[#0e1426]  text-white' : 'bg-gray-100 text-black'} font-yanone`}>
      <div className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white'} rounded-sm p-5 w-[50vh] flex flex-col shadow-md`}>
        <h1 className="text-4xl text-center mb-4">Регистрация</h1>
        <input
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-sm p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-[#FFD700]`}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-sm p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-[#FFD700]`}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-sm p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-[#FFD700]`}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-sm p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-[#FFD700]`}
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${theme === 'dark' ? 'bg-[#0d0361]  text-white border-gray-400 focus:border-purple-400' : 'bg-white text-black border-gray-300 focus:border-purple-500'} rounded-sm p-2 w-full h-[35px] mb-4 border focus:ring-2 focus:ring-[#FFD700]`}
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          onClick={handleSignup}
          className={`${theme === 'dark' ? 'bg-[#FFD700] hover:bg-[#0d0361] ' : 'bg-[#8f2429]  hover:text-black hover:bg-white hover:border-[#8f2429] '} rounded-sm px-4 py-2 text-white text-xl transition-all border-2 border-transparent hover:border-[#FFD700] w-[150px] mx-auto`}
        >
          Зарегистрироваться
        </button>
        <Link
          to="/login"
          className={`${theme === 'dark' ? 'text-[#FFD700] hover:text-[#f5f542]' : 'text-[#8f2429]  hover:text-blue-500'} text-xl text-center mt-4`}
        >
          У вас есть аккаунт? Вход
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;