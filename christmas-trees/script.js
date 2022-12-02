const body = document.body;
const demoThingyList = document.createElement('ul')

demoThingyList.className = 'demo-thingy-list'

body.append(demoThingyList)

let numberOfVariants = 15;

const demoThingies = []

const reindeerNames = ['Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Dunder', 'Blitzen']

function getRandomReindeerName() {
  return reindeerNames[Math.floor(Math.random() * reindeerNames.length)]
}

function getReindeerName(index) {
  return reindeerNames[index % reindeerNames.length]
}

class DemoThingy {
  name_;
  listItem;
  inputField;
  canvas;
  ctx;

  random;

  constructor(name = '') {
    this.name = name.trim() || getRandomReindeerName()
  }

  set name(name) {
    this.random = new Math.seedrandom(name)
    this.name_ = name
    this.draw()
  }

  get name() {
    return this.name_
  }

  get treeWidth() {
    return this.canvas.width / this.randomBetween(3, 5);
  }

  get stubWidth() {
    return this.canvas.width / this.randomBetween(8, 15);
  }

  get treeColor() {
    const hue = this.randomBetween(115, 145, 0)
    const saturation = this.randomBetween(20, 70, 0)
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)

    gradient.addColorStop(0, `hsl(${hue} ${saturation}% ${this.randomBetween(20, 60, 0)}%)`)
    gradient.addColorStop(1, `hsl(${hue} ${saturation}% ${this.randomBetween(20, 30, 0)}%)`)

    return gradient
  }

  get backgroundColor() {
    return `${this.randomBetween(200, 360, 0)} ${this.randomBetween(20, 70, 0)}% ${this.randomBetween(40, 60, 0)}%`
  }


  randomBetween(min, max, decimals = 10) {
    const decimalFactor = Math.pow(10, decimals)
    const diff = max - min
    const rand = (this.random() * diff + min)
    return Math.floor(rand * decimalFactor) / decimalFactor
  }

  draw() {
    this.createCanvas()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.random = new Math.seedrandom(this.name)

    this.canvas.style = '--background-color: ' + this.backgroundColor

    const centerX = this.canvas.width / 2

    const treeHeight = this.canvas.height * this.randomBetween(.5, .9)
    const stubHeight = this.canvas.height - treeHeight
    const treeWidthLeft = this.treeWidth
    const treeWidthRight = this.treeWidth

    // Draw green part
    this.ctx.fillStyle = this.treeColor
    this.ctx.beginPath()
    this.ctx.moveTo(centerX, 0)
    this.ctx.lineTo(centerX + treeWidthRight, treeHeight)
    this.ctx.lineTo(centerX - treeWidthLeft, treeHeight)
    this.ctx.lineTo(centerX, 0)
    this.ctx.fill()

    // Draw stub
    this.ctx.fillStyle = 'saddlebrown'
    this.ctx.beginPath()
    this.ctx.moveTo(centerX + this.stubWidth, treeHeight)
    this.ctx.lineTo(centerX + this.stubWidth, treeHeight + stubHeight)
    this.ctx.lineTo(centerX - this.stubWidth, treeHeight + stubHeight)
    this.ctx.lineTo(centerX - this.stubWidth, treeHeight)
    this.ctx.fill()

    // Draw eyes
    const pupilOffsetX = this.randomBetween(-1, 1);
    const pupilOffsetY = this.randomBetween(-1, 1);

    // Left eye
    this.drawEye(centerX - treeWidthLeft / 2.5, treeHeight / 2.5, this.randomBetween(5, 10), pupilOffsetX, pupilOffsetY)

    // Right eye
    this.drawEye(centerX + treeWidthLeft / 2.5, treeHeight / 2.5, this.randomBetween(5, 10), pupilOffsetX, pupilOffsetY)

    this.drawNose(centerX, treeHeight / 1.75, this.randomBetween(4, 15))

    this.drawMouth(centerX, treeHeight * .55, this.randomBetween(30, 50))
  }

  drawEye(x, y, r, pupilOffsetX = 0, pupilOffsetY = 0) {
    const yOffset = 10 - r / 1.5

    const gradient = this.ctx.createRadialGradient(x, y, r, x * 1.1, y * .8, r / 5)

    gradient.addColorStop(0, `hsl(0 0% 75%)`)
    gradient.addColorStop(1, `hsl(0 0% 100%)`)

    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.ellipse(x, y + yOffset, r, r, 0, 0, Math.PI * 2)
    this.ctx.fill()

    const pupilSize = r / 3;
    this.ctx.fillStyle = 'black'
    this.ctx.beginPath()
    this.ctx.ellipse(x + pupilOffsetX * pupilSize, y + yOffset + pupilOffsetY * pupilSize, pupilSize, pupilSize, 0, 0, Math.PI * 2)
    this.ctx.fill()
  }

  drawNose(x, y, r) {
    const hue = this.randomBetween(0, 360, 0)
    const saturation = this.randomBetween(20, 70, 0)
    const gradient = this.ctx.createRadialGradient(x, y, r, x * 1.1, y * .8, r / 5)

    gradient.addColorStop(0, `hsl(${hue} ${saturation}% ${this.randomBetween(20, 30, 0)}%)`)
    gradient.addColorStop(1, `hsl(${hue} ${saturation}% ${this.randomBetween(50, 70, 0)}%)`)

    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2)
    this.ctx.fill()
  }


  drawMouth(x, y, r) {
    this.ctx.fillStyle = 'transparent'
    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 2
    this.ctx.lineCap = 'round'

    const mouthStartAngle = this.randomBetween(0, Math.PI /2)
    const mouthEndAngle = this.randomBetween(mouthStartAngle, Math.PI)

    this.ctx.beginPath()
    this.ctx.ellipse(
      x,
      y ,
      r * .8,
      r * .8,
      0,
      mouthStartAngle,
      mouthEndAngle
    )
    this.ctx.stroke()
  }

  createCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = 160
      this.canvas.height = 125

      this.ctx = this.canvas.getContext('2d')
    }
  }

  render(container) {
    if (!this.listItem) {
      this.listItem = document.createElement('li')
      this.listItem.className = 'demo-thingy'

      this.inputField = document.createElement('input')
      this.inputField.type = 'text'
      this.inputField.value = this.name
      this.inputField.addEventListener('input', event => this.name = event.target.value.trim())

      this.listItem.append(this.inputField)

      this.draw()

      this.listItem.append(this.canvas)
    }

    if (container) {
      container.append(this.listItem)
    }

    return this.listItem
  }

}

while (numberOfVariants--) {
  const demoThingy = new DemoThingy(getReindeerName(numberOfVariants))
  demoThingies.push(demoThingy)
  demoThingy.render(demoThingyList)
}
