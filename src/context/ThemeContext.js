import { createContext, useEffect, useState } from 'react';

// Создаем контекст для темы
export const ThemeContext = createContext();

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  // Состояние для темы (по умолчанию - темная)
  const [theme, setTheme] = useState('dark');

  // Проверяем сохраненную тему в localStorage при загрузке
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Если тема не сохранена, устанавливаем темную по умолчанию
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Сохраняем тему в localStorage при её изменении
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Применяем класс к body для глобальных стилей
  }, [theme]);

  // Функция для переключения темы
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};