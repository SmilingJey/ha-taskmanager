/**
 * Базовый класс компонента
 */
export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = this.template;
    this.update();
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

  setVisible(isVisible) {
    if (isVisible) {
      this._element.classList.remove(`visually-hidden`);
    } else {
      this._element.classList.add(`visually-hidden`);
    }
  }

  update() {}
  bind() {}
  unbind() {}
}
