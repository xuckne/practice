import { useEffect, useMemo, useState } from 'react';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const CATEGORIES = ['Математика', 'Физика', 'Информатика', 'Языки', 'Другие'];
const STORAGE_KEY = 'schedule-app-data';

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatTimeAsMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function hasConflict(event, events, skipId = null) {
  const start = parseTime(event.time);
  const end = start + Number(event.duration);
  return events.some((ev) => {
    if (ev.id === skipId) return false;
    if (ev.day !== event.day) return false;

    const evStart = parseTime(ev.time);
    const evEnd = evStart + Number(ev.duration);
    return Math.max(start, evStart) < Math.min(end, evEnd);
  });
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Все');
  const [form, setForm] = useState({ id: null, name: '', category: CATEGORIES[0], day: DAYS[0], time: TIMES[0], duration: 60 });
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEvents(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Не удалось загрузить расписание', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const visibleEvents = useMemo(() => {
    return events.filter((ev) => {
      const q = search.trim().toLowerCase();
      const hit = q
        ? ev.name.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q)
        : true;
      const categoryOK = categoryFilter === 'Все' || ev.category === categoryFilter;
      return hit && categoryOK;
    });
  }, [events, search, categoryFilter]);

  const stats = useMemo(() => {
    const byDay = {};
    DAYS.forEach((d) => (byDay[d] = 0));
    events.forEach((ev) => {
      if (byDay[ev.day] != null) byDay[ev.day] += 1;
    });
    return { total: events.length, byDay };
  }, [events]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Введите название занятия');
      return;
    }

    const candidate = { ...form, duration: Number(form.duration) };
    if (candidate.duration <= 0) {
      setError('Продолжительность должна быть > 0');
      return;
    }

    if (hasConflict(candidate, events, candidate.id)) {
      setError('Конфликт по времени с существующим занятием');
      return;
    }

    if (candidate.id) {
      setEvents((prev) => prev.map((ev) => (ev.id === candidate.id ? candidate : ev)));
    } else {
      candidate.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setEvents((prev) => [...prev, candidate]);
    }

    setForm({ id: null, name: '', category: CATEGORIES[0], day: DAYS[0], time: TIMES[0], duration: 60 });
    setError('');
  };

  const onEdit = (ev) => {
    setForm({ ...ev });
    setError('');
  };

  const onDelete = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const onDragStart = (event, evId) => {
    event.dataTransfer.setData('text/plain', evId);
  };

  const onDrop = (event, day, time) => {
    event.preventDefault();
    const evId = event.dataTransfer.getData('text/plain');
    if (!evId) return;

    const ev = events.find((x) => x.id === evId);
    if (!ev) return;

    const updated = { ...ev, day, time };
    if (hasConflict(updated, events, evId)) {
      alert('Нельзя переместить: конфликт по времени.');
      return;
    }

    setEvents((prev) => prev.map((x) => (x.id === evId ? updated : x)));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="app-container">
      <h1>Конструктор расписания</h1>

      <section className="controls">
        <form className="event-form" onSubmit={onSubmit}>
          <h2>{form.id ? 'Редактировать занятие' : 'Добавить занятие'}</h2>
          <label>
            Название
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Категория
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>
            День
            <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>
            Время
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Длительность (мин)
            <input
              type="number"
              min="15"
              step="15"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </label>

          <button type="submit">{form.id ? 'Сохранить' : 'Добавить'}</button>
          {form.id && (
            <button type="button" onClick={() => setForm({ id: null, name: '', category: CATEGORIES[0], day: DAYS[0], time: TIMES[0], duration: 60 })}>
              Отменить
            </button>
          )}
          {error && <div className="error">{error}</div>}
        </form>

        <div className="filters">
          <h2>Фильтры</h2>
          <label>
            Поиск
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="по названиям/категориям" />
          </label>
          <label>
            Категория
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>Все</option>
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <div className="stats">
            <h3>Статистика</h3>
            <p>Всего занятий: {stats.total}</p>
            <ul>
              {DAYS.map((day) => (
                <li key={day}>
                  {day}: {stats.byDay[day]}
                </li>
              ))}
            </ul>
          </div>

          <div className="event-list">
            <h3>Список занятий ({visibleEvents.length})</h3>
            {visibleEvents.length === 0 && <p>Нет занятий</p>}
            <ul>
              {visibleEvents.map((ev) => (
                <li key={ev.id} className="event-row">
                  <span>
                    {ev.name} — {ev.category} ({ev.day} {ev.time} [{ev.duration} мин])
                  </span>
                  <button onClick={() => onEdit(ev)}>Изменить</button>
                  <button onClick={() => onDelete(ev.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid-wrap">
        <h2>Сетка недели (drag-and-drop)</h2>
        <div className="schedule-grid">
          <div className="cell header-cell"></div>
          {DAYS.map((day) => (
            <div key={day} className="cell header-cell">
              {day}
            </div>
          ))}

          {TIMES.map((time) => (
            <>
              <div key={`${time}-label`} className="cell time-cell">
                {time}
              </div>
              {DAYS.map((day) => {
                const matchEvent = events.find((ev) => ev.day === day && ev.time === time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className="cell drop-cell"
                    onDrop={(e) => onDrop(e, day, time)}
                    onDragOver={onDragOver}
                  >
                    {matchEvent ? (
                      <div
                        className="tile"
                        draggable
                        onDragStart={(e) => onDragStart(e, matchEvent.id)}
                      >
                        <strong>{matchEvent.name}</strong>
                        <span>{matchEvent.category}</span>
                        <span>{formatTimeAsMinutes(parseTime(matchEvent.time))}-{formatTimeAsMinutes(parseTime(matchEvent.time)+matchEvent.duration)}</span>
                      </div>
                    ) : (
                      <span className="empty">—</span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </section>
    </div>
  );
}
