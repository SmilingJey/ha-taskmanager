import Component from './component.js';

/**
 * Класс представляет хэштег карточки задачи
 */
export default class HashTag extends Component {
  constructor(text, onHashTagClick) {
    super();
    this._text = text;
    this._onClick = this._onClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onHashTagClick = onHashTagClick;
  }

  /**
   * Обработчик события клика по хештегу
   */
  _onClick() {
    if (typeof this._onHashTagClick === `function`) {
      this._onHashTagClick(this._text);
    }
  }

  /**
   * Обработчик события удаления хештега
   * @param {Event} evt - событие
   */
  _onDeleteButtonClick(evt) {
    this.unrender();
    evt.stopPropagation();
  }


  get template() {
    return HashTag.template.content.querySelector(`.card__hashtag-inner`).cloneNode(true);
  }

  update() {
    const hashTagInputElement = this._element.querySelector(`.card__hashtag-hidden-input`);
    hashTagInputElement.value = this._text;
    const hashTagNameElement = this._element.querySelector(`.card__hashtag-name`);
    hashTagNameElement.textContent = this._text;
  }

  bind() {
    this._element.querySelector(`.card__hashtag-name`).addEventListener(`click`, this._onClick);

    this._element.querySelector(`.card__hashtag-delete`).addEventListener(`click`, this._onDeleteButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__hashtag-name`).removeEventListener(`click`, this._onClick);

    this._element.querySelector(`.card__hashtag-delete`).removeEventListener(`click`, this._onDeleteButtonClick);
  }
}

HashTag.template = document.querySelector(`#task-hashtag-template`);
