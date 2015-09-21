"use strict";

/* RESOURCES USED FOR THIS PROJECT
 *
 * getRandomInt:
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 *
 * Scoring:
 * https://developer.mozilla.org/en-US/docs/Games/Workflows/2D_Breakout_game_pure_JavaScript/Track_the_score_and_win
 *
 * roundRect:
 * Thanks to Juan Mendes for this method!
 * http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html
 */

/*
 * GLOBAL METHODS
 */

/* The getRandomInt method returns a random integer between min and max, inclusive of both.
 * Will be used to give a random speed between two values to our enemies.
 * Will also be used to give a random x-coordinate start location to our enemies.
 */
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Attribution: Juan Mendes (see Resources at top of code)
 * The roundRect method draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
var roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
};

/* The makePixelGrayScale and makeGrayScale functions are used to
 * gray out the screen on game messages.
 */
// Grayscale: pixel conversion
var makePixelGrayScale = function(r, g, b, a) {
    var y = (0.3 * r) + (0.59 * g) + (0.11 * b);
    return {r: y, g: y, b: y, a: y};
};

// Grayscale: pixel replacement
var makeGrayScale = function(imageData) {
    var r, g, b, a;
    var numPixels = imageData.data.length / 4;
    for (var i = 0; i < numPixels; i++) {
        r = imageData.data[i * 4 + 0];
        g = imageData.data[i * 4 + 1];
        b = imageData.data[i * 4 + 2];
        a = imageData.data[i * 4 + 3];
        var pixel = makePixelGrayScale(r, g, b, a);
        imageData.data[i * 4 + 0] = pixel.r;
        imageData.data[i * 4 + 1] = pixel.g;
        imageData.data[i * 4 + 2] = pixel.b;
        imageData.data[i * 4 + 3] = pixel.a;
    }

    ctx.putImageData(imageData, 0, 0 );
};

// This draws the scoreboard.
var scoreBoard = function() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(505, 0, 200, 606);
    ctx.font = '700 24px Kalam';
    ctx.fillStyle = '#932703';
    ctx.textAlign = 'left';
    ctx.fillText('Time Left: ' + player.timer.toFixed(1), 515, 100); // Time left
    ctx.fillText('Score: ' + player.score, 515, 150); // Score
    ctx.font = '400 18px Kalam';
    ctx.fillStyle = '#932703';
    ctx.strokeStyle = '#932703';
    roundRect(ctx, 515, 280, 80, 30, 3, true); // Spacebar button
    roundRect(ctx, 515, 375, 56, 28, 3, true); // Enter button
    ctx.fillStyle = '#fff';
    ctx.fillText('Spacebar', 520, 300); // Spacebar button text
    ctx.fillText('Enter', 520, 395); // Enter button text
    ctx.fillStyle = '#932703';
    ctx.fillText('to pause', 515, 336); // Spacebar second-line text
    ctx.fillText('for instructions', 515, 430); // Enter second-line text
};

