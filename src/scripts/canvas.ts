import { Point } from './point'
import { Subscriber } from './subscriber'

import { statuses } from './statuses'

const settings = {
  ratio: 1.14, // отношение высоты тайла к ширине
  radiusPercent: 20, // радиус скругления фронтальной части
  assets: {
    star: {
      src: '../assets/star.png',
      widthRatio: 0.58,
      heightRatio: 1,
    },
    top: {
      src: '../assets/tile-top.png',
      widthRatio: 0.95,
      heightRatio: 0.17,
    },
  },
  speed: {
    move: 10, // скорость перемещения тайлов
    remove: 5, // скорость удаления тайлов
  },
}

export class Canvas {
  subscribe(arg0: string, arg1: (data: any) => void) {
    throw new Error('Method not implemented.')
  }
  ready: boolean
  readyCallback: any
  canvas: any
  ctx: any
  canvasPosition: any
  canvasSize: { width: number; height: number }
  cols: number
  rows: number
  tile: {
    // настройки тайла
    width: number
    height: number
    radius: number
  }
  assets: any
  field: any
  constructor(canvas: any) {
    let requestAnimationFrame = window.requestAnimationFrame
    window.requestAnimationFrame = requestAnimationFrame

    new Subscriber(this)

    this.ready = false
    this.readyCallback = null

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvasPosition = null
    this.canvasSize = {
      width: 0,
      height: 0,
    }
    this.setSizes()

    // обработка клика по игровому полю
    this.canvas.addEventListener('click', (e: any) => this.onClick(e))

    this.cols = 0 // количество колонок
    this.rows = 0 // количество рядов

    this.tile = {
      // настройки тайла
      width: 0,
      height: 0,
      radius: 0,
    }

    this.assets = {} // ассеты для рендера
    this.loadAssets()
  }

  // установка и отслеживание размеров и позиции канвы
  setSizes() {
    this.canvasSize.width = this.canvas.offsetWidth

    let setPosition = () => {
      let canvasCoords = this.canvas.getBoundingClientRect()
      this.canvasPosition = new Point(canvasCoords.left, canvasCoords.top)
    }
    setPosition() // сохранить текущее положение канвы

    document.addEventListener('resize', () => {
      setPosition() // сохранить текущее положение канвы
    })

    document.addEventListener('scroll', () => {
      setPosition()
    })
  }

  // загрузка ассетов для рендера
  loadAssets() {
    let loading = 0
    let loaded = 0
    let errors = 0

    let check = () => {
      if (errors + loaded == loading) {
        this.ready = true
        this.readyCallback ? this.readyCallback() : null
      }
    }

    for (let asset in settings.assets) {
      const assetSettings = settings.assets[asset]
      let img = new Image()
      img.src = '/' + assetSettings.src
      loading++
      img.onload = () => {
        this.assets[asset] = {
          src: img,
          widthRatio: assetSettings.widthRatio,
          heightRatio: assetSettings.heightRatio,
        }
        loaded++
        check()
      }
      img.onerror = () => {
        errors++
        check()
      }
    }
  }

  onReady(callback: any) {
    if (this.ready) callback()
    else this.readyCallback = callback
  }

  // рассчитать размеры тайла с учетом размеров канвы и количества колонок
  setTileSize() {
    let tileWidth = Math.floor(this.canvasSize.width / this.cols)
    this.tile = {
      // настройки тайла
      width: tileWidth,
      height: settings.ratio * tileWidth,
      radius: (tileWidth * settings.radiusPercent) / 100,
    }
  }

  // отрисовать все игровое поле
  draw(field: string | any[], callback: () => any) {
    if (!field || !field.length || !field[0].length) return

    this.field = field // сохранить матрицу

    // если количество колонок отличается от установленного
    if (this.cols !== field[0].length) {
      this.cols = field[0].length
      this.rows = field.length
      // рассчитать новые размеры тайла
      this.setTileSize()
      // установить высоту канвы
      this.canvasSize.height = this.tile.height * this.rows
      this.canvas.height = `${this.canvasSize.height}`
    } else if (this.rows !== field.length) {
      // если отличается только количество рядов
      this.rows = field.length
      this.canvasSize.height = this.tile.height * this.rows
      this.canvas.height = `${this.canvasSize.height}`
    }

    // очистить канву
    this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)

