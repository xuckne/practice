import readline from 'readline';

type Car = {
  id: string;
  company: string;
  model: string;
  year: number;
  used: boolean;
  price: number;
};

const cars: Car[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text: string) => new Promise<string>((resolve) => rl.question(text, resolve));

const showMenu = () => {
  console.log('\n=== Каталог автомобилей CRUD (TS) ===');
  console.log('1) Показать все');
  console.log('2) Добавить автомобиль');
  console.log('3) Обновить автомобиль');
  console.log('4) Удалить автомобиль');
  console.log('5) Выход');
};

const printCars = () => {
  if (!cars.length) {
    console.log('Список пуст');
    return;
  }

  for (const car of cars) {
    console.log(`ID: ${car.id} | ${car.company} ${car.model} | ${car.year} | ${car.used ? 'Б/У' : 'Новый'} | ${car.price}₽`);
  }
};

const createCar = async () => {
  const company = await question('Компания производитель: ');
  const model = await question('Модель: ');
  const year = Number(await question('Год выпуска: '));
  const used = (await question('Б/У? (y/n): ')).toLowerCase() === 'y';
  const price = Number(await question('Цена: '));

  const car: Car = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    company,
    model,
    year,
    used,
    price,
  };

  cars.push(car);
  console.log('Автомобиль добавлен.');
};

const updateCar = async () => {
  const id = await question('ID автомобиля для обновления: ');
  const car = cars.find((c) => c.id === id);
  if (!car) {
    console.log('Автомобиль не найден.');
    return;
  }

  const company = await question(`Компания (${car.company}): `);
  const model = await question(`Модель (${car.model}): `);
  const yearInput = await question(`Год (${car.year}): `);
  const usedInput = await question(`Б/У? (${car.used ? 'y' : 'n'}): `);
  const priceInput = await question(`Цена (${car.price}): `);

  car.company = company || car.company;
  car.model = model || car.model;
  car.year = yearInput ? Number(yearInput) : car.year;
  car.used = usedInput ? usedInput.toLowerCase() === 'y' : car.used;
  car.price = priceInput ? Number(priceInput) : car.price;

  console.log('Автомобиль обновлён.');
};

const deleteCar = async () => {
  const id = await question('ID автомобиля для удаления: ');
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) {
    console.log('Автомобиль не найден.');
    return;
  }
  cars.splice(index, 1);
  console.log('Автомобиль удалён.');
};

const run = async () => {
  while (true) {
    showMenu();
    const choice = await question('Выберите пункт: ');

    if (choice === '1') {
      printCars();
    } else if (choice === '2') {
      await createCar();
    } else if (choice === '3') {
      await updateCar();
    } else if (choice === '4') {
      await deleteCar();
    } else if (choice === '5') {
      break;
    } else {
      console.log('Неправильный выбор.');
    }
  }

  rl.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Ошибка:', err);
  rl.close();
  process.exit(1);
});
