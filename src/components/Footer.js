import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`${theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-xl p-4 text-center shadow-md`}>
      <p className="font-bigshoulders text-xl">fitPlanner 2025</p>
    </footer>
  );
};

export default Footer;