import {removeChilds, setUniqueId} from './utils.js';
import * as moment from 'moment';
import flatpickr from "flatpickr";
import Component from './component.js';
import HashTag from './hashtag.js';

const ESC_KEYCODE = 27;
const ENTER_KEYCODE = 13;

/**
 * Класс представляет карточку задачи
 */
export default class Task extends Component {
  /**
   * Создание карточки задачи
   * @param {Object} data - описание задачи
   */
  constructor(data) {
    super();
    this._number = Task.counter++;

    this._title = data.title;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;

    this._onSubmit = null;
    this._onDelete = null;
    this._onEditEvent = this._onEditEvent.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onESCkeydown = this._onESCkeydown.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onChangeIsRepeated = this._onChangeIsRepeated.bind(this);
    this._onChangeHasDueDate = this._onChangeHasDueDate.bind(this);
    this._onHashtagInputKeydown = this._onHashtagInputKeydown.bind(this);

    this._isEdit = false;

    this._state.hasDueDate = this._dueDate && moment(this._dueDate).isValid();
    this._state.isRepeated = Object.values(this._repeatingDays).some((it) => it === true);
  }

  /**
   * Обработчик события начала редактирования
   */
  _onEditEvent() {
    this._isEdit = true;
    this._updateIsEdit();
  }

  /**
   * Отмена редактирования
   */
  cancelEdit() {
    if (this._isEdit) {
      this._isEdit = false;
      this.update();
    }
  }

