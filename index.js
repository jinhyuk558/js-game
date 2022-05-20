const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)


// player
const player2 = new Character({
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
      framesMax: 5,
      type: 'move'
    },
    idleLeft: {
      imageSrc: './img/chainBot/idleLeft.png',
      framesMax: 5,
      type: 'move'
    },
    run: {
      imageSrc: './img/chainBot/run.png',
      framesMax: 8,
      type: 'move'
    },
    runLeft: {
      imageSrc: './img/chainBot/runLeft.png',
      framesMax: 8,
      type: 'move'
    },
    attack1: {
      imageSrc: './img/chainBot/attack.png',
      framesMax: 8,
      type: 'attack'
    },
    attackLeft1: {
      imageSrc: './img/chainBot/attackLeft.png',
      framesMax: 8,
      type: 'attack'
    },
    // charge: {
    //   imageSrc: './img/chainBot/charge.png',
    //   framesMax: 
    // }
  }
})

const player = new Character({
  position: {
    x: 600,
    y: 300
  },
  imageSrc: './img/shockSweeper/static idle.png',
  framesMax: 1,
  scale: 4,
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -80,
    y: -50
  },
  sprites: {
    idle: {
      imageSrc: './img/shockSweeper/static idle.png',
      framesMax: 1,
      type: 'move'
    },
    idleLeft: {
      imageSrc: './img/shockSweeper/static idle.png',
      framesMax: 1,
      type: 'move'
    },
    run: {
      imageSrc: './img/shockSweeper/shuffe(move).png',
      framesMax: 8,
      type: 'move'
    },
    runLeft: {
      imageSrc: './img/shockSweeper/shuffe(move).png',
      framesMax: 8,
      type: 'move'
    },
    attack1: {
      imageSrc: './img/shockSweeper/slam with VFX.png',
      framesMax: 10,
      type: 'attack'
    },
    attackLeft1: {
      imageSrc: './img/chainBot/attackLeft.png',
      framesMax: 8,
      type: 'attack'
    },
    attack2: {
      imageSrc: './img/shockSweeper/Spin Slam with VFX.png',
      framesMax: 9,
      type: 'attack'
    },
    attack3: {
      imageSrc: './img/shockSweeper/Sweep with VFX.png',
      framesMax: 8,
      // handles when player sprite moves during attack animation
      animOffset: {
        frame: 3,
        x: -150,
        y: 0
      },
      type: 'attack'
    },
    jump: {
      imageSrc: './img/shockSweeper/jump.png',
      framesMax: 3,
      isHorizontal: true,
      type: 'jumpOrFall'
    },
    fall: {
      imageSrc: './img/shockSweeper/fall.png',
      framesMax: 3,
      isHorizontal: true,
      type: 'jumpOrFall'
    }
    // charge: {
    //   imageSrc: './img/chainBot/charge.png',
    //   framesMax: 
    // }
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false 
  },
  w: {
    pressed: false
  },
  q: {
    pressed: false
  },
  e: {
    pressed: false
  },
  r: {
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
    player.switchSprite('run')
  } else {
    player.velocity.x = 0
    if (player.direction === 'right') {
      player.switchSprite('idle')
    } else {
      player.switchSprite('idleLeft')
    }
  }

  // player jump
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
    
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // player attack
  if (keys.q.pressed) {
    if (player.direction === 'right') {
      player.switchSprite('attack1')
    } else {
      player.switchSprite('attackLeft1')
    }
  } else if (keys.e.pressed) {
    player.switchSprite('attack2')
  } else if (keys.r.pressed) {
    player.switchSprite('attack3')
  }





  player.update()
  player2.update()
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
    case 'w':
      player.velocity.y = -20
      break
    case 'q': 
      keys.q.pressed = true 
      lastKey = 'q'
      break
    case 'e':
      keys.e.pressed = true 
      lastKey = 'e'
      break
    case 'r':
      keys.r.pressed = true 
      lastKey = 'r'
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
    case 'w':
      keys.w.pressed = false 
      break
    case 'q': 
      keys.q.pressed = false 
      break
    case 'e':
      keys.e.pressed = false
      break
    case 'r':
      keys.r.pressed = false
      break
  }
})