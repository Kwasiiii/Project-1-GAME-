function init(){
  //Elements
  const grid = document.querySelector('.grid')
  const start = document.getElementById('start')
  const startButton = document.querySelector('#start')
  const scoreResult = document.getElementById('score')
  const liveResult = document.getElementById('lives')
  const audioBtn = document.querySelector('i')
  const audio = new Audio('audio/themeaudio.mp3')
  const pacmanShootAudio = new Audio('audio/pacman_eatfruit.wav')
  const pacmanDeathAudio = new Audio('audio/pacman_death.wav')
  const alienDeathAudio = new Audio('audio/pacman_chomp.wav')

  //Variables
  const alienInvaders = [ 1, 2, 3, 4, 5, 6, 7, 8,
    11, 12, 13, 14, 15, 16, 17, 18]
  const deadAlien = []
  
  const width = 10 
  const cellCount = width * width
  const cells = []

  const rocketShip = 'ship'
  const aliens = 'alienship'
  const startingPosition = 95
  let currentPosition = startingPosition
  let direction = 1
  let moveRight = true
  let score = 0
  let lives = 3

  const laser = 'shooterlaser' 
  const alienLaser = 'alienlaser'

  function disableButton(){
    startButton.setAttribute('disabled', '')
    startButton.style.display = 'none'
  }


  //Execution
  //create grid to start the game and add rocketship and alien-invaders
  function creategrid (){
    for (let i = 0; i < cellCount; i++){
      const cell = document.createElement('div')//creating new element div
      // cell.innerText = i //add index as innerText
      grid.appendChild(cell) //Append cell to grid
      cells.push(cell) //Push cell into array cells
    } 
    addShip(startingPosition)
    addAliens()
    move
    disableButton()
    setInterval(alienBullet, 1000)
  }

  function themeSong(event){
    if (audio.paused){
      event.target.classList.remove('fa-pause')
      event.target.classList.add('fa-play')
      audio.play()
    } else {
      event.target.classList.remove('fa-play')
      event.target.classList.add('fa-pause')
      audio.pause()
    } 
  }

  function pacmanLaserSound(){
    pacmanShootAudio.play()
  }

  function pacmanDeathSound(){
    pacmanDeathAudio.play()
  }

  function alienDeathSound(){
    alienDeathAudio.play()
  }

  //Create a function called addShip @para 'cellposition'
  function addShip(cellPosition){
    cells[cellPosition].classList.add(rocketShip)//Add class ship(rocket) to the cell of starting position
  }

  //Create a function called removeShip @para 'cellposition'
  function removeShip(cellPosition){
    cells[cellPosition].classList.remove(rocketShip)//Add class ship(rocket) to the cell of starting position
  }



  // Key movement
  function handleKeyDown(event){

    // Remove existing ship
    removeShip(currentPosition) // Ship is always removed

    const key = event.keyCode // event.keyCode is the unique code for the key that was pressed
    const right = 39
    const left = 37
    console.log(key)
  
    if (key === right && currentPosition % width !== width - 1){
      currentPosition++
    } else if (key === left && currentPosition % width !== 0){
      currentPosition--
    // } else if (key === shoot){
    //   shooterShoot()
    } else {
      console.log('INVALID KEY')
    }

    // Add shit at new current position
    addShip(currentPosition) // ship added at updated currentPosition or old currentPosition if no conditions were met
  }

  //create a function addAliens 
  function addAliens(){
    for (let i = 0; i < alienInvaders.length; i++){ //use a for loop with condition i < alien.length
      if (!deadAlien.includes(i))
        cells[alienInvaders[i]].classList.add(aliens) //add class alien to cells with index alien[i] which adds up to length of invaders
    }
  }


  //create a function removeAliens
  function removeAliens(){
    for (let i = 0; i < alienInvaders.length; i++){ //use a for loop with condition i < alien.length
      cells[alienInvaders[i]].classList.remove(aliens) //add class alien to cells with index alien[i] which removes up to length of invaders
    }
  }
  

  //create a collision check function
  function moveAliens(){
    const leftborder = alienInvaders[0] % width === 0
    const rightborder = alienInvaders[alienInvaders.length - 1] % width === width - 1
    removeAliens()
    if (rightborder && moveRight){
      for (let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += width + 1
        direction = - 1
        moveRight = false
      }
    }
    if (leftborder && !moveRight) {
      for (let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += width - 1
        direction = 1
        moveRight = true
      }
    }
    for (let i = 0; i < alienInvaders.length; i++){
      alienInvaders[i] += direction
    }
    addAliens()
    
  }

  function bullet(event){
    let bulletTimer = null
    let laserCurrentPosition = currentPosition

    function shooterShoot(){
      cells[laserCurrentPosition].classList.remove(laser)
      laserCurrentPosition -= width
      cells[laserCurrentPosition].classList.add(laser)

      if (cells[laserCurrentPosition].classList.contains(aliens)){
        cells[laserCurrentPosition].classList.remove(laser)
        cells[laserCurrentPosition].classList.remove(aliens)
        score += 100  
        clearInterval(bulletTimer) 
        const alienRemoved = alienInvaders.indexOf(laserCurrentPosition)
        deadAlien.push(alienRemoved) 
        alienDeathSound()
      }
    }
    scoreResult.innerText = score
    if (event.keyCode === 32){
      pacmanLaserSound()
      bulletTimer = setInterval(shooterShoot, 100)
    }
  }

  function alienBullet(){  
    // console.log(alienLaserPosition)
    let alienLaserPosition = alienInvaders[(Math.floor(Math.random() * alienInvaders.length))]  
    setInterval(()=>{
      cells[alienLaserPosition].classList.remove(alienLaser)     
      alienLaserPosition += width
      cells[alienLaserPosition].classList.add(alienLaser)    
      if (cells[alienLaserPosition].classList.contains(rocketShip)){
        lives --
        pacmanDeathSound()
        if (lives === 0){
          window.alert('GAME OVER!')
        }
        clearInterval()
      }

    },200)
    
    liveResult.innerText = lives
  }
  //Events
  document.addEventListener('keyup', bullet)

  const move = setInterval(moveAliens, 1000)
  audioBtn.addEventListener('click', themeSong)
  document.addEventListener('keydown', handleKeyDown) // Listening for key press
  start.addEventListener('click', creategrid)
  
}
window.addEventListener('DOMContentLoaded', init)