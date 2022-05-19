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

    this.image = new Image()
    this.image.src = this.imageSrc
  }
  draw() {
    c.drawImage(
      this.image,
      0,
      this.framesCurrent * this.image.height / this.framesMax,
      this.image.width,
      this.image.height / this.framesMax,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      this.image.width * this.scale,
      this.image.height / this.framesMax * this.scale
    )
  }
  animateFrames() {
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      this.framesElapsed = 0
      if (this.framesCurrent === this.framesMax - 1) {
        this.framesCurrent = 0
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
  constructor({ position, imageSrc, framesMax, scale = 1, offset, velocity, sprites }) {
    
    // position is top left. aligns with character sprite
    super({ position, imageSrc, framesMax, scale, offset })
    this.velocity = velocity
    this.gravity = 0.7
    this.sprites = sprites

    // rectangle dimensions for collision detection
    this.width = 70
    this.height = 70

    // direction character is facing
    this.direction = 'right'

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image()
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
    }
  }
  switchSprite(sprite) {

    // this prevetns the last frame from being called 5 times
    // looks okay as is, but could come up with a way that
    // all the frames get run 5 times
    if (this.image.src === this.sprites.attack.image.src && 
      this.framesCurrent < this.sprites.attack.framesMax - 1) {
        console.log(this.framesCurrent)
        return
      }

    if (this.image.src === this.sprites.attackLeft.image.src && 
      this.framesCurrent < this.sprites.attackLeft.framesMax - 1) {
        console.log(this.framesCurrent)
        return
      }
       

    switch(sprite) {
      case 'runRight':
        if (this.image.src !== this.sprites.runRight.image.src) {
          this.image = this.sprites.runRight.image
          this.framesMax = this.sprites.runRight.framesMax 
          this.framesCurrent = 0
        }
        break
      case 'idle':
        if (this.image.src !== this.sprites.idle.image.src) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax 
          this.framesCurrent = 0
        }
        break
      case 'idleLeft':
        if (this.image.src !== this.sprites.idleLeft.image.src) {
          this.image = this.sprites.idleLeft.image
          this.framesMax = this.sprites.idleLeft.framesMax 
          this.framesCurrent = 0
        }
        break
      case 'runLeft':
        if (this.image.src !== this.sprites.runLeft.image.src) {
          this.image = this.sprites.runLeft.image
          this.framesMax = this.sprites.runLeft.framesMax 
          this.framesCurrent = 0
        }
        break
      case 'attack':
        console.log('attack right')
        if (this.image.src !== this.sprites.attack.image.src) {
          this.image = this.sprites.attack.image
          this.framesMax = this.sprites.attack.framesMax 
          this.framesCurrent = 0
        }
        break
      case 'attackLeft':
        console.log('attack left')
        if (this.image.src !== this.sprites.attackLeft.image.src) {
          this.image = this.sprites.attackLeft.image
          this.framesMax = this.sprites.attackLeft.framesMax 
          this.framesCurrent = 0
        }
        break
    }
  }
  update() {
    this.draw()
    this.animateFrames()

    // visualize collision rectangle
    c.fillStyle = 'rgba(255,255,255,0.1)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  
    this.position.x += this.velocity.x 
    this.position.y += this.velocity.y

    if (this.position.y + this.velocity.y + this.height >= canvas.height - 50) {
      this.velocity.y = 0
      this.position.y = canvas.height - 50 - this.height
    } else {
      this.velocity.y += this.gravity
    }
  }
}