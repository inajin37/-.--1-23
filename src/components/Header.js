import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Header = ({ showNav = true, userId, username, setUserId, setUsername }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserId(null);
    setUsername('');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('lastPath'); // Удаляем lastPath при выходе
    navigate('/login');
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-[#0d0361] ' : 'bg-white'} rounded-sm p-4 flex justify-between items-center shadow-md`}>
      <h1 className="font-mono  text-4xl">GYM Plan</h1>
      {showNav ? (
        <nav className="flex-1 flex justify-center">
          <ul className="font-yanone flex list-none gap-5 mt-0">
            <li>
              <Link
                to="/"
                className={`${theme === 'dark' ? 'text-[#FFD700]hover:text-purple-400 after:from-[#FFD700] after:to-[#c7b70e] before:from-[#FFD700] before:to-[#c7b70e] ' : 'text-[#8f2429]   hover:[#8f2429]  before:from-[#ff0509] before:to-[#ff0509] after:from-[#ff0509] after:to-[#ff0509]'} text-xl relative transition-all after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r  after:bottom-[-5px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-gradient-to-r before:top-[-5px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                to="/plan"
                className={`${theme === 'dark' ? 'text-[#FFD700]hover:text-purple-400 after:from-[#FFD700] after:to-[#c7b70e] before:from-[#FFD700] before:to-[#c7b70e] ' : 'text-[#8f2429]   hover:[#8f2429]  before:from-[#ff0509] before:to-[#ff0509] after:from-[#ff0509] after:to-[#ff0509]'} text-xl relative transition-all after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r  after:bottom-[-5px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-gradient-to-r before:top-[-5px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100`}
              >
                Тренировки
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`${theme === 'dark' ? 'text-[#FFD700]hover:text-purple-400 after:from-[#FFD700] after:to-[#c7b70e] before:from-[#FFD700] before:to-[#c7b70e] ' : 'text-[#8f2429]   hover:[#8f2429]  before:from-[#ff0509] before:to-[#ff0509] after:from-[#ff0509] after:to-[#ff0509]'} text-xl relative transition-all after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r  after:bottom-[-5px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-gradient-to-r before:top-[-5px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100`}
              >
                Календарь
              </Link>
            </li>
            <li>
              <Link
                to="/exercises"
                className={`${theme === 'dark' ? 'text-[#FFD700]hover:text-purple-400 after:from-[#FFD700] after:to-[#c7b70e] before:from-[#FFD700] before:to-[#c7b70e] ' : 'text-[#8f2429]   hover:[#8f2429]  before:from-[#ff0509] before:to-[#ff0509] after:from-[#ff0509] after:to-[#ff0509]'} text-xl relative transition-all after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r  after:bottom-[-5px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-gradient-to-r before:top-[-5px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100`}
              >
                Упражнения
              </Link>
            </li>
          </ul>
        </nav>
      ) : userId ? (
        <div className="flex-1 flex justify-center gap-4">
          <Link
            to="/profile"
            className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-gray-800' : 'bg-purple-500 hover:bg-white'} rounded-sm px-4 py-2 text-white font-belanosima text-xl transition-all border-2 border-transparent hover:border-[#FFD700]`}
          >
            {username || 'Профиль'}
          </Link>
          <button
            onClick={handleLogout}
            className={`${theme === 'dark' ? 'bg-red-600 hover:bg-gray-800' : 'bg-red-500 hover:bg-white'} rounded-sm px-4 py-2 text-white font-belanosima text-xl transition-all border-2 border-transparent hover:border-red-600`}
          >
            Выйти
          </button>
        </div>
      ) : (
        <div className="flex-1 flex justify-center">
          <Link
            to="/login"
            className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-gray-800' : 'bg-purple-500 hover:bg-white'} rounded-sm px-4 py-2 text-white font-belanosima text-xl transition-all border-2 border-transparent hover:border-[#FFD700]`}
          >
            Вход
          </Link>
        </div>
      )}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`${theme === 'dark' ? 'bg-[#FFD700]hover:bg-[#0d0361]  hover:border-[#FFD700]' : 'bg-[#8f2429]  hover:bg-white hover:border-[#8f2429]  hover:text-black'} rounded-full w-12 h-12 flex items-center justify-center text-white font-belanosima text-xl transition-all border-2 border-transparent`}
        >
          {theme === 'dark' ? '☽' : '☀'}
        </button>
        <Link
          to="/profile"
          className={`${theme === 'dark' ? 'bg-[#FFD700] hover:bg-[#0d0361]  hover:border-[#FFD700]' : 'bg-[#8f2429]  hover:bg-white hover:border-[#8f2429]  hover:text-black'} rounded-full w-12 h-12 flex items-center justify-center text-white font-belanosima text-xl transition-all border-2 border-transparent`}
        >
          {userId ? '👤' : '👤'}  
        </Link>
      </div>
    </header>
  );
};

export default Header;