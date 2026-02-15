# Code Styleguide

## Именование

| Тип             | Стиль           | Пример                           |
| --------------- | --------------- | -------------------------------- |
| Переменные      | camelCase       | `totalCost`, `isActive`          |
| Функции         | camelCase       | `calculateDailyCost`             |
| Константы       | SCREAMING_SNAKE | `MAX_CATEGORIES`, `PERIODS`      |
| Типы/Интерфейсы | PascalCase      | `Expense`, `DashboardProps`      |
| Компоненты      | PascalCase      | `ExpenseList.tsx`                |
| Хуки            | camelCase       | `useExpenses.ts`                 |
| CSS Modules     | camelCase       | `styles.expenseCard`             |
| Булевы          | is/has/can      | `isRecurring`, `hasAmortization` |

## Структура файлов

- 150 строк — мягкий лимит
- 200 строк — рефакторинг обязателен

## Структура компонента

1. Импорты (React, библиотеки, компоненты, хуки, утилиты, стили)
2. Интерфейс пропсов
3. Компонент (function declaration)
4. export default

## Стек

- React 19 (Function Components, Hooks)
- Vite — сборка и HMR
- TypeScript strict mode
- CSS Modules / Vanilla CSS (никаких inline-стилей)
