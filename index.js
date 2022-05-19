const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)


// player
const player = new Character({
  position: {
    x: 300,
    y: 300
  },
  imageSrc: './img/chainBot/idle.png',
  framesMax: 5,
  scale: 3,
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -160,
    y: -25
  },
  sprites: {
    idle: {
      imageSrc: './img/chainBot/idle.png',
      framesMax: 5
    },
    idleLeft: {
      imageSrc: './img/chainBot/idleLeft.png',
      framesMax: 5
    },
    runRight: {
      imageSrc: './img/chainBot/run.png',
      framesMax: 8
    },
    runLeft: {
      imageSrc: './img/chainBot/runLeft.png',
      framesMax: 8
    },
    attack: {
      imageSrc: './img/chainBot/attack.png',
      framesMax: 8
    },
    attackLeft: {
      imageSrc: './img/chainBot/attackLeft.png',
      framesMax: 8
    }
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false 
  },
  q: {
    pressed: false
  },
  e: {
    pressed: false
  }
}

let lastKey


function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // draw ground 
  c.fillStyle = '#6b7280'
  c.fillRect(0, canvas.height - 50, canvas.width, canvas.height)

  // player movement
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -4
    player.direction = 'left'
    player.switchSprite('runLeft')
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 4
    player.direction = 'right'
    player.switchSprite('runRight')
  } else {
    player.velocity.x = 0
    if (player.direction === 'right') {
      player.switchSprite('idle')
    } else {
      player.switchSprite('idleLeft')
    }
    
  }

  // player attack
  if (keys.e.pressed) {
    if (player.direction === 'right') {
      player.switchSprite('attack')
    } else {
      player.switchSprite('attackLeft')
    }
  }


  player.update()
}

animate()



window.addEventListener('keydown', ({ key }) => {
  switch(key) {
    case 'a':
      keys.a.pressed = true 
      lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true 
      lastKey = 'd'
      break
    case 'q': 
      keys.q.pressed = true 
      lastKey = 'q'
      break
    case 'e':
      keys.e.pressed = true 
      lastKey = 'e'
      break
  }
})

window.addEventListener('keyup', ({ key }) => {
  switch(key) {
    case 'a':
      keys.a.pressed = false 
      break
    case 'd':
      keys.d.pressed = false 
      break
    case 'q': 
      keys.q.pressed = false 
      break
    case 'e':
      keys.e.pressed = false
      break
  }
})