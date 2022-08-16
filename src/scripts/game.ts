import { Field } from './field'
import { settings } from './settings'
import { HTMLBinder } from './html-binder'

export class Game {
  level: number
  steps: number
  points: number
  progress: number
  default: any
  stopped: boolean
  roundPoints: number
  field: Field
  constructor(config: any) {
    // настройки игры
    this.default = settings // настройки игры по умолчанию

    this.stopped = false // игра окончена

    let binder = new HTMLBinder(this, 'data-bind', [
      'roundPoints',
      'points',
      'steps',
      'level',
    ])
    binder.bindProp(
      this,
      'data-progress',
      'progress',
      (el: { style: { width: string } }, val: any) =>
        (el.style.width = `${val}%`),
    )

    this.level = 1

    this.steps = 15
    this.points = 0
    this.roundPoints = 1000
    this.progress = (this.points / this.roundPoints) * 100

    // создать игровое поле
    this.field = new Field({
      width: config.width || this.default.width,
      height: config.heigth || this.default.height,
      colors: config.colors || this.default.colors,
      min: config.min || this.default.min,
      canvas: config.canvas,
    })

    this.field.subscribe('remove', (count) => this.onRemove(count))

    // заполнить пустое поле случайными тайлами
    this.field.start()
  }

  onRemove(count: number) {
    this.steps--

    this.points += this.countPoints(count)
    this.progress =
      this.points >= this.roundPoints
        ? 100
        : (this.points / this.roundPoints) * 100

    if (this.points >= this.roundPoints) this.finish()

    if (this.steps <= 0) this.finish()
  }

  countPoints(count: number) {
    let base = count * 10 // за каждый удаленный тайл 10 очков
    if (count >= 5 && count % 2) {
      // за 5, 7, 9, 11 и далее тайлов
      base += (Math.floor(count / 2) - 1) * 10
    }
    return base
  }

  finish() {
    this.stopped = true
    this.field.stop()
    let phrase = this.points >= this.roundPoints ? 'success' : 'fail'
    alert('finish - ' + phrase)
  }
}
