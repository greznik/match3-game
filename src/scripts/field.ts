import { Point } from './point'
import { Tile } from './tile'
import { Canvas } from './canvas'
import { Subscriber } from './subscriber'

export class Field {
  deactivate: boolean
  cols: any
  rows: any
  colors: any
  minGroupCount: any
  map: any
  canvas: Canvas
  inAction: boolean
  subscribers: any
  // Игровое поле

  constructor(config: {
    width: any
    height: any
    colors: any
    min: any
    canvas: any
  }) {
    // создание поля нужного размера
    new Subscriber(this)

    this.deactivate = false

    this.cols = config.width // количество колонок
    this.rows = config.height // количество рядов

    this.colors = config.colors // возможные цвета тайлов

    this.minGroupCount = config.min

    this.map = [] // карта поля

    this.canvas = new Canvas(config.canvas) // канва для отрисовки
    this.canvas.subscribe('click', (data) => this.onClick(data))

    for (let y = 0; y < this.rows; y++) {
      this.map[y] = []

      for (let x = 0; x < this.cols; x++) {
        this.map[y].push(null)
      }
    }
  }

  forEachCell(callback: {
    (point: any): void
    (point: any): void
    (arg0: Point): void
  }) {
    // перебор клеток поля
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        callback(new Point(x, y))
      }
    }
  }

  start() {
    this.canvas.onReady(() => this.fill())
  }

  fill() {
    // заполнение пустых клеток
    this.forEachCell((point) => {
      let cell = this.map[point.y][point.x]

      if (!cell) {
        // если клетка пустая
        let tile = this.getTile() // создать новый тайл
        tile.position = point
        this.map[point.y][point.x] = tile
      }
    })
    this.canvas.draw(this.map, () => (this.inAction = false))
  }

  // выбрать случайным образом цвет тайла
  getColor() {
    let index = Math.floor(Math.random() * this.colors.length)
    return this.colors[index]
  }

  // создать тайл нужного/случайного цвета
  getTile(color: undefined) {
    return new Tile(color || this.getColor())
  }

  onClick(position: any) {
    if (this.deactivate) return
    this.inAction = true

    let neighbors = this.getNeighbors(position)

    if (neighbors.length < this.minGroupCount) return

    this.canvas.delete(this.map, neighbors, () => {
      this.publish('remove', neighbors.length)
      neighbors.forEach((point: { y: string | number; x: string | number }) => {
        this.map[point.y][point.x] = null
      })

      this.canvas.draw(this.map)
      this.move()
    })
  }

  getNeighbors(position: { y: string | number; x: string | number }) {
    let tile = this.map[position.y][position.x]
    if (!tile) return false

    let color = tile.color

    let neighbors: any[] = []

    let check = (position: Point) => {
      if (
        // если клетка за пределами диапазона
        position.x < 0 ||
        position.y < 0 ||
        position.x > this.cols - 1 ||
        position.y > this.rows - 1
      )
        return // пропустить ее

      let currentTile = this.map[position.y][position.x] // тайл с текущей позиции
      if (
        !currentTile || // если клетка пустая
        currentTile.checked || // или уже проверенная
        currentTile.color !== color // или цвет не совпадает
      )
        return // пропустить ее

      neighbors.push(position) // добавить клетку в массив
      currentTile.checked = true // пометить тайл как проверенный

      check(new Point(position.x - 1, position.y))
      check(new Point(position.x + 1, position.y))
      check(new Point(position.x, position.y - 1))
      check(new Point(position.x, position.y + 1))
    }

    check(position)

    return neighbors
  }

  move() {
    // все тайлы поднимаются вверх на свободные места
    let cols: any[] = []
    this.forEachCell((point) => {
      if (!cols[point.x]) cols[point.x] = []
      cols[point.x][point.y] = this.map[point.y][point.x]
    })

    cols = cols.map((col, x) => {
      col = col.filter((cell: { from: any; position: any }) => {
        if (!cell) return false
        cell.from = cell.position
        return cell
      })
      for (let i = 0; i < this.rows; i++) {
        if (!col[i]) {
          col[i] = null
          continue
        }
        col[i].position = new Point(x, i)
      }
      return col
    })

    cols.forEach((col, x) => {
      col.forEach((cell: any, y: string | number) => {
        this.map[y][x] = cell
      })
    })

    this.canvas.move(this.map, () => this.fill())
  }

  subscribe(event: string, callback: (count: any) => void) {
    if (!this.subscribers[event]) this.subscribers[event] = []

    this.subscribers[event].push(callback)
  }

  publish(event: string, data: any) {
    let subscribers = this.subscribers[event]

    subscribers.forEach((callback: (arg0: any) => any) => callback(data))
  }

  stop() {
    this.deactivate = true
  }
}
