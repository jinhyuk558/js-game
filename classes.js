class Sprite {
  constructor({ position, imageSrc, framesMax, scale = 1, offset }) {
    this.position = position
    this.imageSrc = imageSrc
    this.scale = scale
    this.offset = offset
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesHold = 5
    this.framesElapsed = 0
    this.isHorizontal = false

    this.image = new Image()
    this.image.src = this.imageSrc
  }
  draw() {
    c.drawImage(
      this.image,
      this.isHorizontal ? this.framesCurrent * this.image.width / this.framesMax : 0,
      // temporarily add "+2" for a hacky way to remove the slightly visible top pixels
      this.isHorizontal ? 0 : this.framesCurrent * this.image.height / this.framesMax + 2, 
      this.isHorizontal ? this.image.width / this.framesMax : this.image.width,
      this.isHorizontal ? this.image.height : this.image.height / this.framesMax,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      this.isHorizontal ? this.image.width / this.framesMax * this.scale : this.image.width * this.scale,
      this.isHorizontal ? this.image.height * this.scale : this.image.height / this.framesMax * this.scale
    )
  }
  animateFrames() {
    this.animFinishedLastFrame = false
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      this.framesElapsed = 0
      if (this.framesCurrent === this.framesMax - 1) {
        this.framesCurrent = 0
        this.animFinishedLastFrame = true
      } else {
        this.framesCurrent++
      }
    }
  }
  update() {
    this.draw()
    this.animateFrames()
  }
}


class Character extends Sprite {
  constructor({ 
    position, 
    imageSrc, 
    framesMax, 
    scale = 1, 
    offset, 
    velocity, 
    sprites, 
    characterDim,
    symmetricalSprite=false,
    speed = 3
  }) {
    
    // position is top left. aligns with character sprite
    super({ position, imageSrc, framesMax, scale, offset })
    this.velocity = velocity 
    this.gravity = 1.5
    this.sprites = sprites
    this.symmetricalSprite = symmetricalSprite

    // used to track what animation to play / override
    this.currentSprite = 'idle'
    this.currentAnimType = 'idle'

    // direction character is facing
    this.direction = 'right'

    // rectangle dimensions for collision detection
    this.width = characterDim.x
    this.height = characterDim.y

    // controls how close two characters can be before
    // being blocked. spans 20 pixels from the center of
    // player
    this.physicsBoxWidth = 20

    // only used to check if player collides with another character. nothing else
    this.vertCollision = false

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image()
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
    }

    // max health 100 for 
    this.health = 90
    this.isDead = false