    // отрисовать каждый тайл
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.drawTile(field[y][x], null, 0)
      }
    }

    callback ? callback() : null
  }

  // отрисовать один тайл
  drawTile(
    tile: { status: number },
    coords: null | undefined,
    size: number | undefined,
  ) {
    if (!tile) return // пустая клетка

    size = size || this.tile.width

    if (tile.status === statuses.super) {
      // супертайл
      this.drawTileSuper(tile, coords)
    } else {
      // обычный тайл
      this.drawTileDefault(tile, coords, size)
    }
  }

  // отрисовать обычный тайл
  drawTileDefault(
    tile: { status?: number; position?: any; color?: any },
    coords: any,
    size: number | undefined,
  ) {
    let ctx = this.ctx
    size = size || this.tile.width

    coords = coords || this.getCoordsByPoint(tile.position) // координаты клетки

    // координаты и размеры
    let diff = this.tile.width - size

    let x = coords.x1 + diff / 2
    let y = coords.y2 - size - diff / 2
    let width = size
    let height = width
    let radius = diff ? (size * settings.radiusPercent) / 100 : this.tile.radius

    let colors = this.getTileColors(x, y, tile.color)

    let top = () => {
      let top = this.assets.top
      let topWidth = width * top.widthRatio
      let topHeight = top.heightRatio * topWidth
      let topX = x + (width - topWidth) / 2
      let topY = y + radius / 4 - topHeight
      ctx.beginPath()
      ctx.drawImage(top.src, topX, topY, topWidth, topHeight)
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = colors.dark
      ctx.fillRect(topX, topY, topWidth, topHeight)
      ctx.globalCompositeOperation = 'source-over'
    }

    let front = () => {
      ctx.fillStyle = colors.back
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height,
      )
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()
    }

    let star = () => {
      let star = this.assets.star
      let starWidth = width * star.widthRatio
      let starHeight = starWidth * star.heightRatio
      let starX = x + (width - starWidth) / 2
      let starY = y + (height - starHeight) / 2
      ctx.globalCompositeOperation = 'destination-out'
      ctx.drawImage(star.src, starX, starY, starWidth, starHeight)
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = colors.star
      ctx.fillRect(starX - 2, starY - 2, starWidth + 4, starHeight + 4)
      ctx.globalCompositeOperation = 'source-over'
    }

    top()
    front()
    star()
  }

  // отрисовать супер-тайл
  drawTileSuper(tile: { status: number }, coords: null | undefined) {
    this.drawTileDefault(tile, coords, 0)
  }

  // собрать набор цветов для тайла по значению оттенка цвета
  getTileColors(x: any, y: number, color: any) {
    let baseColor = `hsl(${color}, 100%, 40%)`
    let lightColor = `hsl(${color}, 100%, 80%)`
    let darkColor = `hsl(${color}, 100%, 30%)`

    let x1 = x
    let x2 = x
    let y1 = y
    let y2 = y + this.tile.width

    let back = this.ctx.createLinearGradient(x1, y1, x2, y2)
    back.addColorStop(0, lightColor)
    back.addColorStop(1, baseColor)

    let star = this.ctx.createLinearGradient(x1, y1, x2, y2)
    star.addColorStop(0, darkColor)
    star.addColorStop(1, lightColor)

    return {
      back: back,
      star: star,
      base: baseColor,
      light: lightColor,
      dark: darkColor,
    }
  }

  // очистить клетку поля
  clearArea(coords: { x1: any; x2: any; y1: any; y2: any }) {
    if (!coords) return
    this.ctx.clearRect(
      coords.x1,
      coords.y1,
      coords.x2 - coords.x1,
      coords.y2 - coords.y1,
    )
  }

  // получить позицию игрового поля по координатам канвы
  getPointByCoords(coords: Point) {
    let x = Math.floor(coords.x / this.tile.width)
    let y = Math.floor(coords.y / this.tile.height)
    return new Point(x, y)
  }

  // получить координаты клетки, соответствующей конкретной позиции игрового поля
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

  // обработка клика по канве
  onClick(event: { clientX: number; clientY: number }) {
    let x = event.clientX - this.canvasPosition.x
    let y = event.clientY - this.canvasPosition.y
    let position = this.getPointByCoords(new Point(x, y))
    this.publish('click', position)
  }
  publish(arg0: string, position: Point): void {
    throw new Error('Method not implemented.')
  }

  // удалить выбранные клетки с поля
  delete(
    field: { [x: string]: { [x: string]: any } },
    cells: any[],
    callback: () => void,
  ) {
    let deleted = []
    let addDeleted = (ind: any) => {
      deleted.push(ind)
      // вызвать коллбэк, когда все тайлы удалятся
      if (deleted.length == cells.length) callback()
    }
    cells.forEach(
      (cell: { y: string | number; x: string | number }, ind: any) =>
        this.deleteTile(field[cell.y][cell.x], () => addDeleted(ind)),
    )
  }

  // анимация удаления тайла
  deleteTile(tile: any, callback: { (): void; (): void }) {
    // получить координаты клетки
    let coords = this.getCoordsByPoint(tile.position)

    let start = performance.now()

    //this.ctx.fillStyle = 'black';
    //this.ctx.beginPath();

    let size = this.tile.width

    let step = (timestamp: number) => {
      let progress = timestamp - start
      if (progress > 0) {
        // radius = progress / 30;
        // this.ctx.beginPath();
        // this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        // this.ctx.fill();
        this.clearArea(coords)
        size -= settings.speed.remove
        this.drawTile(tile, null, size)
      }
      // if (progress < 2000 && radius < this.tile.width / 2) {
      //     requestAnimationFrame(step);
      // } else {
      //     callback();
      // }
      if (size > 0) {
        requestAnimationFrame(step)
      } else {
        callback()
      }
    }

    requestAnimationFrame(step)
  }

  // анимация перемещения тайлов
  move(field: any[], callback: () => void) {
    this.field = field

    let movingSet: any[] = []
    field.forEach((row: any[], y: any) => {
      row.forEach(
        (
          tile: {
            from: { x: any; y: any }
            current: { x1: number; x2: number; y1: number; y2: number }
            destination: { x1: number; x2: number; y1: number; y2: number }
            position: any
          },
          x: any,
        ) => {
          if (!tile || !tile.from) return
          if (tile.from.x !== x || tile.from.y !== y) {
            tile.current = this.getCoordsByPoint(tile.from)
            tile.destination = this.getCoordsByPoint(tile.position)
            movingSet.push(tile)
          }
        },
      )
    })

    if (!movingSet.length) {
      callback()
      return
    }

    let step = () => {
      let next = false
      movingSet.forEach((tile) => {
        if (!tile.current) return
        this.clearArea(tile.current)

        tile.current.y1 -= settings.speed.move
        tile.current.y2 -= settings.speed.move

        if (tile.current.y1 <= tile.destination.y1) {
          tile.current = null
        } else {
          next = true
        }
        this.drawTile(tile, tile.current, 0)
      })
      if (next) {
        requestAnimationFrame(step)
      } else {
        callback()
      }
    }

    requestAnimationFrame(step)
  }
}
