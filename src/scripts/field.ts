import { Canvas } from './canvas'
import { Point } from './point'
import { Tile } from './tile'

export class Field {
  width: number
  height: number
  colors: any
  map: any[]
  canvas: any // Игровое поле

  constructor(config: {
    width: any
    height: any
    colors: any
    min?: any
    canvas: any
  }) {
    // создание поля нужного размера
    this.width = config.width // количество рядов
    this.height = config.height // количество колонок

    this.colors = config.colors // возможные цвета тайлов

    this.map = [] // карта поля

    this.canvas = new Canvas(config.canvas) // канва для отрисовки
    this.canvas.subscribe('click', this.onClick)

    for (let y = 0; y < this.height; y++) {
      this.map[y] = []

      for (let x = 0; x < this.width; x++) {
        this.map[y].push(null)
      }
    }

    console.log(this.map)
  }

  forEachCell(callback: { (point: any): void; (arg0: any): void }) {
    // перебор клеток поля
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(new Point(x, y))
      }
    }
  }

  fill() {
    // заполнение пустых клеток
    this.forEachCell((point) => {
      let cell = this.map[point.y][point.x]

      if (!cell) {
        // если клетка пустая
        let tile = this.getTile('red') // создать новый тайл
        tile.position = point
        this.map[point.y][point.x] = tile
      }
    })

    this.canvas.draw(this.map)
  }

  // выбрать случайным образом цвет тайла
  getColor() {
    let index = Math.floor(Math.random() * this.colors.length)
    return this.colors[index]
  }

  // создать тайл нужного/случайного цвета
  getTile(color: string) {
    return new Tile(color || this.getColor())
  }

  onClick(position: any) {
    console.log('click', position)
  }
}
