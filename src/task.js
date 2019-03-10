import {removeChilds, setUniqueId} from './utils.js';
import * as moment from 'moment';
import Component from './component.js';

/**
 * Класс представляет карточку задачи
 */
export default class Task extends Component {
  /**
   * Создание карточки азадчи
   * @param {Object} data - описание задачи
   */
  constructor(data) {
    super();
    this._number = Task.counter++;
    this._title = data.title;
    this._hasDeadline = data.hasDeadline;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._isRepeating = data.isRepeating;
    this._repeatingDays = data.repeatingDays;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._element = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._isEdit = false;
  }

  /**
   * Обработчик клика на кнопке "EDIT"
   */
  _onEditButtonClick() {
    this._isEdit = true;
    this._updateIsEdit();
  }

  /**
   * Обработчик отправки формы при сохранении задачи
   * @param {Event} evt - событие
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    this._isEdit = false;
    this.update();
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick);

    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
  }

  /**
   * Удаление обработчиков событий
   */
  unbind() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick);

    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
  }

  /**
   * Создает элемент карточки задачи из шаблона
   * @return {Node}
   */
  get template() {
    const templateElement = Task.temlate.cloneNode(true);
    setUniqueId(templateElement, this._number);
    return templateElement;
  }

  /**
   * Обновление данных элементов карточки задачи
   */
  update() {
    this._updateIsEdit();
    this._updateTitle();
    this._updateColor();
    this._updateDueDate();
    this._updatePicture();
    this._updateRepeating();
    this._updateTags();
  }

  /**
   * Задает режим редактирования карточки задачи
   */
  _updateIsEdit() {
    if (this._isEdit) {
      this._element.classList.add(`card--edit`);
    } else {
      this._element.classList.remove(`card--edit`);
    }
  }

  /**
   * Задает текст карточки задачи
   */
  _updateTitle() {
    const titleElement = this._element.querySelector(`.card__text`);
    titleElement.value = this._title;
  }

  /**
   * Задает цвет карточки задачи
   */
  _updateColor() {
    this._element.classList.add(`card--${this._color}`);
    const colorInputElement = this._element.querySelector(`#color-${this._color}-${this._number}`);
    colorInputElement.checked = true;
  }

  /**
   * Задает дату выполнения задачи
   */
  _updateDueDate() {
    const statusElement = this._element.querySelector(`.card__date-status`);
    const deadlineFieldsetElement = this._element.querySelector(`.card__date-deadline`);
    if (this._hasDeadline) {
      statusElement.textContent = `YES`;
      deadlineFieldsetElement.disabled = false;
      const dateElement = deadlineFieldsetElement.querySelector(`.card__date`);
      dateElement.value = moment(this._dealineDate).format(`D MMMM`);
      const timeElement = deadlineFieldsetElement.querySelector(`.card__time`);
      timeElement.value = moment(this._dealineDate).format(`h:mm A`);
    } else {
      statusElement.textContent = `NO`;
      deadlineFieldsetElement.disabled = true;
    }
  }

  /**
   * Задает изображение прикрепленное к задаче
   */
  _updatePicture() {
    const imgConteinerElement = this._element.querySelector(`.card__img-wrap`);
    if (this._picture) {
      imgConteinerElement.classList.remove(`card__img-wrap--empty`);
      const imgElement = imgConteinerElement.querySelector(`.card__img`);
      imgElement.src = this._picture;
    } else {
      imgConteinerElement.classList.add(`card__img-wrap--empty`);
    }
  }

  /**
   * Задает дни в которые повторяется задача
   */
  _updateRepeating() {
    const statusElement = this._element.querySelector(`.card__repeat-status`);
    const repeatDaysFieldsetElement = this._element.querySelector(`.card__repeat-days`);
    if (this._isRepeating) {
      this._element.classList.add(`card--repeat`);
      statusElement.textContent = `YES`;
      repeatDaysFieldsetElement.disabled = false;
      for (const day in this._repeatingDays) {
        if (this._repeatingDays.hasOwnProperty(day)) {
          const dayElement = repeatDaysFieldsetElement.querySelector(`#repeat-${day}-${this._number}`);
          if (dayElement) {
            dayElement.checked = this._repeatingDays[day];
          }
        }
      }
    } else {
      this._element.classList.remove(`card--repeat`);
      statusElement.textContent = `NO`;
      repeatDaysFieldsetElement.disabled = true;
    }
  }

  /**
   * Задает теги задачи
   */
  _updateTags() {
    const tagsContainerElement = this._element.querySelector(`.card__hashtag-list`);
    removeChilds(tagsContainerElement, `.card__hashtag-inner`);

    for (const tag of this._tags) {
      const hashTagElement = Task.hashTagTemlate.content.querySelector(`.card__hashtag-inner`).cloneNode(true);
      const hashTagNameElement = hashTagElement.querySelector(`.card__hashtag-name`);
      hashTagNameElement.textContent = `#${tag}`;
      tagsContainerElement.prepend(hashTagElement);
    }
  }

  /**
   * Изменяет старый id элемента ввода на новый и исправляет аттрибут for
   * у соответствующего элемента label
   * @param {*} oldId - старый id
   * @param {*} newId - новый id
   */
  _setInputId(oldId, newId) {
    const inputElement = this._element.querySelector(`#${oldId}`);
    const labelElement = this._element.querySelector(`label[for=${oldId}]`);
    inputElement.id = newId;
    labelElement.htmlFor = newId;
  }


}

Task.counter = 0;
Task.temlate = document.querySelector(`#card-template`).content.querySelector(`.card`);
Task.hashTagTemlate = document.querySelector(`#task-hashtag-template`);
