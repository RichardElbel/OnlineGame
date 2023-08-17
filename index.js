const canvas = document.querySelector('canvas')
////this is the canvas context
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

////creating collision map
const collisionsMap = []
for(let i = 0; i<collisions.length;i+=70){
    collisionsMap.push(collisions.slice(i, 70+i))
    
}


////creating battle zone map
const battleZonesMap = []
for(let i = 0; i<battleZonesData.length;i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70+i))
    
}


const boundaries = []

const offset = {
    x: -1000,
    y: -510
}

////loop for crating collsions map
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
            boundaries.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }}))
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
            battleZones.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }}))
    })
})

console.log(battleZones)

const image = new Image()
image.src = './img/Pokemon_Map.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

///Player movement Sprites
const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'
const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'
const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'
const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'




const player = new Sprite({
   position: { 
        x: canvas.width/2 - 192 / 4, 
        y: canvas.height/2 + 62/4 + 100
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    }, 
    sprites: {
        up:playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rect1, rect2}){
    return(
        rect1.position.x + rect1.width >= rect2.position.x && 
        rect1.position.x<= rect2.position.x + rect2.width && 
        rect1.position.y <=rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

const battle = {
    inititated: false
}

function animate() {
   const animationId = window.requestAnimationFrame(animate)


   ///drawing the background and character
   background.draw()

    ///boundary draeing
   boundaries.forEach(boundary=> {
       boundary.draw()

   })

   battleZones.forEach((battleZones => {
       battleZones.draw()
   }))

   player.draw()

   foreground.draw()

   let moving = true
   player.animate = false

   if(battle.inititated) return
   /////activating battle
   if(keys.w.pressed||keys.a.pressed||keys.s.pressed||keys.d.pressed){
    for(let i = 0; i< battleZones.length;i++){
        const battleZone = battleZones[i]

        const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - 
        Math.max(player.position.x, battleZone.position.x)) * 
         (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - 
         Math.max(player.position.y, battleZone.position.y))
       
         if(rectangularCollision({
            rect1:player,
            rect2: battleZone
        })
            && overlappingArea > (player.width * player.height) / 2
            && Math.random() < 0.01
        ){
            console.log("activate battle")
            //// deactivate current animation loop
            window.cancelAnimationFrame(animationId)
            battle.inititated = true

            gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: .4,
                onComplete(){
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: .4,
                        onComplete(){
                            ///activeate battle animation
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: .4,
                            })
                        }
                    })

                    

                
                }
            })
            break
        }
    }
   }




  
   ////////Pressing W
   if(keys.w.pressed && lastKey == 'w') {
    player.animate = true
    player.image = player.sprites.up
    for(let i = 0; i< boundaries.length;i++){
        const boundary = boundaries[i]
        
        if(rectangularCollision({
            rect1:player,
            rect2:{...boundary, position: {
                x:boundary.position.x,
                y:boundary.position.y + 3
            }}
        })){
            moving = false
            break
        }
    }

    if(moving)
       movables.forEach((movables) => {
        movables.position.y +=3
       })
   }

////////Pressing A
    else if(keys.a.pressed && lastKey == 'a') {
    player.animate = true
    player.image = player.sprites.left
    for(let i = 0; i< boundaries.length;i++){
        const boundary = boundaries[i]
        
        if(rectangularCollision({
            rect1:player,
            rect2:{...boundary, position: {
                x:boundary.position.x + 3,
                y:boundary.position.y
            }}
        })){
            moving = false
            break
        }
    }

    if(moving)
       movables.forEach((movables) => {
        movables.position.x +=3
       })
   }

   ////////Pressing D
   else if(keys.d.pressed && lastKey == 'd') {
    player.animate = true
    player.image = player.sprites.right
        for(let i = 0; i< boundaries.length;i++){
        const boundary = boundaries[i]
        
        if(rectangularCollision({
            rect1:player,
            rect2:{...boundary, position: {
                x:boundary.position.x + 3,
                y:boundary.position.y
            }}
        })){
            moving = false
            break
        }
    }

    if(moving)
       movables.forEach((movables) => {
        movables.position.x -=3
       })
   }


    ////////Pressing S
   else if(keys.s.pressed && lastKey == 's') {
    player.animate = true
    player.image = player.sprites.down
    for(let i = 0; i< boundaries.length;i++){
        const boundary = boundaries[i]
        
        if(rectangularCollision({
            rect1:player,
            rect2:{...boundary, position: {
                x:boundary.position.x,
                y:boundary.position.y -3
            }}
        })){
            moving = false
            break
        }
    }

    if(moving)
       movables.forEach((movables) => {
        movables.position.y -=3
       })
   }
   


}

//animate()

let lastKey = ''
///listener listing for browser reaction for when the user pressed down on a key
window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

///listener listing for browser reaction or when the user pressed up on a key
window.addEventListener('keyup', (e) =>{
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break
        
        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})