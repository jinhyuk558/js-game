const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

// background
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png',
  framesMax: 1,
  scale: 2,
  offset: {
    x: 0,
    y: 0
  }
})


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
      type: 'idle'
    },
    idleLeft: {
      imageSrc: './img/chainBot/idleLeft.png',
      framesMax: 5,
      type: 'idle'
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
  },
  characterDim: {
    x: 70,
    y: 65
  },
  symmetricalSprite: true
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
      type: 'idle'
    },
    idleLeft: {
      imageSrc: './img/shockSweeper/idleLeft.png',
      framesMax: 1,
      type: 'idle'
    },
    run: {
      imageSrc: './img/shockSweeper/shuffe(move).png',
      framesMax: 8,
      type: 'move'
    },
    runLeft: {
      imageSrc: './img/shockSweeper/shuffleLeft.png',
      framesMax: 8,
      type: 'move'
    },
    attack1: {
      imageSrc: './img/shockSweeper/slam with VFX.png',
      framesMax: 10,
      type: 'attack'
    },
    attackLeft1: {
      imageSrc: './img/shockSweeper/slamLeft.png',
      framesMax: 10,
      type: 'attack'
    },
    attack2: {
      imageSrc: './img/shockSweeper/Spin Slam with VFX.png',
      framesMax: 9,
      type: 'attack'
    },
    attackLeft2: {
      imageSrc: './img/shockSweeper/spinSlamLeft.png',
      framesMax: 9,
      type: 'attack',
      offset: {
        x: 100,
        y: 0
      }
    },
    attack3: {
      imageSrc: './img/shockSweeper/Sweep with VFX.png',
      framesMax: 8,
      // handles when player sprite moves during attack animation
      animOffset: {
        frame: 3,
        x: -120,
        y: 0
      },
      type: 'attack'
    },
    attackLeft3: {
      imageSrc: './img/shockSweeper/sweepLeft.png',
      framesMax: 8,
      // handles when player sprite moves during attack animation
      animOffset: {
        frame: 3,
        x: 120,
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
    jumpLeft: {
      imageSrc: './img/shockSweeper/jumpLeft.png',
      framesMax: 3,
      isHorizontal: true,
      type: 'jumpOrFall'
    },
    fall: {
      imageSrc: './img/shockSweeper/fall.png',
      framesMax: 3,
      isHorizontal: true,
      type: 'jumpOrFall'
    },
    fallLeft: {
      imageSrc: './img/shockSweeper/fallLeft.png',
      framesMax: 3,
      isHorizontal: true,
      type: 'jumpOrFall'
    },
    // charge: {
    //   imageSrc: './img/chainBot/charge.png',
    //   framesMax: 
    // }
  },
  characterDim: {
    x: 50,
    y: 65
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

  // player movement
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -3
    
    player.switchSprite('runLeft')
    // player.direction = 'left'
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 3
    
    player.switchSprite('run')
    // player.direction = 'right'
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
    if (player.direction === 'right') {
      player.switchSprite('jump')
    } else {
      player.switchSprite('jumpLeft')
    }
  } else if (player.velocity.y > 0) {
    if (player.direction === 'right') {
      player.switchSprite('fall')
    } else {
      player.switchSprite('fallLeft')
    }
  }

  // player attack
  if (keys.q.pressed) {
    if (player.direction === 'right') {
      player.switchSprite('attack1')
    } else {
      player.switchSprite('attackLeft1')
    }
  } else if (keys.e.pressed) {
    if (player.direction === 'right') {
      player.switchSprite('attack2')
    } else {
      player.switchSprite('attackLeft2')
    }
  } else if (keys.r.pressed) {
    if (player.direction === 'right') {
      player.switchSprite('attack3')
    } else {
      player.switchSprite('attackLeft3')
    }
  }




  background.update()

  // draw ground 
  c.fillStyle = 'black'
  c.fillRect(0, canvas.height - 30, canvas.width, canvas.height)
  
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
      if (player.sprites.jump) {
        player.velocity.y = -25
      }
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