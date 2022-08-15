import { Point } from './point.js'

export { Tile } from './tile.js'

export class Canvas {
  canvas: any
  ctx: any
  canvasX: any
  canvasY: any
  cols: number
  rows: number
  tile: { width: number; height: number }
  width: number
  height: number
  subscribers: any
  constructor(canvas: any, tile = { width: 60, height: 60 }) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    let canvasCoords = this.canvas.getBoundingClientRect()
    this.canvasX = canvasCoords.left
    this.canvasY = canvasCoords.top

    document.addEventListener('resize', (e) => {
      let canvasCoords = this.canvas.getBoundingClientRect()
      this.canvasX = canvasCoords.left
      this.canvasY = canvasCoords.top
    })

    document.addEventListener('scroll', (e) => {
      let canvasCoords = this.canvas.getBoundingClientRect()
      this.canvasX = canvasCoords.left
      this.canvasY = canvasCoords.top
    })

    this.canvas.addEventListener('click', (e: any) => this.onClick(e))

    this.cols = 0
    this.rows = 0
    this.tile = tile

    this.width = 0
    this.height = 0

    this.subscribers = {}
  }

  draw(field: string | any[]) {
    if (!field || !field.length || !field[0].length) return
    console.log('field', field)
    if (this.rows !== field.length) {
      this.height = field.length * this.tile.height
      this.canvas.height = `${this.height}`
      this.rows = field.length
    }

    if (this.cols !== field[0].length) {
      this.width = field[0].length * this.tile.width
      this.canvas.width = `${this.width}`
      this.cols = field[0].length
    }

    this.ctx.clearRect(0, 0, this.width, this.height)

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.drawTile(field[y][x])
      }
    }
  }

  drawTile(tile: { position: any; color: any; status: any }) {
    let coords = this.getCoordsByPoint(tile.position)
    this.ctx.fillStyle = tile.color
    this.ctx.fillRect(coords.x1, coords.y1, this.tile.width, this.tile.height)
    this.ctx.fill()
    if (!tile) {
      // пустая клетка
    } else {
      switch (tile.status) {
      }
    }
  }

  getPointByCoords(coords: Point) {
    let x = Math.floor(coords.x / this.tile.width)
    let y = Math.floor(coords.y / this.tile.height)
    return new Point(x, y)
  }

  getCoordsByPoint(point: { x: number; y: number }) {
    let x1 = point.x * this.tile.width
    let x2 = x1 + this.tile.width

    let y1 = point.y * this.tile.height
    let y2 = y1 + this.tile.height

    return {
      x1,
      x2,
      y1,
      y2,
    }
  }

  onClick(event: { clientX: number; clientY: number }) {
    let x = event.clientX - this.canvasX
    let y = event.clientY - this.canvasY
    let position = this.getPointByCoords(new Point(x, y))
    this.publish('click', position)
  }

  subscribe(event: string | number, callback: any) {
    if (!this.subscribers[event]) this.subscribers[event] = []

    this.subscribers[event].push(callback)
  }

  publish(event: string, data: Point) {
    let subscribers = this.subscribers[event]

    subscribers.forEach((callback: (arg0: Point) => any) => callback(data))
  }
}
