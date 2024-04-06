// Vertex Shader
var VERTEX_SHADER_SOURCE =
    ['attribute vec4 a_Position;',
        'attribute vec4 a_Color;',
        'varying vec4 v_Color;',
        'void main() {',
        'gl_Position = a_Position;',
        'v_Color = a_Color;',
        '}'].join('\n'); // .join('\n') learned in youtube webGL tutorial

// Fragment Shader
var FRAGMENT_SHADER_SOURCE =
    ['precision mediump float;',
        'varying vec4 v_Color;',
        'void main() {',
        'gl_FragColor = v_Color;',
        '}'].join('\n');

// Global Variables
var GROWING_RATE = 0.001; // Growth Rate
var bacteriaData = []; // Stores the bacteria which are created
var gameEnded = false; // Check if game is ended
var score = 0; // Players score

function main2d() {
    // Retrieving <canvas> element
    var canvas = document.getElementById("webgl");
    // Getting render context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get rendering context for WebGL');
        return;
    }

    // Initializing shaders
    if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
    }

    // Writing vertices positions to vertex shader
    var currentRadius = 0.05; // current radius of bacteria
    var numberOfVertices = 360;// number of vertices to be drawn for triangle fan
    var numOfBacteria = Math.floor(Math.random() * (8)) + 3; // Randomly generate 3-10 bacteria circles

    // Pass necessary variables into vertex initialization, n represents the total number of vertices to be passed to draw arrays
    var n = initVertexBuffers(gl, numberOfVertices, numOfBacteria, currentRadius);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Mouse clicked event handling
    canvas.onmousedown = function (ev) {
        numOfBacteria = click(ev, canvas, currentRadius, numOfBacteria, bacteriaData);
    }

    // Specify color for clearing canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // tick function for animation to be called.  
    var tick = function () {
        // Updating bacteria radius
        currentRadius = animate(gl, numberOfVertices, numOfBacteria, currentRadius);

        // Growing bacteria until bacteria radius gets to big
        if (currentRadius < 0.2) {
            draw(gl, numberOfVertices, numOfBacteria); // Drawing vertices
        }
        // Updating scoreboard
        displayGameState2d(currentRadius, numOfBacteria);
        // Request browser to call tick
        requestAnimationFrame(tick);
    }

    tick();  // Calling tick function
}

function initVertexBuffers(gl, numberOfVertices, numOfBacteria, currentRadius) {
    var mainRadius = 0.8; // Radius of white background circle
    var totalNumOfVertices = numberOfVertices; // Updating total number of vertices to be return
    var white = [1.0, 1.0, 1.0, 1.0]; // Color white
    // Making Circle
    var vertices = circle(mainRadius, numberOfVertices, white);

    // Creating buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create background buffer');
        return -1;
    }
    // Bacteria Circle
    var bacteriaSpawnSize = currentRadius; // Setting size to current bacteria radius size
    // Creating hash map of random colors to be picked from
    var bacteriaColors = new Map();
    bacteriaColors.set('Red', [1.0, 0.0, 0.0, 1.0]); // Red (1)
    bacteriaColors.set('Blue', [0.0, 1.0, 0.0, 1.0]); // Blue (2)
    bacteriaColors.set('Green', [0.0, 0.0, 1.0, 1.0]); // Green (3)
    bacteriaColors.set('Yellow', [1.0, 1.0, 0.0, 1.0]); // Yellow (4)
    bacteriaColors.set('Cyan', [0.0, 1.0, 1.0, 1.0]); // Cyan (5)
    bacteriaColors.set('Magenta', [1.0, 0.0, 1.0, 1.0]); // Magenta (6)
    bacteriaColors.set('Purple', [0.5, 0.0, 1.0, 1.0]); // Purple (7)
    bacteriaColors.set('Orange', [1.0, 0.5, 0.0, 1.0]); // Orange (8)
    bacteriaColors.set('Mint', [0.6, 1.0, 0.6, 1.0]); // Mint (9)
    bacteriaColors.set('Pink', [1.0, 0, 0.5, 1.0]); // Pink (10)

    // For accessing random colors
    var colorsArray = Array.from(bacteriaColors.keys());

    // For first time generating circles, adding bacteria data to its array
    if (bacteriaData.length == 0) {
        // Getting random angles
        for (var i = 0; i < numOfBacteria; i++) {
            // Calculating random position
            var randomAngle = Math.random() * 2 * Math.PI;
            var randomX = mainRadius * Math.cos(randomAngle);
            var randomY = mainRadius * Math.sin(randomAngle);
            // Setting random color 
            var randomColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]; // Getting random color
            colorsArray = colorsArray.filter(e => e !== randomColor); // Removing random color from array so it cant be picked again
            var newVertices = bacteriaCircle(randomX, randomY, bacteriaSpawnSize, numberOfVertices, bacteriaColors.get(randomColor)); // Getting new bacteria vertices
            totalNumOfVertices += numberOfVertices; // Adding number of vertices created to total
            vertices = new Float32Array([...vertices, ...newVertices]);  // Combining old vertices array with new vertices
            // Add the random x, random y and random color to a bacteriaData data structure 
            bacteriaData.push({ x: randomX, y: randomY, color: randomColor }); // Adding bacteria data to the array
        }
    } else {
        // Load bacteriaData to create bacteriaCircles of them and put into vertices the same way as above.
        for (var i = 0; i < bacteriaData.length; i++) {
            var data = bacteriaData[i]; // Loading bacteria data
            var newVertices = bacteriaCircle(data.x, data.y, bacteriaSpawnSize, numberOfVertices, bacteriaColors.get(data.color));
            totalNumOfVertices += numberOfVertices; // Adding number of vertices created to total
            vertices = new Float32Array([...vertices, ...newVertices]); // Adding new bacteria data to the array
        }
    }
    // Binding buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Writing data to buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assigning buffer object to shader variables
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get location of attribute position')
        return -1;
    }
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get location of attribute color')
        return -1;
    }

    // Assigning buffer object to position
    const stride = 2 * Float32Array.BYTES_PER_ELEMENT + 4 * Float32Array.BYTES_PER_ELEMENT; // Calculating stride  
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, stride, 0); // Sending x and y 
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT); // Sending rgba

    // Enabling assignment to position
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    return totalNumOfVertices; // Return total number of vertices created
}


