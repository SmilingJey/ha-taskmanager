import {randomInteger, randomBoolean, randomArrayFromArray, randomArrayItem} from './utils.js';

const TITLES = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const TAGS = [
  `#homework`,
  `#theory`,
  `#practice`,
  `#intensive`,
  `#keks`
];

const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

const DAYS = [
  `mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`
];

/**
 * Функция возвращает случайно сгенерированную задачу
 * @return {Object} - задача
 */
function createMockTask() {
  const repeatingDays = {};
  DAYS.map((item) => (repeatingDays[item] = randomBoolean(0.1)));

  return {
    title: randomArrayItem(TITLES),
    color: randomArrayItem(COLORS),
    tags: new Set(randomArrayFromArray(TAGS).slice(0, 3)),
    dueDate: randomBoolean() ? Date.now() + 1 + randomInteger(7 * 24 * 3600 * 1000) : ``,
    repeatingDays,
    picture: randomBoolean() ? `//picsum.photos/100/100?r=${Math.random()}` : ``,
  };
}

export default createMockTask;