  /**
   * Обработчик нажатия клавиатуры
   * @param {*} evt - событие
   */
  _onESCkeydown(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      this.cancelEdit();
    }
  }

  /**
   * Обработчик события клика на странице - для выхода из редактирования
   * если клик вне карточке задачи
   * @param {*} evt  - событие
   */
  _onDocumentClick(evt) {
    let targetElement = evt.target;
    do {
      if (targetElement === this._element) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);
    this.cancelEdit();
  }

  /**
   * Обработчик клика на кнопке : "REPEAT: YES/NO"
   */
  _onChangeIsRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this._updateIsRepeated();
  }

  /**
   * Обработчик клика на кнопке "DATE: YES/NO"
   */
  _onChangeHasDueDate() {
    this._state.hasDueDate = !this._state.hasDueDate;
    this._updateHasDueDate();
  }

  /**
   * Обработчик события нажатия клавиши в поле ввода хештега
   * @param {Event} evt - событие
   */
  _onHashtagInputKeydown(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      const hashtagInputElement = this._element.querySelector(`.card__hashtag-input`);
      const text = hashtagInputElement.value.trim();
      if (this._checkHashtagText(text)) {
        this._addHashtag(text);
      }
      evt.preventDefault();
    }
  }

  /**
   * Проверка на корректность ввода хештега
   * @param {String} text - текст хештега
   * @return {Boolean} - возвращает корректен ли ввод хештега
   */
  _checkHashtagText(text) {
    const hashtagListElement = this._element.querySelector(`.card__hashtag-list`);
    if (hashtagListElement.childElementCount >= 5) {
      return false;
    }

    if (text.charAt(0) !== `#` || text.indexOf(` `) !== -1) {
      return false;
    }

    if (text.length < 3 || text.length > 20) {
      return false;
    }

    return true;
  }

  /**
   * Обработчик нажатия на кнопку удаления задачи
   */
  _onDeleteButtonClick() {
    this.unrender();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  /**
   * Задание обработчика события удаления задачи
   * @param {Function} fn - обработчик события удаления задачи
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  /**
   * Задание обработчика события отправки формы
   * @param {Function} fn
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Обработчик отправки формы при сохранении задачи
   * @param {Event} evt - событие
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
  }

  /**
   * Создание объекта к описанием задачи из данных формы
   * @param {FormData} formData - данные формы
   * @return {Object} - объект с описанием задачи
   */
  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: undefined,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      picture: this._picture
    };

    const taskMapper = Task.createFormMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskMapper[property]) {
        taskMapper[property](value);
      }
    }

    return entry;
  }

  /**
   * Создает объект с функциями биндинга данных
   * @param {Object} target - исходный объект
   * @return {Object}
   */
  static createFormMapper(target) {
    return {
      text(value) {
        target.title = value;
      },

      repeat(value) {
        target.repeatingDays[value] = true;
      },

      hashtag(value) {
        target.tags.add(value);
      },

      color(value) {
        target.color = value;
      },

      date(value) {
        if (!target.dueDate) {
          target.dueDate = new Date();
        }
        const inputDate = moment(value, `D MMMM`);
        const newDate = moment(target.dueDate);
        newDate.month(inputDate.month());
        newDate.date(inputDate.date());
        target.dueDate = newDate.toDate();
      },

      time(value) {
        if (!target.dueDate) {
          target.dueDate = new Date();
        }
        const inputTime = moment(value, `h:mm A`);
        const newDate = moment(target.dueDate);
        newDate.hour(inputTime.hour());
        newDate.minute(inputTime.minute());
        newDate.second(0);

        target.dueDate = newDate.toDate();
      }
    };
  }

  /**
   * Установка обработчиков событий
   */
  bind() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditEvent);
    this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onESCkeydown);
    document.addEventListener(`click`, this._onDocumentClick);
    this._element.querySelector(`.card__text`).addEventListener(`click`, this._onEditEvent);
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeHasDueDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeIsRepeated);
    this._element.querySelector(`.card__hashtag-input`).addEventListener(`keydown`, this._onHashtagInputKeydown);

    const dataInputElement = this._element.querySelector(`.card__date`);
    flatpickr(dataInputElement, {altInput: true, altFormat: `j F`, dateFormat: `j F`});

    const timeInputElement = this._element.querySelector(`.card__time`);
    flatpickr(timeInputElement, {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `h:i K`});
  }

  /**
   * Удаление обработчиков событий
   */
  unbind() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.card__text`).removeEventListener(`click`, this._onEditButtonClick);
    document.removeEventListener(`keydown`, this._onESCkeydown);
    document.removeEventListener(`click`, this._onDocumentClick);
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeHasDueDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeIsRepeated);
    this._element.querySelector(`.card__hashtag-input`).removeEventListener(`keydown`, this._onHashtagInputKeydown);
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
    this._updateHasDueDate();
    this._updateDueDate();
    this._updateDeadline();
    this._updatePicture();
    this._updateIsRepeated();
    this._updateRepeatingDays();
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
   * Задает имеет ли задача дедлайн
   */
  _updateHasDueDate() {
    const statusElement = this._element.querySelector(`.card__date-status`);
    const dueDateFieldsetElement = this._element.querySelector(`.card__date-deadline`);
    statusElement.textContent = this._state.hasDueDate ? `YES` : `NO`;
    dueDateFieldsetElement.disabled = !this._state.hasDueDate;
  }

  /**
   * Задает дату выполнения задачи
   * @param {Date} dueDate - дата дедлайна
   */
  _updateDueDate() {
    const dueDate = (this._dueDate && moment(this._dueDate).isValid()) ? this._dueDate : Date.now();
    const dateElement = this._element.querySelector(`.card__date`);
    dateElement.value = moment(dueDate).format(`D MMMM`);
    const timeElement = this._element.querySelector(`.card__time`);
    timeElement.value = moment(dueDate).format(`h:mm A`);
  }

  /**
   * Задает просрочена ли задача
   */
  _updateDeadline() {
    if (this._state.hasDueDate && Date.now() > this._dueDate) {
      this._element.classList.add(`card--deadline`);
    } else {
      this._element.classList.remove(`card--deadline`);
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
   * Задает повторяется ли задача
   */
  _updateIsRepeated() {
    const statusElement = this._element.querySelector(`.card__repeat-status`);
    const repeatDaysFieldsetElement = this._element.querySelector(`.card__repeat-days`);
    statusElement.textContent = this._state.isRepeated ? `YES` : `NO`;
    repeatDaysFieldsetElement.disabled = !this._state.isRepeated;
    if (this._isRepeated) {
      this._element.classList.add(`card--repeat`);
    } else {
      this._element.classList.remove(`card--repeat`);
    }
  }

  /**
   * Задает дни в которые повторяется задача
   */
  _updateRepeatingDays() {
    for (const day in this._repeatingDays) {
      if (this._repeatingDays.hasOwnProperty(day)) {
        const dayElement = this._element.querySelector(`#repeat-${day}-${this._number}`);
        if (dayElement) {
          dayElement.checked = this._repeatingDays[day];
        }
      }
    }
  }

  /**
   * Задает теги задачи
   */
  _updateTags() {
    const tagsContainerElement = this._element.querySelector(`.card__hashtag-list`);
    removeChilds(tagsContainerElement, `.card__hashtag-inner`);
    for (const tag of this._tags) {
      this._addHashtag(tag);
    }
  }

  /**
   * Добавляет новый хештег к карточке задачи
   * @param {String} tag - текст тега
   */
  _addHashtag(tag) {
    const tagsContainerElement = this._element.querySelector(`.card__hashtag-list`);
    tagsContainerElement.prepend(new HashTag(tag).render());
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
