import { useEffect, useState } from 'react';

const EFFECT_KEY = 'pr4-dadata-notes-address';

export default function App() {
  const [input, setInput] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const mapInstance = new window.ymaps.Map('yandex-map', {
          center: [55.751244, 37.618423],
          zoom: 10,
          controls: ['zoomControl', 'geolocationControl'],
        });
        setMap(mapInstance);
        setMapLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(EFFECT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setInput(parsed.input || '');
      setAddress(parsed.address || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(EFFECT_KEY, JSON.stringify({ input, address }));
  }, [input, address]);

  const onSearch = async () => {
    if (!input.trim()) {
      setError('Введите адрес');
      return;
    }

    try {
      setError('');
      const token = 'ff4269447606ae7078b2d6348855e2c4aac3c30c';
      const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ query: input, count: 5 }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }

      const result = await response.json();
      setSuggestions(result.suggestions || []);

      if (result.suggestions?.[0]) {
        setAddress(result.suggestions[0].value);

        const first = result.suggestions[0];
        const lat = first.data?.geo_lat;
        const lon = first.data?.geo_lon;

        if (lat && lon) {
          if (map) {
            map.setCenter([Number(lat), Number(lon)], 15);
            map.geoObjects.removeAll();
            const placemark = new window.ymaps.Placemark([Number(lat), Number(lon)], {
              balloonContent: first.value,
            });
            map.geoObjects.add(placemark);
          } else {
            setError('Карта ещё загружается. Повторите запрос через секунду.');
          }
        }
      }
    } catch (e) {
      setError('Ошибка при запросе адреса. Вставьте свой ключ DADATA.');
      setSuggestions([]);
    }
  };

  return (
    <div className="app-wrap">
      <h1>Практическая работа №4: Заметки (useEffect)</h1>

      <div className="search-row">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Введите адрес" />
        <button onClick={onSearch}>Поиск</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="results">
        <div className="address-block">
          <h3>Найденный адрес</h3>
          <p>{address || 'Не найдено'}</p>
        </div>

        <div className="map-block">
          <h3>Карта</h3>
          <div id="yandex-map" />
          {!mapLoaded && <p>Загрузка карты...</p>}
        </div>
      </div>

      <div className="suggestions">
        <h3>Варианты</h3>
        <ul>
          {suggestions.map((item, idx) => (
            <li key={idx}>{item.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
