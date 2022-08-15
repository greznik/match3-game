enum StatusesEnum {
  FIRE = 1, // сгорающий
  EMPTY = 2, // сгоревший
  DEFAULT = 3, // обычный
}

class Tile {
  // Тайл
  private _color: string = ''
  private _position: any = null
  private _status
  position: any
  constructor(color: string) {
    this._color = color // цвет тайла
    this._position = null // позиция
    this._status = StatusesEnum.DEFAULT // статус тайла
  }
}

// Tile.statuses = StatusesEnum;

export { Tile }
