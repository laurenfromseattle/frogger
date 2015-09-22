/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

    // Predefine the variables we'll be using within this scope.
    // Create the canvas element and grab the 2D context for that canvas.
    // Create the audio elements
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        music = doc.createElement('audio'),
        gameOver = doc.createElement('audio'),
        bite = doc.createElement('audio'),
        splash = doc.createElement('audio'),
        collect = doc.createElement('audio'),
        buzzer = doc.createElement('audio'),
        lastTime;

    // Set the canvas element height/width and add it to the DOM.
    // Append audio elements to DOM and give them ids.
    canvas.width = 705;
    canvas.height = 606;

    doc.body.appendChild(canvas);
    doc.body.appendChild(music);
    doc.body.appendChild(gameOver);
    doc.body.appendChild(bite);
    doc.body.appendChild(splash);
    doc.body.appendChild(collect);
    doc.body.appendChild(buzzer);

    music.setAttribute('id', 'music');
    gameOver.setAttribute('id', 'gameOver');
    bite.setAttribute('id', 'bite');
    splash.setAttribute('id', 'splash');
    collect.setAttribute('id', 'collect');
    buzzer.setAttribute('id', 'buzzer');

    // Set the audio element src properties
    music.loop = true;
    music.src = 'sounds/background-music.mp3';
    gameOver.src = 'sounds/game-over.mp3';
    bite.src = 'sounds/bite.mp3';
    splash.src = 'sounds/splash.mp3';
    collect.src = 'sounds/gem.mp3';
    buzzer.src = 'sounds/buzzer.mp3';

    // The main function serves as the kickoff point for the game loop itself.
    // It handles properly calling the update and render methods.
    function main() {

        //Get our time delta information, which is required for smooth animation.
        var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

        // When the game is in play and not paused, we are rendering and updating.
        // When the game is paused, we will not update.
        if (player.score >= 0) {

            if (gamePlay) { // The game is in play.

                // Clears the start screen.
                // We need this so we are not seeing the start screen behind the board.
                ctx.clearRect(0, 0, 705, 606);

                // Renders our little world
                render();

                // We're 'disabling' update when we pause the game.
                if (pause) {
                    pauseScreen.display();
                    music.pause();
                } else {
                    update(dt);
                    music.play();
                }

            } else { // The game is not in play because user hit enter.
                startScreen(); // Draws the start screen.
                music.pause();
            }

            // Set our lastTime variable which is used to determine the time delta
            // for the next time main() is called.
            lastTime = now;

            // Use the browser's requestAnimationFrame function to call this
            // function again as soon as the browser is able to draw another frame.
            win.requestAnimationFrame(main);

        } else { // The game is over when score is less than zero. All action stops.
            gameOverScreen.display();
            music.pause();
            gameOver.play();
        }
    }

    // The init function does some initial setup that should only occur once,
    // particularly setting the lastTime variable that is required for the game loop
    function init() {
        reset(); // Calls the startScreen function, which draws start screen.
        lastTime = Date.now();
        main();
    }

    // This update function is called by main (our game loop) and itself calls all
    // of the functions which may need to update entity's data.
    function update(dt) {
        updateEntities(dt);
        player.checkCollisions();
        player.checkGems();
        player.clock(dt);
        player.checkTimer();
    }

    // This updateEntities function is called by the update function.
    // It loops through all of the objects within your allEnemies array and calls
    // their update() methods. It will then call the update function for your
    // player object.
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    // This render function initially draws the game level, then calls
    // the renderEntities and scoreBoard functions.
    function render() {

        // This array holds the relative URL to the image used
        // for that particular row of the game level.
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Loop through the number of rows and columns we've defined above
        // and, using the rowImages array, draw the correct image for that
        // portion of the "grid"
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();

        scoreBoard();
    }

    // This function is called by the render function. It is called on each game
    // tick. It then calls the render functions you have defined
    // on your gem, enemy and player entities.
    function renderEntities() {

        gem.render();

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    function reset() {
        startScreen(); // Draws the start screen
    }

    // Go ahead and load all of the images we know we're going to need to
    // draw our game level. Then set init as the callback method, so that when
    // all of these images are properly loaded our game will start.
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-horn-girl.png',
        'images/speech-bubble.png',
        'images/gem-orange.png'
    ]);
    Resources.onReady(init);

    // Assign the canvas' context object to the global variable (the window
    // object when run in a browser) so that developer's can use it more easily
    // from within their app.js files.
    global.ctx = ctx;
})(this);