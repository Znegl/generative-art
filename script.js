const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const optimalBlockSize = 100
let blockCountHorizontal = Math.floor(window.innerWidth / optimalBlockSize);
let blockCountVertical = Math.floor(window.innerHeight / optimalBlockSize);
let blockWidth = canvas.width / blockCountHorizontal
let blockHeight = canvas.height / blockCountVertical

const colors = []

const drawMethods = [
  drawSquare,
  drawLine,
  //drawFace,
  drawCircle,
  //drawHalfCircle,
  drawSquareFace,
  drawGhost,
  drawSquiggle
]

function updateCanvasSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  blockCountHorizontal = Math.floor(window.innerWidth / optimalBlockSize);
  blockCountVertical = Math.floor(window.innerHeight / optimalBlockSize);
  blockWidth = canvas.width / blockCountHorizontal
  blockHeight = canvas.height / blockCountVertical
}

function generateColors() {
  for (let i = 0; i < 5; i++) {
    colors.push(createRandomColor())
  }
}

function redraw() {
  updateCanvasSize()
  generateColors()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  draw()
}

function draw() {
  for (let y = 0; y < blockCountVertical; y++) {
    ctx.lineWidth = 0

    for (let x = 0; x < blockCountHorizontal; x++) {
      if (Math.random() > .5) {
        ctx.fillStyle = getRandomColor(.1)

        drawSquare(
          x,
          y,
          blockWidth * Math.random() * 2,
          true
        )
      }
    }

    for (let x = 0; x < blockCountHorizontal; x++) {
      const r = Math.min(blockWidth, blockHeight) / 2 * (Math.random() * .7 + .1)

      ctx.fillStyle = getRandomColor()
      ctx.lineWidth = 0

      drawMethods[Math.floor(Math.random() * drawMethods.length)](x, y, r)
    }
  }
}


function drawCircle(x, y, r) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)
  ctx.beginPath()
  ctx.ellipse(
    cx,
    cy,
    r,
    r,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()
}

