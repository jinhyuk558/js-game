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
    symmetricalSprite=false
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

    // width of small rectangle to not allow players
    // to complete pass one another. rectangle should
    // from center of collision box and expand based on
    // width defined here
    this.physicsBoxWidth = 17

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image()
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
    }
  }
  switchSprite(sprite) {
    // if animation doesn't exist for this character, return
    if (!this.sprites[sprite]) return

    // this prevetns the last frame from being called 5 times
    // looks okay as is, but could come up with a way that
    // all the frames get run 5 times. another function is to
    // prevent other animations before attack or fall animations are complete
    if (this.currentAnimType === 'jumpOrFall' &&
      this.framesCurrent < this.sprites[this.currentSprite].framesMax - 1) {
        return
    }

    // attack moves / animation is only cancellabe by moving left or right
    // abilities cannot be canclled by another ability
    if (this.currentAnimType === 'attack' && this.sprites[sprite].type !== 'move' &&
      this.framesCurrent < this.sprites[this.currentSprite].framesMax - 1) {
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

    // set current sprite
    
   

    // switch sprites
    if (this.image.src !== this.sprites[sprite].image.src) {
      this.image = this.sprites[sprite].image 
      this.framesMax = this.sprites[sprite].framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.prevSprite = this.currentSprite
      this.currentSprite = sprite
      this.currentAnimType = this.sprites[sprite].type
    }
  }
  // returns true if player would collide with rect on next frame
  // using this.physicsBoxWidth
  wouldCollideWithEnemy(enemy, dir) {
    let collidesVerticaly = (
      this.position.y + this.height >= enemy.position.y && this.position.y < enemy.position.y + enemy.height
    )
    if (!collidesVerticaly) return

    if (dir === 'right') {
      const diff = (this.position.x + this.width / 2 + 10 + this.velocity.x) - (enemy.position.x + enemy.width / 2 - enemy.physicsBoxWidth)
     
      if (diff >= 0 && diff <= this.velocity.x) {
        this.position.x -= this.velocity.x
        return true
      }
    } else if (dir === 'left') {
      const diff = ((enemy.position.x + enemy.width / 2 + 10) - (this.position.x + this.width / 2 - 10 + this.velocity.x))
        if (diff >= 0 && diff < Math.abs(this.velocity.x)) {
          this.position.x -= this.velocity.x
          return true
        }
    }
    return false
  }
  draw() {
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
    c.fillStyle = 'rgba(255,255,255,0.1)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  
    this.position.x += this.velocity.x 
    this.position.y += this.velocity.y

    if (this.position.y + this.velocity.y + this.height >= canvas.height - 30) {
      this.velocity.y = 0
      this.position.y = canvas.height - 30 - this.height
    } else {
      this.velocity.y += this.gravity
    }

    
    // update position if player sprite moves during ability
    if (this.sprites[this.currentSprite].animOffset && 
      this.sprites[this.currentSprite].animOffset.frame === this.framesCurrent &&
      this.framesElapsed === 0
    ) {
      this.offset.x += this.sprites[this.currentSprite].animOffset.x
      this.position.x -= this.sprites[this.currentSprite].animOffset.x
      this.prevAnimOffset = this.sprites[this.currentSprite].animOffset
      this.shouldReposition = true
      console.log(1)
    } else if (this.shouldReposition && this.framesCurrent === 0 && this.framesElapsed === 0) {
      // if the previous animation had an animOffset, revert to original position
      this.offset.x -= this.prevAnimOffset.x
      // this.position.x -= this.sprites[this.prevSprite].animOffset.x
      this.shouldReposition = false
      console.log(2)
    }

    // handles cases for specific sprites that temporarily need to change offset
    if (this.sprites[this.currentSprite].offset && this.framesElapsed === 0 && this.framesCurrent === 0) {
      this.offset.x += this.sprites[this.currentSprite].offset.x
      this.offset.y += this.sprites[this.currentSprite].offset.y
      this.shouldRevertOffset = true
      // console.log('in here')
    }
    // reverts the offset change after that animation is complete or skipped
    if (this.prevSprite && this.sprites[this.prevSprite].offset && this.shouldRevertOffset) {
      this.offset.x -= this.sprites[this.prevSprite].offset.x
      this.offset.y -= this.sprites[this.prevSprite].offset.y
      this.shouldRevertOffset = false
    }

    this.draw()
    this.animateFrames()
    

  }
}




// NOTE
/*
 * So far, the attack/movement system is decent. The only problem I have
 * is that the last frame for each animation only runs once. I might
 * fix this later.
 *
 */