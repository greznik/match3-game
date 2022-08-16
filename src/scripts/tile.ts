import { statuses } from './statuses.js'

class Tile {
  color: string // Тайл
  position: null
  status: number
  constructor(color: string) {
    this.color = color // цвет тайла
    this.position = null // позиция
    this.status = statuses.default // статус тайла
  }
}

export { Tile }
