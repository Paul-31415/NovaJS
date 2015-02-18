// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x000000)

// create a renderer instance
var screenW = $(window).width(), screenH = $(window).height() - 10
var positionConstant = 1
//var screenW = 800, screenH = 600;
var renderer = PIXI.autoDetectRenderer(screenW, screenH)
$(window).resize(onResize)
// add the renderer view element to the DOM
document.body.appendChild(renderer.view)





	


function ship(shipName) {
    movable.call(this, shipName)
    this.url = 'objects/ships/'
    this.pointing = 0

}
ship.prototype = new movable


ship.prototype.addSpritesToContainer = function() {

    var orderedSprites = [this.sprites.ship.sprite]
    if ("lights" in this.sprites) {
	orderedSprites.push(this.sprites.lights.sprite)
    }
     
    if ("engine" in this.sprites) {
	orderedSprites.push(this.sprites.engine.sprite)
    }


    var spriteList = _.map(_.values(this.sprites), function(s) {return s.sprite})
    var without =  _.difference(spriteList, orderedSprites)
    console.log(without)
    _.each(without, function(x) {this.spriteContainer.addChild(x)}, this);
    _.each(orderedSprites, function(x) {this.spriteContainer.addChild(x)}, this);
    stage.addChild(this.spriteContainer)
}

ship.prototype.updateStats = function(turning, accelerating) {
    if (accelerating) {
	this.sprites.engine.sprite.alpha = 1
    }
    else {
	this.sprites.engine.sprite.alpha = 0
    }

    if ("lights" in this.sprites) {
	this.manageLights()
    }

    movable.prototype.updateStats.call(this, turning, accelerating)
}

ship.prototype.manageLights = function() {
    
    if (typeof this.manageLights.state == 'undefined' || typeof this.manageLights.lastSwitch == 'undefined') {
	this.manageLights.state = true
	this.manageLights.lastSwitch = this.time
    }
    else {
	if (this.time - this.manageLights.lastSwitch > 1000) {
	    this.manageLights.state = !this.manageLights.state
	    this.manageLights.lastSwitch = this.time
	}
    }
    if (this.manageLights.state) {
	this.sprites.lights.sprite.alpha = 1
    }
    else {
	this.sprites.lights.sprite.alpha = 0
    }

}

function playerShip(shipName) {
    ship.call(this, shipName)
    this.pointing = Math.random()*2*Math.PI
    this.velocity[0] = 0
    this.velocity[1] = 0
    this.isPlayerShip = true
}

playerShip.prototype = new ship

playerShip.prototype.onAssetsLoaded = function() {
    if (object.prototype.onAssetsLoaded.call(this)) {
	console.log("and it's mine")
    }
}

playerShip.prototype.updateStats = function() {
    var keys = KeyboardJS.activeKeys()
    var turning
    var accelerating
    if (_.contains(keys, 'right') && !_.contains(keys, 'left')) {
	turning = 'right'
    }
    else if (_.contains(keys, 'left') && !_.contains(keys, 'right')) {
	turning = 'left'
    }
    else {
	turning = ''
    }
    if (_.contains(keys, 'down')) {
	accelerating = -1
    }
    else if (_.contains(keys, 'up')) {
	accelerating = 1
    }
    else {
	accelerating = 0
    }

    
    ship.prototype.updateStats.call(this, turning, accelerating)

}



var ships = []
//var myShip = new playerShip("Starbridge A")
var myShip = new playerShip("Vell-os Dart")
var starbridge = new ship("Starbridge A")
var shuttle = new ship("Shuttle A")


ships[0] = myShip
ships[1] = shuttle
ships[2] = starbridge
ships[0].build()
ships[1].build()
ships[2].build()
ships[2].position = [200,200]

var startGameTimer = setInterval(function () {startGame()}, 1000);

//var printmyShip = setInterval(function() {console.log(myShip)}, 1000)

/*
Starts the game if everything is ready to render.
*/
function startGame() {
    var readyToRender = true;
    for (var i = 0; i < ships.length; i++) {
	if (!ships[i].renderReady) {
	    readyToRender = false;
	}
    }
    if (readyToRender) {
	requestAnimFrame(animate)
	clearInterval(startGameTimer)
	console.log("Rendering started")
    }
}

//requestAnimFrame(animate)
var stagePosition
function animate() {
    stagePosition = myShip.position
    requestAnimFrame( animate )
    object.prototype.time = new Date().getTime()
    ships[1].updateStats('left', false)
    ships[2].updateStats('right', false)
    myShip.updateStats()


//    for (var i = 0; i < ships.length; i++) {
//	ships[i].updateStats(turning, accelerating)
//    }

/*
// Velocity vector line
    line.clear()
    line.lineStyle(5, 0xFF0000, 1)
    line.moveTo(myShip.sprites.ship.sprite.position.x, myShip.sprites.ship.sprite.position.y)
    line.lineTo(myShip.velocity[0] + myShip.sprites.ship.sprite.position.x, -myShip.velocity[1] + myShip.sprites.ship.sprite.position.y)
*/
    //line.lineTo(300,300)
    renderer.render(stage)
}

var line = new PIXI.Graphics()
stage.addChild(line)


function onResize() {
    screenW = $(window).width();
    screenH = $(window).height();
    renderer.resize(screenW,screenH);
}