// This draws the start screen.
var startScreen = function() {
    ctx.clearRect(0, 0, 705, 606); // Need this line to clear board, if applicable.
    // Title block
    ctx.fillStyle = '#932703';
    ctx.fillRect(5, 5, 695, 596);
    // Title text
    ctx.fillStyle = '#fff';
    ctx.font = '700 48px Kalam';
    ctx.textAlign = 'center';
    ctx.fillText('Udacity Frogger!', 356, 60);
    // Author block
    ctx.fillStyle = '#e9812b';
    ctx.fillRect(5, 85, 695, 40);
    // Author text
    ctx.fillStyle = '#fff';
    ctx.font = '400 24px Kalam';
    ctx.fillText('Created by Lauren Tucker to meet Project 3 specifications', 356, 112);
    // Cast lable
    ctx.fillStyle = '#fff';
    roundRect(ctx, 80, 155, 200, 50, 5, true);
    ctx.fillStyle = '#000';
    ctx.fillText('Meet the Cast', 180, 190);
    // Player
    ctx.drawImage(Resources.get('images/char-horn-girl.png'), 20, 170);
    ctx.textAlign = 'left';
    ctx.fillText('Our Hero', 150, 270);
    // Enemy
    ctx.drawImage(Resources.get('images/enemy-bug.png'), 20, 250);
    ctx.fillText('Our Enemies', 150, 370);
    // Loot
    ctx.drawImage(Resources.get('images/gem-orange.png'), 20, 350);
    ctx.fillText('Our Loot', 150, 470);
    // Rules label
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    roundRect(ctx, 415, 155, 200, 50, 5, true);
    ctx.fillStyle = '#000';
    ctx.fillText('Learn the Rules', 515, 190);
    // Rules
    ctx.font = '400 18px Kalam';
    ctx.fillText('You have 10 seconds to get to the water.', 515, 250);
    ctx.fillText('Getting to the water nets you 5 points.', 515, 280);
    ctx.fillText('Pick up a gemstone on the way,', 515, 310);
    ctx.fillText('get an extra 5 points.', 515, 328);
    ctx.fillText('Bugs will eat you. And cost you 5 points.', 515, 358);
    ctx.fillText('And don\'t just stand around.', 515, 388);
    ctx.fillText('Running out of time costs 10 points.', 515, 406);
    ctx.fillText('The game is over when your', 515, 436);
    ctx.fillText('score falls below zero.', 515, 454);
    ctx.fillText('How do you win? We\'re all winners. Just', 515, 484);
    ctx.fillText('close the browser when you get bored.', 515, 500);
    // Play label
    ctx.fillStyle = '#fff';
    roundRect(ctx, 160, 530, 375, 50, 5, true);
    ctx.fillStyle = '#000';
    // Play text
    ctx.textAlign = 'left';
    ctx.font = '400 24px Kalam';
    ctx.fillText('Ready to Play? Hit', 200, 565);
    // Enter button
    ctx.fillStyle = '#e9812b';
    roundRect(ctx, 410, 540, 80, 30, 5, true);
    ctx.fillStyle = '#fff';
    ctx.fillText('Enter', 420, 562);
    // Outside black border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000';
    roundRect(ctx, 5, 5, 695, 596, 5, false, true);
};

/*
 *  GAME STATES: start screen and pause screen toggles
 */

// Toggle between start screen and play mode.
// gamePlay initially set to false, which will show start screen/instructions.
// gamePlay = true puts user in play mode.
var gamePlay = false;

var gamePlayToggle = function() {
    gamePlay = !gamePlay;
};

// Toggle between pause and not paused.
// Pause is initially set to false, which has no effect on play mode.
// When pause = true, the pause screen will appear.
var pause = false;

var pauseToggle = function() {
    pause = !pause;
};

/*
 *  CLASS: MessageScreen
 */

var MessageScreen = function(textLineOne, textLineTwo, textLineThree) {
    this.width = 705; // Width of canvas
    this.height = 606; // Height of canvas
    this.textLineOne = textLineOne; // First line of message
    this.textLineTwo = textLineTwo; // Second line of message
    this.textLineThree = textLineThree; // Third line of message
};

// Returns imageData. Need this to call the makeGrayScale function.
MessageScreen.prototype.imageData = function() {
    return ctx.getImageData(0, 0, this.width, this.height);
};

// Formats text for first line of message (larger font)
MessageScreen.prototype.textLineOneFormatted = function() {
    this.x = 253;
    this.y = 303;
    ctx.font = '700 24px Kalam';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(this.textLineOne, this.x, this.y);
};

// Formats text for second line of message (smaller font)
MessageScreen.prototype.textLineTwoFormatted = function() {
    this.x = 253;
    this.y = 343;
    ctx.font = '400 18px Kalam';
    ctx.fillText(this.textLineTwo, this.x, this.y);
};

