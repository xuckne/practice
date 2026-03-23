# Practice Projects

Набор практических работ по веб-разработке: CRUD, консоль, React, API.

---

## 📦 Проекты

### 1. **schedule-app** — Конструктор расписания
Приложение для планирования занятий на неделю.

**Функции:**
- Создание / редактирование / удаление занятий
- Фильтрация по названию и категории
- Проверка пересечений по времени
- Перемещение занятий (drag-and-drop)
- Статистика по дням
- Сохранение в localStorage

**Запуск:**
```bash
cd schedule-app
npm install
npm run dev
```
Открыть: `http://localhost:5173`

---

### 2. **pr1-car-crud-ts** — Каталог автомобилей (CRUD + TypeScript)
Консольное приложение для управления базой машин.

**Функции:**
- Добавление автомобиля
- Просмотр списка
- Редактирование по ID
- Удаление по ID
- Поля: ID, компания, модель, год, б/у или новая, цена

**Запуск:**
```bash
cd pr1-car-crud-ts
npm install
npm run start
```

---

### 3. **pr2-car-crud-inquirer** — Каталог авто (CRUD + Inquirer)
Улучшенная версия с интерактивным меню.

**Функции:**
- То же CRUD, но через удобное меню
- Выбор действий стрелками и Enter
- Валидация ввода (год, цена)
- Интерактивные подтверждения

**Запуск:**
```bash
cd pr2-car-crud-inquirer
npm install
npm run start
```

---

### 4. **pr4-dadata-notes** — Поиск адреса + Карта
React приложение с интеграцией Dadata API и Яндекс.Карт.

**Функции:**
- Поиск адреса с автодополнением (Dadata)
- Отображение адреса на Яндекс.Карте
- Список подсказок адресов
- Сохранение в localStorage
- Восстановление при перезагрузке

**Запуск:**
```bash
cd pr4-dadata-notes
npm install
npm run dev
```
Открыть: `http://localhost:5173`

**⚠️ Важно:**
В `index.html` замените `YOUR_YANDEX_API_KEY` на ваш ключ Яндекс.Карт.

---

## 🔧 Требования
- Node.js 16+
- npm или yarn

## 📚 Используемые технологии
- **TypeScript** — pr1, pr2
- **React** — schedule-app, pr4
- **Inquirer** — pr2 (интерактивное CLI)
- **Vite** — сборщик (schedule-app, pr4)
- **Dadata API** — подсказки адреса (pr4)
- **Яндекс.Карты** — отображение карты (pr4)

---

## 🚀 Быстрый запуск всех

```bash
# schedule-app
cd schedule-app && npm install && npm run dev

# pr1-car-crud-ts
cd pr1-car-crud-ts && npm install && npm run start

# pr2-car-crud-inquirer
cd pr2-car-crud-inquirer && npm install && npm run start

# pr4-dadata-notes
cd pr4-dadata-notes && npm install && npm run dev
```

---

## 📝 Описание по типам

| Проект | Тип | Назначение |
|--------|-----|-----------|
| schedule-app | SPA (React) | Планирование занятий |
| pr1-car-crud-ts | CLI (Node.js) | Управление автомобилями |
| pr2-car-crud-inquirer | CLI (Node.js + Inquirer) | CRUD с меню |
| pr4-dadata-notes | SPA (React) | Поиск адреса + карта |

---

## 📖 API ключи

- **Dadata**: Используется в `pr4-dadata-notes` (уже подставлен)
- **Яндекс.Карты**: Требуется добавить в `pr4-dadata-notes/index.html`

---

Все проекты готовы к запуску и развертыванию.