function drawHalfCircle(x, y, s) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)
  const {x: x1, y: y1} = getPxCoordinate(x, y)

  let p1, p2, p3, p4, p5, p6

  const r = Math.min(blockWidth, blockHeight) / 2

  if (Math.random() > .5) {
    p1 = [x1, y1]
    p2 = [x1 + blockWidth / 2, y1]
    p3 = [x1 + blockWidth, y1]
    p4 = [x1 + blockWidth, y1 + blockHeight]
    p5 = [x1 + blockWidth / 2, y1 + blockHeight]
    p6 = [x1, y1 + blockHeight]
  } else {
    p1 = [x1 + blockWidth, y1]
    p2 = [x1 + blockWidth, y1 + blockHeight / 2]
    p3 = [x1 + blockWidth, y1 + blockHeight]
    p4 = [x1, y1 + blockHeight]
    p5 = [x1, y1 + blockHeight / 2]
    p6 = [x1, y1]
  }

  if (Math.random() > .5) {
    ctx.translate(cx, cy)
    ctx.rotate(Math.PI)
    ctx.translate(-cx, -cy)
  }

  ctx.beginPath()
  ctx.moveTo(...p1)
  ctx.lineTo(...p2)
  ctx.arcTo(...p3, ...p4, r)
  ctx.arcTo(...p4, ...p5, r)
  ctx.lineTo(...p5)
  ctx.lineTo(...p6)
  ctx.fill()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawLine(x, y, r) {
  const {x: x1, y: y1} = getPxCoordinate(x, y)
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)

  ctx.beginPath()
  ctx.translate(cx, cy)
  ctx.rotate((Math.random() * 180) * Math.PI / 180)
  ctx.translate(-cx, -cy)
  ctx.rect(
    x1,
    y1,
    r * 2,
    5,
  )
  ctx.fill()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawSquare(x, y, r, glitchy = false) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)

  let x1, y1
  let rotation = 45

  if (glitchy) {
    const coords = getPxCoordinate(x, y)

    x1 = coords.x
    y1 = coords.y

    rotation = Math.random() > .5 ? 45 : 0
  } else {
    x1 = cx - r / 2
    y1 = cy - r / 2
  }

  ctx.beginPath()
  ctx.translate(cx, cy)
  ctx.rotate(rotation * Math.PI / 180)
  if (!glitchy) {
    ctx.translate(-cx, -cy)
  }
  ctx.rect(
    x1,
    y1,
    r,
    r,
  )
  ctx.fill()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawFace(x, y, r) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)
  const eyeRadiusLeft = r * (Math.random() * .15 + .05)
  const eyeRadiusRight = r * (Math.random() * .15 + .05)
  const eyeOffsetX = r * .3
  const eyeOffsetY = r * .25

  ctx.translate(cx, cy)
  ctx.rotate((Math.random() * 90 - 45) * Math.PI / 180)
  ctx.translate(-cx, -cy)

  // Head
  ctx.beginPath()
  ctx.ellipse(
    cx,
    cy,
    r,
    r,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  ctx.fillStyle = 'black'

  // Left eye
  ctx.beginPath()
  ctx.ellipse(
    cx - eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusLeft,
    eyeRadiusLeft,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.ellipse(
    cx + eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusRight,
    eyeRadiusRight,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Mouth
  ctx.fillStyle = 'transparent'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  const mouthStartAngle = Math.random() * Math.PI * .5
  const mouthEndAngle = Math.min(mouthStartAngle + Math.random() * Math.PI * .7, Math.PI)

  ctx.beginPath()
  ctx.ellipse(
    cx,
    cy,
    r * .8,
    r * .8,
    0,
    mouthStartAngle,
    mouthEndAngle
  )
  ctx.stroke()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawSquareFace(x, y, r) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)
  const {x: x1, y: y1} = getPxCoordinate(x, y)
  const eyeRadiusLeft = r * (Math.random() * .15 + .05)
  const eyeRadiusRight = r * (Math.random() * .15 + .05)
  const eyeOffsetX = r * .3
  const eyeOffsetY = r * .25

  ctx.translate(cx, cy)
  ctx.rotate((Math.random() * 90 - 45) * Math.PI / 180)
  ctx.translate(-cx, -cy)

  // Head
  const p1 = [x1 + blockWidth, y1]
  const p2 = [x1 + blockWidth, y1 + blockHeight / 2]
  const p3 = [x1 + blockWidth, y1 + blockHeight]
  const p4 = [x1, y1 + blockHeight]
  const p5 = [x1, y1 + blockHeight / 2]
  const p6 = [x1, y1]

  ctx.beginPath()
  ctx.moveTo(...p1)
  ctx.lineTo(...p2)
  ctx.arcTo(...p3, ...p4, r)
  ctx.arcTo(...p4, ...p5, r)
  ctx.lineTo(...p5)
  ctx.lineTo(...p6)
  ctx.fill()

  ctx.fillStyle = 'black'

  // Left eye
  ctx.beginPath()
  ctx.ellipse(
    cx - eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusLeft,
    eyeRadiusLeft,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.ellipse(
    cx + eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusRight,
    eyeRadiusRight,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Mouth
  ctx.fillStyle = 'transparent'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  const mouthStartAngle = Math.random() * Math.PI * .5
  const mouthEndAngle = Math.min(mouthStartAngle + Math.random() * Math.PI * .7, Math.PI)

  ctx.beginPath()
  ctx.ellipse(
    cx,
    cy,
    r * .8,
    r * .8,
    0,
    mouthStartAngle,
    mouthEndAngle
  )
  ctx.stroke()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawGhost(x, y, r) {
  const {x: cx, y: cy} = getPxCoordinateCenter(x, y)
  const {x: x1, y: y1} = getPxCoordinate(x, y)
  const eyeRadiusLeft = r * (Math.random() * .15 + .05)
  const eyeRadiusRight = r * (Math.random() * .15 + .05)
  const eyeOffsetX = r * .3
  const eyeOffsetY = r * .25

  ctx.translate(cx, cy)
  ctx.rotate((Math.random() * 90 - 45) * Math.PI / 180)
  ctx.translate(-cx, -cy)

  // Head
  const p1 = [x1, y1 + blockHeight]
  const p2 = [x1, y1 + blockHeight / 2]
  const p3 = [x1, y1]
  const p4 = [x1 + blockWidth, y1]
  const p5 = [x1 + blockWidth, y1 + blockHeight / 2]
  const p6 = [x1 + blockWidth, y1 + blockHeight]

  ctx.beginPath()
  ctx.moveTo(...p1)
  ctx.lineTo(...p2)
  ctx.arcTo(...p3, ...p4, r)
  ctx.arcTo(...p4, ...p5, r)
  ctx.lineTo(...p5)

  drawSquiggleInternal(p6[0], p1[0], p6[1], 5, r)

  ctx.fill()

  ctx.fillStyle = 'black'

  // Left eye
  ctx.beginPath()
  ctx.ellipse(
    cx - eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusLeft,
    eyeRadiusLeft,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Right eye
  ctx.beginPath()
  ctx.ellipse(
    cx + eyeOffsetX,
    cy - eyeOffsetY,
    eyeRadiusRight,
    eyeRadiusRight,
    0,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Mouth
  ctx.fillStyle = 'transparent'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  const mouthStartAngle = Math.random() * Math.PI * .5
  const mouthEndAngle = Math.min(mouthStartAngle + Math.random() * Math.PI * .7, Math.PI)

  ctx.beginPath()
  ctx.ellipse(
    cx,
    cy,
    r * .8,
    r * .8,
    0,
    mouthStartAngle,
    mouthEndAngle
  )
  ctx.stroke()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawSquiggle(x, y, r) {
  const {x: x1, y: y1} = getPxCoordinate(x, y)

  ctx.strokeStyle = ctx.fillStyle
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  ctx.beginPath()

  drawSquiggleInternal(x1, x1 + blockWidth, y1 + blockHeight / 4 + (blockHeight / 2 * Math.random()) , 5, r * .2)

  ctx.stroke()
}

function drawSquiggleInternal(x1, x2, y, stepCount = 5, squiggleSize = 10) {
  const stepSize = (x2 - x1) / stepCount
  const partSize = stepSize / 4

  squiggleSize = Math.abs(Math.min(squiggleSize, partSize))

  for (let i = 0; i < stepCount; i++) {
    const startPoint = {x: x1 + i * stepSize, y: y}

    ctx.lineTo(
      startPoint.x,
      startPoint.y
    )
    ctx.arcTo(
      startPoint.x + partSize, startPoint.y + squiggleSize,
      startPoint.x + partSize * 2, startPoint.y,
      squiggleSize
    )
    ctx.arcTo(
      startPoint.x + partSize * 3, startPoint.y - squiggleSize,
      startPoint.x + partSize * 4, startPoint.y,
      squiggleSize
    )
  }
}

function getPxCoordinate(x, y) {
  return {
    x: x * blockWidth,
    y: y * blockHeight
  }
}

function getPxCoordinateCenter(x, y) {
  const {x: x1, y: y1} = getPxCoordinate(x, y)
  return {
    x: x1 + blockWidth / 2,
    y: y1 + blockHeight / 2
  }
}

function createRandomColor() {
  return `${Math.floor(Math.random() * 160) + 120} ${Math.floor(Math.random() * 50) + 20}% ${Math.floor(Math.random() * 50) + 20}%`
  //return `${Math.floor(Math.random() * 360) } ${Math.floor(Math.random() * 50) + 20}% ${Math.floor(Math.random() * 50) + 20}%`
}

function getRandomColor(alpha = 1) {
  return `hsl(${colors[Math.floor(Math.random() * colors.length)]} / ${alpha})`
}

updateCanvasSize()
generateColors()
draw()

canvas.addEventListener('click', () => redraw())