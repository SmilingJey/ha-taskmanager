/**
 * Функция возвращает целое случайное число в диапазоне [0, max)
 * @param {*} max - максимальное число ()
 * @return {Node}
 */
function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Функция удаляет все дочерние элементы
 * @param {*} element - DOM элемент, из которого будут удалены дочерние
 */
function removeChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Функция возвращает случайный элемент массива
 * @param {Array} array - массив
 * @return {*} - возвращает случайный элемент массива
 */
function randomArrayItem(array) {
  return array[randomInteger(array.length)];
}

export {randomInteger, removeChilds, randomArrayItem};
