import {randomInteger, randomBoolean, randomArrayFromArray, randomArrayItem} from './utils.js';
import {TASK_COLORS} from './task.js';

const MOCK_TITLES = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const MOCK_TAGS = [
  `#homework`,
  `#theory`,
  `#practice`,
  `#intensive`,
  `#keks`
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
    title: randomArrayItem(MOCK_TITLES),
    color: randomArrayItem(TASK_COLORS),
    tags: new Set(randomArrayFromArray(MOCK_TAGS).slice(0, 2)),
    dueDate: randomBoolean() ? Date.now() + 1 + randomInteger(5 * 24 * 3600 * 1000) - 2 * 24 * 3600 * 1000 : ``,
    repeatingDays,
    picture: randomBoolean() ? `//picsum.photos/100/100?r=${Math.random()}` : ``,
    isArchive: randomBoolean(),
    isFavorite: randomBoolean(),
  };
}

export default createMockTask;
