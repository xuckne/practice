import inquirer from 'inquirer';

type Car = {
  id: string;
  company: string;
  model: string;
  year: number;
  used: boolean;
  price: number;
};

const cars: Car[] = [];

const formatCar = (car: Car) => `${car.id} | ${car.company} ${car.model} | ${car.year} | ${car.used ? 'Б/У' : 'Новый'} | ${car.price}₽`;

const listCars = () => {
  if (!cars.length) {
    console.log('Список автомобилей пуст.');
    return;
  }
  console.log('\n=== Список автомобилей ===');
  cars.forEach((car) => console.log(formatCar(car)));
};

const createCar = async () => {
  const answers = await inquirer.prompt<{
    company: string;
    model: string;
    year: string;
    used: boolean;
    price: string;
  }>([
    { name: 'company', message: 'Компания производитель:' },
    { name: 'model', message: 'Модель:' },
    {
      name: 'year',
      message: 'Год выпуска:',
      validate: (v: string) => (Number(v) > 1885 ? true : 'Введите год > 1885'),
    },
    { name: 'used', message: 'Б/У?', type: 'confirm', default: true },
    {
      name: 'price',
      message: 'Цена:',
      validate: (v: string) => (Number(v) > 0 ? true : 'Введите цену > 0'),
    },
  ]);

  const car: Car = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    company: answers.company,
    model: answers.model,
    year: Number(answers.year),
    used: answers.used,
    price: Number(answers.price),
  };

  cars.push(car);
  console.log('Автомобиль добавлен.');
};

const updateCar = async () => {
  if (!cars.length) {
    console.log('Нет автомобилей для редактирования.');
    return;
  }
  const { id } = await inquirer.prompt([{ name: 'id', message: 'ID автомобиля для редактирования:' }]);
  const car = cars.find((c) => c.id === id);
  if (!car) {
    console.log('Автомобиль не найден.');
    return;
  }

  const answers = await inquirer.prompt([
    { name: 'company', message: `Компания (${car.company}):` },
    { name: 'model', message: `Модель (${car.model}):` },
    { name: 'year', message: `Год (${car.year}):` },
    { name: 'used', message: `Б/У?`, type: 'confirm', default: car.used },
    { name: 'price', message: `Цена (${car.price}):` },
  ]);

  car.company = answers.company || car.company;
  car.model = answers.model || car.model;
  car.year = answers.year ? Number(answers.year) : car.year;
  car.used = answers.used;
  car.price = answers.price ? Number(answers.price) : car.price;

  console.log('Автомобиль обновлён.');
};

const deleteCar = async () => {
  if (!cars.length) {
    console.log('Нет автомобилей для удаления.');
    return;
  }
  const { id } = await inquirer.prompt([{ name: 'id', message: 'ID автомобиля для удаления:' }]);
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) {
    console.log('Автомобиль не найден.');
    return;
  }
  cars.splice(index, 1);
  console.log('Автомобиль удалён.');
};

const run = async () => {
  let keep = true;

  while (keep) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        message: 'Выберите действие',
        type: 'list',
        choices: [
          { name: 'Показать все автомобили', value: 'list' },
          { name: 'Добавить автомобиль', value: 'create' },
          { name: 'Обновить автомобиль', value: 'update' },
          { name: 'Удалить автомобиль', value: 'delete' },
          { name: 'Выход', value: 'exit' },
        ],
      },
    ]);

    switch (action) {
      case 'list':
        listCars();
        break;
      case 'create':
        await createCar();
        break;
      case 'update':
        await updateCar();
        break;
      case 'delete':
        await deleteCar();
        break;
      case 'exit':
        keep = false;
        console.log('Выход.');
        break;
    }
  }
};

run().catch((err) => console.error('Ошибка:', err));
