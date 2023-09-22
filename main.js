
let canvas = document.getElementById('screen')
let ctx = canvas.getContext('2d')
let canvas_size = {"x":window.innerWidth - 20, "y":window.innerHeight - 20} // windowManager access those

canvas.width = canvas_size.x
canvas.height = canvas_size.y


class WorldClass{

    constructor(){
        this.sprites = []
        this.keys = []
        this.frameUpdateFunctions = []
        this.ctx = ctx
    }

    addSprite(sprite){
        sprite.id = this.sprites.length
        this.sprites.push(sprite)

        //sort by zIndex going from lowest to highest
        this.sprites.sort(function(a, b){return a.zIndex - b.zIndex})


    }

    draw(){

        for(let func of this.frameUpdateFunctions){
            func()
        }

        ctx.clearRect(0, 0, canvas_size.x, canvas_size.y)
        for(let sprite of this.sprites){
            sprite.draw()
        }
        
        
    }

    onUpdate(fn){
        this.frameUpdateFunctions.push(fn)
    }


}


class CameraClass{

    // in development, not functional
    constructor(){
        this.x = 0
        this.y = 0
        this.distance = 1
    }
    follow(sprite){
        this.x = sprite.x
        this.y = sprite.y
    }
}

class SpriteBox{

    constructor(x, y, width, height, color, strokeColor, strokeWidth, image, collision, zIndex){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.angle = 0

        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
        this.image = image

        this.id =  0

        this.collision = collision || true

        this.zIndex =  zIndex || 0

    }

    checkCollision(otherSprite) {
        // Check if the bounding boxes of two sprites overlap
        if (
            this.x < otherSprite.x + otherSprite.width &&
            this.x + this.width > otherSprite.x &&
            this.y < otherSprite.y + otherSprite.height &&
            this.y + this.height > otherSprite.y &&
            this.id !== otherSprite.id &&
            otherSprite.collision
        ) {
            // Collision detected
            return otherSprite;
        }

        // No collision
        return false;
    }


    checkAllCollision() {
        for (let sprite of World.sprites) {
            if (sprite !== this && this.checkCollision(sprite)) {
                // Collision detected with another sprite
                return sprite;
            }
        }
        // No collision with any other sprite
        return false;
    }

    draw(){

        if (this.collision){
            let collision = this.checkAllCollision()
            if (collision && this.onCollision!=undefined){
                this.onCollision(collision)
            }
        }

        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        if (this.strokeWidth > 0){
            ctx.strokeStyle = this.strokeColor
            ctx.lineWidth = this.strokeWidth
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
        // put image on it
        if (this.image){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }

        return true

    }

}

class KeysClass{
    constructor(){
        this.keysPressed = {}
        
        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key.toLowerCase()] = true
        })
        document.addEventListener('keyup', (event) => {
            delete this.keysPressed[event.key.toLowerCase()]
        })



    }
    isKeyPressed(key){
        return this.keysPressed[key] || false
    }
    getPressedKeys(){
        return this.keysPressed
    }
}

let Camera = new CameraClass()
let Keys = new KeysClass()
let World = new WorldClass()

class TimeClass{
    constructor(){
        this.lastTime = performance.now()
        this.deltaTime = 0
        this.waitAfterFrame = 1000/75
    }
    reset(){
        this.deltaTime = performance.now() - this.lastTime
        this.lastTime = performance.now()
    }
    getFPS(){
        return 1000/this.deltaTime
    }

}

let Time = new TimeClass()

let GameSettings = null

async function bootUp(){
    await fetch('./twoFaceEngine/builtin/scripts/scripts.json').then(response => response.json()).then(json => {
        for(let script of json){
            let scriptElement = document.createElement('script')
            scriptElement.src = "./twoFaceEngine/builtin/scripts/"+script
            document.head.appendChild(scriptElement)
        }
    })
    
    // fetch /scripts/scripts.json and add scripts to head in document
    await fetch('./scripts/scripts.json').then(response => response.json()).then(json => {
        for(let script of json){
            let scriptElement = document.createElement('script')
            scriptElement.src = script
            document.head.appendChild(scriptElement)
        }
    })

    while (typeof GameSettingsClass == 'undefined'){
        await new Promise(r => setTimeout(r, 10));
    }

    GameSettings = new GameSettingsClass()


    function update(){
        Time.reset()
        World.draw()
        setTimeout(update, Time.waitAfterFrame)
    }
    

    update()

}

bootUp()