    this.speed = speed
    this.attackDmg = 0
  }

  switchSprite(sprite) {


    if (this.currentAnimType === 'death') return

    // if animation doesn't exist for this character, return
    if (!this.sprites[sprite]) return

   
    // prevents jumpOrFall animation from being cancelled
    // regarding the third conditional, this is a "hacky" way to tell that
    // we're still running the jumpOrFall animation.
    if (this.currentAnimType === 'jumpOrFall' &&
      this.framesCurrent < this.sprites[this.currentSprite].framesMax && (this.framesCurrent === 0 ? (this.framesElapsed !== 0): true)) {
        return
    }

    // attack moves / animation is only cancellabe by moving left or right
    // abilities cannot be canclled by another ability
    if (this.currentAnimType === 'attack' && this.sprites[sprite].type !== 'move' &&
      this.framesCurrent < this.sprites[this.currentSprite].framesMax && (this.framesCurrent === 0 ? (this.framesElapsed !== 0): true)) {
        return
    }

    // when taking a hit will override idle and movement animations. cannot override
    // attack animations, however
    if (this.currentAnimType === 'takeHit' && this.sprites[sprite].type !== 'attack'&&
    this.framesCurrent < this.sprites[this.currentSprite].framesMax  && (this.framesCurrent === 0 ? (this.framesElapsed !== 0): true)
      ) {
      return 
    }

    // make sure to record direction change when sprite changes
    if (sprite === 'run') {
      this.direction = 'right'
    } else if (sprite === 'runLeft') {
      this.direction = 'left'
    }

    // check if animation sprites should be drawn horizontally
    if (this.sprites[sprite].isHorizontal) {
      this.isHorizontal = true
    } else {
      this.isHorizontal = false
    }   

    // switch sprites
    if (this.image.src !== this.sprites[sprite].image.src) {
      const newSprite = this.sprites[sprite]
      this.image = newSprite.image 
      this.framesMax = newSprite.framesMax
      this.framesCurrent = 0
      this.framesElapsed = 1
      this.prevSprite = this.currentSprite
      this.currentSprite = sprite
      this.currentAnimType = newSprite.type
      if (newSprite.type === 'attack') {
        this.attackDmg = newSprite.dmg
      }
    }
  }

  // returns true if player would collide with rect on next frame
  // using this.physicsBoxWidth. check horizontally
  wouldCollideWithEnemy(enemy, dir) {

    let alignsVertically = (
      this.position.y + this.height >= enemy.position.y && this.position.y < enemy.position.y + enemy.height
    )
    if (!alignsVertically) return false

 
    // console.log(this.velocity.x)
    if (dir === 'right' && this.position.x < enemy.position.x) {
      const diff =  (this.position.x + this.width / 2 + this.physicsBoxWidth + this.speed) - (enemy.position.x + enemy.width / 2 - enemy.physicsBoxWidth)
      if (diff >= 0 && this.position.x < enemy.position.x + enemy.width) {
        return true
      }
    } else if (dir === 'left' && this.position.x > enemy.position.x) {
      const diff = ((enemy.position.x + enemy.width / 2 + this.physicsBoxWidth) - (this.position.x + this.width / 2 - this.physicsBoxWidth - this.speed))
      if (diff >= 0 && enemy.position.x < this.position.x + this.width) {
        
        return true
      }
    }
    // if (dir === 'right') {
    //   const diff = (this.position.x + this.width / 2 + this.physicsBoxWidth + this.velocity.x) - (enemy.position.x + enemy.width / 2 - enemy.physicsBoxWidth)
     
    //   if (diff >= 0 && diff <= this.velocity.x) {
    //     this.position.x -= this.velocity.x + 5 // +5 here is kind of a "hacky" way to make sure they don't pass
    //     return true
    //   }
    // } else if (dir === 'left') {
    //   const diff = ((enemy.position.x + enemy.width / 2 + this.physicsBoxWidth) - (this.position.x + this.width / 2 - this.physicsBoxWidth + this.velocity.x))
    //     if (diff >= 0 && diff < Math.abs(this.velocity.x)) {
    //       this.position.x -= this.velocity.x - 5
    //       return true
    //     }
    // }

    return false
  }

  wouldCollideEnemyVertically(enemy) {
    // console.log('first')
    if (this.velocity.y !== 0) {
      if (this.position.y + this.height + this.velocity.y >= enemy.position.y && 
        this.position.y + this.velocity.y < enemy.position.y + enemy.height) {
          // console.log('second')
        let centerDiff = Math.abs(this.position.x + this.width / 2 - (enemy.position.x + enemy.width / 2))
        // console.log('centerDiff: ', this.position.x + this.width / 2 - (enemy.position.x + enemy.width / 2))
        if (centerDiff < this.physicsBoxWidth * 2) {
          this.velocity.y = 0
          console.log('returning true')
          return true
        }
      }
    }
    return false
  } 

  // checks if attack box collides with enemy
  checkAttack(enemy) {
    if (this.sprites[this.currentSprite].type !== 'attack') return

    let curSprite = this.sprites[this.currentSprite]
    let box = curSprite.attackBox

    let attackValid = false

    // check if attackBox collides with enemy
    if (this.direction === 'right') {
      attackValid = (
        this.position.x + this.width + box.offset.x + box.width >= enemy.position.x &&
        this.position.x + this.width + box.offset.x <= enemy.position.x + enemy.width &&
        this.position.y + box.offset.y + box.height >= enemy.position.y &&
        this.position.y + box.offset.y <= enemy.position.y + enemy.height
      )
    } else {
      attackValid = (
        this.position.x - box.offset.x - box.width <= enemy.position.x + enemy.width &&
        this.position.x + this.width - box.offset.x >= enemy.position.x &&
        this.position.y + box.offset.y + box.height >= enemy.position.y &&
        this.position.y + box.offset.y <= enemy.position.y + enemy.height
      )
    }

    // if (this.direction === 'right') {
    //   c.fillRect(this.position.x + this.width + box.offset.x, this.position.y + box.offset.y, box.width, box.height)
    // } else {
    //   c.fillRect(this.position.x - box.width - box.offset.x, this.position.y + box.offset.y, box.width, box.height)
    // }

    // if current frame during attack animation should apply attack
    if (attackValid && 
      curSprite.attackBox.attackFrames[(this.framesCurrent).toString()] && 
      this.framesElapsed === 1) {
      
      enemy.health = enemy.health >= this.attackDmg ? enemy.health - this.attackDmg : 0
      console.log('here')
      if (enemy.direction === 'right') {
        enemy.switchSprite('takeHit')
      } else {
        enemy.switchSprite('takeHitLeft')
      }
    }
  }

  draw() {
    // draw healthbox
    let barWidth = 80
    let healthWidth = barWidth * this.health / 100
    c.fillStyle = '#ef4444'
    c.fillRect(
      this.position.x,
      this.position.y - 25,
      barWidth,
      12
    )
    c.fillStyle = 'green'
    c.fillRect(
      this.position.x,
      this.position.y - 25,
      healthWidth,
      12
    )
    
    // draw character
    c.drawImage(
      this.image,
      this.isHorizontal ? this.framesCurrent * this.image.width / this.framesMax : 0,
      // temporarily add "+2" for a hacky way to remove the slightly visible top pixels
      this.isHorizontal ? 0 : this.framesCurrent * this.image.height / this.framesMax + 2, 
      this.isHorizontal ? this.image.width / this.framesMax : this.image.width,
      this.isHorizontal ? this.image.height : this.image.height / this.framesMax,
      this.position.x + (this.direction === 'left' && !this.symmetricalSprite ? (this.offset.x - (this.isHorizontal ? this.image.width / this.framesMax : this.image.width) - this.width) : this.offset.x),
      // this.position.x + this.offset.x + (this.direction === 'left' && (-this.width -(this.isHorizontal ? this.image.width / this.framesMax : this.image.width))),
      this.position.y + this.offset.y,
      this.isHorizontal ? this.image.width / this.framesMax * this.scale : this.image.width * this.scale,
      this.isHorizontal ? this.image.height * this.scale : this.image.height / this.framesMax * this.scale
    )
  }

  update() {
    // visualize collision rectangle
    c.fillStyle = 'rgba(0,0,0,0.1)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // visualize attack box
    if (this.sprites[this.currentSprite].attackBox) {
      let box = this.sprites[this.currentSprite].attackBox
      c.fillStyle = 'rgba(0,0,0,0.3)'
      if (this.direction === 'right') {
        c.fillRect(this.position.x + this.width + box.offset.x, this.position.y + box.offset.y, box.width, box.height)
      } else {
        c.fillRect(this.position.x - box.width - box.offset.x, this.position.y + box.offset.y, box.width, box.height)
      }
    }

    // detects first time character is dead
    if (this.health === 0) {
      // some characters don't need deathLeft animation
      if (this.direction === 'left' && this.sprites.deathLeft) {
        this.switchSprite('deathLeft')
      } else {
        this.switchSprite('death')
      }
      this.velocity.x = 0
      
    }
    if (!this.isDead && this.health === 0 && this.framesCurrent === this.sprites.death.framesMax-1 && this.framesElapsed === 0) {
      this.isDead = true
      const dh = this.sprites.death.deathHeight
      this.offset.y -= (this.height - dh)
      this.position.y += (this.height - dh)
      this.height = dh
      
      
      
      
    }
  
    this.position.x += this.velocity.x 
    this.position.y += this.velocity.y

    
    if (!this.vertCollision) {
      // apply gravity 
      if (this.position.y + this.velocity.y + this.height >= canvas.height - 30) {
        this.velocity.y = 0
        this.position.y = canvas.height - 30 - this.height
      } else {
        this.velocity.y += this.gravity
      }
      
    }
    

    
    // update position if player sprite moves during ability
    if (this.sprites[this.currentSprite].animOffset && 
      this.sprites[this.currentSprite].animOffset.frame === this.framesCurrent &&
      (this.framesCurrent === 0 ? this.framesElapsed === 1 : this.framesElapsed === 0)
    ) {
      this.offset.x += this.sprites[this.currentSprite].animOffset.x
      // prevAnimOffset changes position
      this.position.x -= this.sprites[this.currentSprite].animOffset.x
      this.prevAnimOffset = this.sprites[this.currentSprite].animOffset
      this.shouldReposition = true
    } else if (this.shouldReposition && this.framesCurrent === 0 && this.framesElapsed === 1) {
      // if the previous animation had an animOffset, revert to original position
      this.offset.x -= this.prevAnimOffset.x
      // this.position.x -= this.sprites[this.prevSprite].animOffset.x
      this.shouldReposition = false
      // console.log(2)
    }

    // handles cases for specific sprites that temporarily need to change offset
    // reason for checking framesElasped === 1 is because we're setting framesElapsed = 1 when
    // switching sprites
    if (this.sprites[this.currentSprite].offset && this.framesElapsed === 1 && this.framesCurrent === 0) {
      // in order to not create a reference
      
      let offsetToApply = this.sprites[this.currentSprite].offset
      this.offset.x += offsetToApply.x
      this.offset.y += offsetToApply.y
      this.prevSpriteOffset = offsetToApply
      this.shouldRevertOffset = true
      
      // console.log('in here')
    } else if (this.shouldRevertOffset && this.framesCurrent === 0 && this.framesElapsed === 1) {
      // reverts the offset change after that animation is complete or skipped
      // this.offset = this.prevSpriteOffset
      this.offset.x -= this.prevSpriteOffset.x
      this.offset.y -= this.prevSpriteOffset.y
      this.shouldRevertOffset = false
     
    }

    this.draw()
    if (!this.isDead) {
      this.animateFrames()
    }
    
    

  }
}




