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
      type: 'attack',
      attackBox: {
        offset: {
          x: 0,
          y: 20
        },
        width: 110,
        height: 40,
        attackFrames: {
          "0": true,
          "4": true
        }
      }
    },
    attackLeft1: {
      imageSrc: './img/chainBot/attackLeft.png',
      framesMax: 8,
      type: 'attack',
      attackBox: {
        offset: {
          x: 0,
          y: 20
        },
        width: 110,
        height: 40,
        attackFrames: {
          "0": true,
          "4": true
        }
      }
    },
    takeHit: {
      imageSrc: './img/chainBot/hit.png',
      framesMax: 2,
      type: 'takeHit',
    },
    takeHitLeft: {
      imageSrc: './img/chainBot/hitLeft.png',
      framesMax: 2,
      type: 'takeHit',
    },
    death: {
      imageSrc: './img/chainBot/death.png',
      framesMax: 5,
      type: 'death',
      deathHeight: 25
    }
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


const player2 = new Character({
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
      type: 'attack',
      attackBox: {
        offset: {
          x: 0,
          y: 0
        },
        width: 110,
        height: 70,
        attackFrames: {
          "5": true
        },
      }
    },
    attackLeft1: {
      imageSrc: './img/shockSweeper/slamLeft.png',
      framesMax: 10,
      type: 'attack',
      attackBox: {
        offset: {
          x: 0,
          y: 0
        },
        width: 110,
        height: 70,
        attackFrames: {
          "5": true
        },
      }
    },
    attack2: {
      imageSrc: './img/shockSweeper/Spin Slam with VFX.png',
      framesMax: 9,
      type: 'attack',
      attackBox: {
        offset: {
          x: -65,
          y: 0
        },
        width: 125,
        height: 65,
        attackFrames: {
          "5": true
        },
      }
    },
    attackLeft2: {
      imageSrc: './img/shockSweeper/spinSlamLeft.png',
      framesMax: 9,
      type: 'attack',
      offset: {
        x: 100,
        y: 0
      },
      attackBox: {
        offset: {
          x: -65,
          y: 0
        },
        width: 125,
        height: 65,
        attackFrames: {
          "5": true
        },
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
      type: 'attack',
      attackBox: {
        offset: {
          x: -125,
          y: 0
        },
        width: 220,
        height: 65,
        attackFrames: {
          "4": true
        },
      }
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
      type: 'attack',
      attackBox: {
        offset: {
          x: -125,
          y: 0
        },
        width: 220,
        height: 65,
        attackFrames: {
          "4": true
        },
      }
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
    death: {
      imageSrc: './img/shockSweeper/death.png',
      framesMax: 5,
      type: 'death',
      deathHeight: 10
    },
    takeHit: {
      imageSrc: './img/shockSweeper/hit.png',
      framesMax: 2,
      type: 'takeHit'
    },
    takeHitLeft: {
      imageSrc: './img/shockSweeper/hitLeft.png',
      framesMax: 2,
      type: 'takeHit'
    } 
    // charge: {
    //   imageSrc: './img/chainBot/charge.png',
    //   framesMax: 
    // }
  },
  characterDim: {
    x: 50,
    y: 60
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
  },

  "1": {
    pressed: false
  },
  "3": {
    pressed: false 
  },
  "5": {
    pressed: false
  },
  "4": {
    pressed: false
  },
  "6": {
    pressed: false
  },
  "2": {
    pressed: false
  }


}

let lastKey
let lastKeyEnemy


function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  if (!player.isDead) {
    // player movement
    if (keys.a.pressed && lastKey === 'a') {
      if (!player.wouldCollideWithEnemy(player2, 'left')) {
        player.velocity.x = -3
        player.switchSprite('runLeft')
      } else {
        player.velocity.x = 0
      }
      // player.direction = 'left'
    } else if (keys.d.pressed && lastKey === 'd') {
      if (!player.wouldCollideWithEnemy(player2, 'right')) {
        player.velocity.x = 3
        player.switchSprite('run') 
      } else {
        player.velocity.x = 0
      }
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

    if (player.wouldCollideEnemyVertically(player2)) {
      player.vertCollision = true
    } else {
      player.vertCollision = false
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

  }


  if (!player2.isDead) {
    // player2 movement
    if (keys["1"].pressed && lastKeyEnemy === "1") {
      if (!player2.wouldCollideWithEnemy(player, 'left')) {
        player2.velocity.x = -3
        player2.switchSprite('runLeft')
      } else {
        player2.velocity.x = 0
      }
      // player2.direction = 'left'
    } else if (keys["3"].pressed && lastKeyEnemy === "3") {
      if (!player2.wouldCollideWithEnemy(player, 'right')) {
        player2.velocity.x = 3
        player2.switchSprite('run') 
      } else {
        player2.velocity.x = 0
      }
      // player2.direction = 'right'
    } else {
      player2.velocity.x = 0
      if (player2.direction === 'right') {
        player2.switchSprite('idle')
      } else {
        player2.switchSprite('idleLeft')
      }
    }

    // player2 jump
    if (player2.velocity.y < 0) {
      if (player2.direction === 'right') {
        player2.switchSprite('jump')
      } else {
        player2.switchSprite('jumpLeft')
      }
    } else if (player2.velocity.y > 0) {
      if (player2.direction === 'right') {
        player2.switchSprite('fall')
      } else {
        player2.switchSprite('fallLeft')
      }
    }

    if (player2.wouldCollideEnemyVertically(player)) {
      player2.vertCollision = true
    } else {
      player2.vertCollision = false
    }

    // player2 attack
    if (keys["2"].pressed) {
      if (player2.direction === 'right') {
        player2.switchSprite('attack1')
      } else {
        player2.switchSprite('attackLeft1')
      }
    } else if (keys["4"].pressed) {
      if (player2.direction === 'right') {
        player2.switchSprite('attack2')
      } else {
        player2.switchSprite('attackLeft2')
      }
    } else if (keys["6"].pressed) {
      if (player2.direction === 'right') {
        player2.switchSprite('attack3')
      } else {
        player2.switchSprite('attackLeft3')
      }
    }

  }











  
  player.checkAttack(player2)
  player2.checkAttack(player)



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
      if (player.sprites.jump && !player.isDead) {
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

  switch(key) {
    case '1':
      keys["1"].pressed = true 
      lastKeyEnemy = '1'
      break
    case '3':
      keys["3"].pressed = true 
      lastKeyEnemy = '3'
      break
    case '5':
      if (player2.sprites.jump && !player2.isDead) {
        player2.velocity.y = -25
      }
      break
    case '4': 
      keys["4"].pressed = true 
      lastKeyEnemy = '4'
      break
    case '6':
      keys["6"].pressed = true 
      lastKeyEnemy = '6'
      break
    case '2':
      keys["2"].pressed = true 
      lastKeyEnemy = '2'
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
  switch(key) {
    case '1':
      keys["1"].pressed = false 
      break
    case '3':
      keys["3"].pressed = false 
      break
    case '4': 
      keys["4"].pressed = false
      break
    case '6':
      keys["6"].pressed = false
      break
    case '2':
      keys["2"].pressed = false
      break
  }
})