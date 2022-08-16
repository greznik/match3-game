import { Game } from './game'

import '../styles/styles.scss'

let canvas = document.getElementById('game-field') as HTMLCanvasElement
new Game({
  canvas: canvas,
})