// Formats text for third line of message (smaller font)
MessageScreen.prototype.textLineThreeFormatted = function() {
    this.x = 253;
    this.y = 363;
    ctx.fillText(this.textLineThree, this.x, this.y);
};

// Formats all three lines of text
MessageScreen.prototype.formatText = function() {
    this.textLineOneFormatted();
    this.textLineTwoFormatted();
    this.textLineThreeFormatted();
};

MessageScreen.prototype.display = function() {
    makeGrayScale(this.imageData()); // This is a GLOBAL method
    this.formatText();
};

/*
 *  CLASS: Gem
 */

var Gem = function() {
    this.xArray = [2, 102, 202, 302, 402]; // An array of possible x-coordinates
    this.xArrayLength = this.xArray.length;
    this.yArray = [230, 145, 60]; // An array of possible y-coordinates
    this.yArrayLength = this.yArray.length;
    this.sprite = 'images/gem-orange.png';
    this.x = this.xArray[Math.floor(Math.random() * this.xArrayLength)]; // Picks random x-coordinate
    this.y = this.yArray[Math.floor(Math.random() * this.yArrayLength)]; // Picks random y-coordinate
};

// Updates the location of the gem when player is reset
Gem.prototype.update = function() {
    this.x = this.xArray[Math.floor(Math.random() * this.xArrayLength)]; // Picks random x-coordinate
    this.y = this.yArray[Math.floor(Math.random() * this.yArrayLength)]; // Picks random y-coordinate
};

// Renders the gem
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // Draws gem on the screen
};

/*
 *  CLASS: Enemy
 */

// Enemy Class
var Enemy = function(y) {
    this.sprite = 'images/enemy-bug.png'; // Assigns enemy sprite
    this.x = getRandomInt(-50, -500); // Assigns random x-coordinate start location off canvas
    this.y = y; // Our enemies will be constructed with one of three values for y
    this.speed = getRandomInt(200, 400); // Assigns random initial speed to bug
    this.width = 101; // Assigns width to sprite (needed to calculate collisions)
};

// update method for Enemy
// Parameter dt is a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt; // Updates location of enemy
    if (this.x > 505) { // Checks to see if enemy is off canvas.
        this.reset(); // Resets enemy
    }
};

// render method for Enemy
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // Draws the enemy on the screen
};

// reset method for the Enemy
Enemy.prototype.reset = function() {
    this.x = getRandomInt(-50, -500); // Resets enemy to a random x-coordinate start location off canvas
    this.speed = getRandomInt(200, 400); // Assigns new random speed to enemy
};

/*
 *  CLASS: Player
 */

// Player Class
var Player = function(x, y) {
    this.sprite = 'images/char-horn-girl.png'; // Assigns player sprite
    this.x = x; // Assigns player x-coordinate
    this.y = y; // Assigns player y-coordinate
    this.offsetX = 10; // Distance of offset between edge of sprite and actual player pixels
    this.width = 101; // Assigns width to sprite (needed to calculate collisions)
    this.score = 0; // Initial score
    this.timer = 10; // Initial time
    this.moveHorizontal = 100; // Distance player will move along x-axis
    this.moveVertical = 85; // Distance player will move along y-axis
};

// update method for Player
// TODO: I don't have any idea what to do with this.
Player.prototype.update = function(dt) {
    // TODO: Clueless as to what goes here.
};

// render method for Player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // Draws the player on the screen
};

// handleInput method for Player
// Moves the player around the board if pause mode is not on.
// Does not allow player to move off board.
Player.prototype.handleInput = function(allowedKeys) {
    switch(allowedKeys) {
        case 'left':
            if (this.x > 2 && !pause) {
                this.x -= this.moveHorizontal;
                break;
            } else {
                break;
            }
        case 'right':
            if (this.x < 402 && !pause) {
                this.x += this.moveHorizontal;
                break;
            } else {
                break;
            }
        case 'up':
            if (this.y > 60 && !pause) {
                this.y -= this.moveVertical;
                break;
            } else if (this.y === 60 && !pause) {
                this.score += 5;
                this.reset();
                this.timer = 10;
                gem.update();
                break;
            } else {
                break;
            }
        case 'down':
            if (this.y < 400 && !pause) {
                this.y += this.moveVertical;
                break;
            } else {
                break;
            }
        case 'spacebar':
            pauseToggle();
            break;
        case 'enter':
            gamePlayToggle();
            break;
        default:
            break;
    }
};