function circle(radius, numberOfVertices, color) {
    var vertices = new Float32Array((numberOfVertices) * 6); // Array holding circle vertices

    // Generating the circle
    for (var i = 0; i < numberOfVertices; i++) {
        var theta = (i / numberOfVertices) * 2 * Math.PI; // Current angle
        var x = radius * Math.cos(theta); // x pos
        var y = radius * Math.sin(theta); // y pos
        var index = i * 6; // index for storing in vertex array
        vertices[index] = x; // Storing x
        vertices[index + 1] = y; // Storing y
        vertices[index + 2] = color[0];// Storing r
        vertices[index + 3] = color[1];// Storing g
        vertices[index + 4] = color[2];// Storing b
        vertices[index + 5] = color[3];// Storing a
        console.log(vertices[index + 2]);
    }
    return vertices; // Returning generated vertices
}


function bacteriaCircle(x, y, radius, numberOfVertices, color) {
    var vertices = new Float32Array(numberOfVertices * 6); // Array holding circle vertices
    for (var i = 0; i <= numberOfVertices; i++) {
        var theta = (i / numberOfVertices) * 2 * Math.PI; // Current angle
        var new_x = radius * Math.cos(theta) + x; // getting new x pos
        var new_y = radius * Math.sin(theta) + y; // getting new y pos
        var index = i * 6; // index for storing in vertex array
        vertices[index] = new_x; // Updating x pos
        vertices[index + 1] = new_y; // Updating y pos
        vertices[index + 2] = color[0];// Storing r
        vertices[index + 3] = color[1];// Storing g
        vertices[index + 4] = color[2];// Storing b
        vertices[index + 5] = color[3];// Storing a
    }

    return vertices; // Returning generated vertices
}

function draw(gl, numberOfVertices, numOfBacteria) {

    // Clearing canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Drawing a background circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices);

    // Drawwing bacteria circles
    for (var i = 0; i < numOfBacteria; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, (i + 1) * numberOfVertices, numberOfVertices - 1);
    }

}


function animate(gl, numberOfVertices, numOfBacteria, currentRadius) {
    // Calculating current radius
    var n = initVertexBuffers(gl, numberOfVertices, numOfBacteria, currentRadius);

    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    return currentRadius += GROWING_RATE; // Return new radius size
}

// Game Logic 
function displayGameState2d(currentRadius, numOfBacteria) {
    if (currentRadius < 0.2 && !gameEnded) { // If game is playing -> show score
        var scoreboard = "Score: " + score;
        document.getElementById("game-state").innerText = scoreboard;
    } else if (currentRadius > 0.2 && numOfBacteria >= 2) { // If radius gets too big and 2+ bacteria, you lose 
        document.getElementById("game-state").innerText = "You Lost.  There is still bacteria in the dish.  Refresh to play again";
        gameEnded = true;
    } else { // Else you won and will display the score
        document.getElementById("game-state").innerText = "You Won! Score: " + score + ".  Refresh to play again";
        gameEnded = true;
    }

}

function click(ev, canvas, currentRadius, numOfBacteria, bacteriaData) {
    // If game is done, dont register click
    console.log(gameEnded);
    if (gameEnded) {
        return numOfBacteria;
    }
    // Getting x and y coordinates of click
    var x = ev.clientX;
    var y = ev.clientY;

    // Adjusting for webgl coordinates
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    for (var i = numOfBacteria - 1; i >= 0; i--) { // Start at highest so the bacteria on top removes first
        // For each click check if click is in a circle
        if (isMouseInCircle(x, y, bacteriaData[i].x, bacteriaData[i].y, currentRadius)) {
            bacteriaData.splice(i, 1); // Remove the bacteria if thats the case
            numOfBacteria--; // Decrement numOfBacteria
            var scoreCalculation = Math.round((1 + currentRadius * 5) * 100); // Score calculated dynamically by based on current radius rewarding player for letting bacteria grow bigger
            score += scoreCalculation; // Adding to score
            if (numOfBacteria == 0) { // End game if no bacteria left
                displayGameState2d(currentRadius, numOfBacteria); // Update game state
                gameEnded = true; // Set gameEnded to stop game
            }
        }
    }
    return numOfBacteria; // return number of bacteria
}

function isMouseInCircle(x, y, circleX, circleY, radius) {
    // Calculating distance between mouse coordinates and circle center
    var distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));
    return distance < radius; // Returning if its in the circle or not
}