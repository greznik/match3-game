import { Field } from './field'
import { settings } from './settings'

export class Game {
  private _field
  private _default
  constructor(config: any) {
    // настройки игры
    this._default = settings // настройки игры по умолчанию

    // создать игровое поле
    this._field = new Field({
      width: config.width || this._default.width,
      height: config.heigth || this._default.height,
      colors: config.colors || this._default.colors,
      min: config.min || this._default.min,
      canvas: config.canvas,
    })

    // заполнить пустое поле случайными тайлами
    this._field.fill()
  }
}