// reset method for Player
Player.prototype.reset = function() {
    this.x = 202; // Resets player back to starting x-coordinate
    this.y = 400; // Resets player back to starting y-coordinate
};

// Function that counts down the time on the clock
Player.prototype.clock = function(dt) {
    while (this.timer > 0) {
        this.timer = this.timer - dt;
        return this.timer;
    }
};

// Function that checks for time running out.
// Resets player and timer, updates gem and substracts points when time runs out.
Player.prototype.checkTimer = function() {
    if (this.timer <= 0) {
        this.score -= 10; // Lose 10 points if you run out of time.
        this.reset(); // Player is reset.
        this.timer = 10; // Timer is reset to 10.
        gem.update(); // Gem location is updated.
    }
};

// Function that checks for gem collection
Player.prototype.checkGems = function() {
    if ((this.x === gem.x) && (this.y === gem.y)) { // Collection zone
        this.score += 5; // Picking up a gem gets you five points
        gem.x = -100; // Hides gem off screen
        gem.y = -100;
    }
};

// Function that checks for collisions and resets player when one occurs
Player.prototype.checkCollisions = function() {
    var enemyRightEdge, // x-coordinate of right side of enemy sprite
        playerLeftEdge, // x-coordinate of left side of player sprite (start of collision space)
        playerRightEdge; // x-coordinate of right side of player sprite (end of collision space)
    for (var i = 0; i < enemyArrayLength; i++) {
        if (allEnemies[i].y === this.y) { // If the player and enemy have the same y-coordinate
            enemyRightEdge =  allEnemies[i].x + allEnemies[i].width;
            playerLeftEdge = this.x + this.offsetX;
            playerRightEdge = this.x + this.width - 2 * this.offsetX;
            if (enemyRightEdge > playerLeftEdge && enemyRightEdge < playerRightEdge) { // Collision zone
                this.score -= 5; // Collision means you lose five points
                if (this.score < 0) { // This checks if game is over
                    gamePlay = false;
                } else {
                this.reset(); // Player is reset to starting position
                this.timer = 10; // Timer is reset to 10
                gem.update(); // Gem location is updated
                }
            }
        }
    }
};

/*
 * INSTANCES: Player, Enemy, Gem and MessageScreen classes
 */

// Instance of player
var player = new Player(202, 400);

// Array of enemies
var allEnemies = [];

// Function that instantiates enemies, pushes them into allEnemies array, and returns allEnemies array.
var instantiateEnemies = function() {
    var enemyInstances = [60, 60, 145, 145, 230, 230]; // You can add more instances here. These are y-coordinates.
    var numberOfEnemyInstances = enemyInstances.length; // Number of instances. Used in for loop below.
    for (var i = 0; i < numberOfEnemyInstances; i++) {
        var enemy = new Enemy(enemyInstances[i]);
        allEnemies.push(enemy);
    }
    return allEnemies;
};

// We instantiate enemies and store length of array in enemyArrayLength (used in collisions).
var enemyArrayLength = instantiateEnemies().length;

// Instance of the Gem class
var gem = new Gem();

// Displays when user hits spacebar.
var pauseScreen = new MessageScreen('GAME IS PAUSED',
    'Hit spacebar again',
    'to continue playing');

// Displays when user hits enter.
var gameOverScreen = new MessageScreen('GAME IS OVER. YOU LOSE.',
    'Refresh the window',
    'to play again');

/*
 * EVENT LISTENERS
 */

// Listens for key presses and sends the keys to the gameState() and
// Player.handleInput() methods.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});