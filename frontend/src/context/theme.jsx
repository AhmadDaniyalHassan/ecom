// import React, { createContext, useState } from 'react';


// export const themes = {
//     dark: 'dark',
//     light: 'light'
// }
// export const ThemeContext = createContext({})
// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     const toggleTheme = () => {
//         setIsDarkMode(!isDarkMode);
//     };
//     const themeStyles = {
//         backgroundColor: isDarkMode ? '#333' : '#f2f2f2',
//         color: isDarkMode ? '#f2f2f2' : '#333',
//     };
//     const theme = themeStyles

//     return (
//         <ThemeContext.Provider value={{ theme, toggleTheme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// export { ThemeContext, ThemeProvider };
