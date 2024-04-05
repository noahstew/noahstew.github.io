// Vertex Shader
var VSHADER_SOURCE =
  'attribute vec3 position;' +
  'uniform mat4 Pmatrix;' +
  'uniform mat4 Vmatrix;' +
  'uniform mat4 Mmatrix;' +
  'attribute vec4 color;' +
  'varying vec4 vColor;' +
  'void main() {\n' +
  'gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);\n' +
  'vColor = color;' +
  '}\n';

// Fragment Shader
var FSHADER_SOURCE =
  'precision mediump float;' +
  'varying vec4 vColor;' +
  'void main() {\n' +
  '  gl_FragColor = vec4(vColor);\n' +
  '}\n';

// Global vars for rotation
var dragging = false; // Dragging or not
var lastX = 0 // Last position of mouse x
var lastY = 0; // Last position of mouse y
var dX = 0 // Change in x
var dY = 0; // Change in y
var currentAngle = [0, 0]; // Current angles (x-axis, y-axis) for model matrix

// Bacteria and game variables
var numOfBacteria = Math.floor(Math.random() * (8)) + 3; // Randomly generating number of bacteria 
var currentBacteria = []; // Array to store bacteria
bactRadi = [1.001, 1.002, 1.003, 1.004, 1.005, 1.006, 1.007, 1.008, 1.009, 1.010]; // Radius of bacteria (to prevent overlap)
var bactSize = 4 // Global bacteria size variable

var gameEnded = false; // Tracking if game ended
var score = 0; // Score

// Bacteria colors
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
var colorsArray = Array.from(bacteriaColors.keys()); // Assigning colors to array

// Creating bacteria
for (var i = 0; i < numOfBacteria; i++) {
  var angle1 = (Math.random() * 181 - 90);
  var angle2 = (Math.random() * 360);
  var randomColor = colorsArray[Math.floor(Math.random() * colorsArray.length)]; // Getting random color
  currentBacteria.push({ num: i, x: angle1, y: angle2, color: bacteriaColors.get(randomColor), radius: bactRadi[i] });
  colorsArray = colorsArray.filter(e => e !== randomColor);
}

function main() {
  // Retrieving <canvas> element
  var canvas = document.getElementById('webgl');

  // Getting the rendering context for WebGL
  var gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initializing shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Projection, view, and model matrices
  var projMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  var modelMatrix = new Matrix4();

  // Specify the viewing volume and view matrix
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);

  // Getting matrices from vertex shader
  var Pmatrix = gl.getUniformLocation(gl.program, 'Pmatrix');
  var Vmatrix = gl.getUniformLocation(gl.program, 'Vmatrix');
  var Mmatrix = gl.getUniformLocation(gl.program, 'Mmatrix');

  // Handling rotation
  canvas.onmousedown = function (ev) {
    // Getting mouseX and mouseY
    var x = ev.clientX;
    var y = ev.clientY;

    // Start dragging if mouse is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
  };

  // Handling when mouse is released
  canvas.onmouseup = () => dragging = false;

  // Handling when mouse is moved
  canvas.onmousemove = function (ev) {
    // Getting mouseX and mouseY
    var x = ev.clientX;
    var y = ev.clientY;

    // If dragging, change the angle representing model matrix
    if (dragging) {
      // Calculating rotation angles
      dX = 100 / canvas.height * (x - lastX); // Change in X
      dY = 100 / canvas.height * (y - lastY); // Change in Y

      // Updating current angles for model matrix
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dY, 90.0), -90.0); // If > |90|, the mouse drag gets flipped and feels unnatural
      currentAngle[1] = currentAngle[1] + dX;
    }
    // Updating last coords with current coords
    lastX = x;
    lastY = y;
  };


  // Handling when mouse is clicked
  canvas.onclick = function (ev) {
    // Getting mouseX and mouseY
    var x = ev.clientX
    var y = ev.clientY
    // Getting color of clicked pixel
    var pixelColors = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelColors);
    var r = (pixelColors[0] / 255.0).toFixed(1);
    var g = (pixelColors[1] / 255.0).toFixed(1);
    var b = (pixelColors[2] / 255.0).toFixed(1);
    var a = (pixelColors[3] / 255.0).toFixed(1);
    var color = [r, g, b, a];
    console.log(color);
    // Removing bacteria if clicked and game is ongoing
    if (!gameEnded) {
      removeBacteria(color, bactSize);
    }
  }

  function tick() {
    // Updating the model matrix based on current rotation angles
    modelMatrix.setRotate(currentAngle[0], 1, 0, 0); // Rotation around x-axis
    modelMatrix.rotate(currentAngle[1], 0, 1, 0); // Rotation around y-axis

    // Passing projection, view, and model matrices to vertex shader
    gl.uniformMatrix4fv(Pmatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(Vmatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(Mmatrix, false, modelMatrix.elements);

    // Clearing color and depth buffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Setting background color
    gl.enable(gl.DEPTH_TEST); // Enabling depth test
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Displaying game state
    displayGameState(bactSize, numOfBacteria);

    // Drawing bacteria
    var speed = 0.05;
    if (bactSize < 24) {
      draw(gl, numOfBacteria, bactSize += speed);
    } else {
      draw(gl, numOfBacteria, bactSize);
    }

    // Requesting browser to call tick
    requestAnimationFrame(tick, canvas);
  };

  tick(); // Calling tick function
}

function draw(gl, numOfBacteria) {
  // Drawing sphere
  var n = getShape(gl, true);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

  // Drawing bacteria
  for (var i = 0; i < numOfBacteria; i++) {
    n = getShape(gl, false, currentBacteria[i].radius, currentBacteria[i].color, currentBacteria[i].x, currentBacteria[i].y);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  }
}

// Removing bacteria 
function removeBacteria(color, bactSize) {
  for (var i = 0; i < numOfBacteria; i++) {
    // Getting color of bacteria
    var r = currentBacteria[i].color[0];
    var g = currentBacteria[i].color[1];
    var b = currentBacteria[i].color[2];
    var a = currentBacteria[i].color[3];

    // Remove bacteria if color matches (given leeway of 0.1 for each color component)
    if (Math.abs(r - color[0]) <= 0.1 &&
      Math.abs(g - color[1]) <= 0.1 &&
      Math.abs(b - color[2]) <= 0.1 &&
      Math.abs(a - color[3]) <= 0.1) {
      currentBacteria.splice(i, 1);
      numOfBacteria--;
      if (numOfBacteria == 0) {
        gameEnded = true;
      }
      addScore(bactSize);
      break;
    }
  }
}

// Adding score based on bacteria size
function addScore(bactSize) {
  var scoreCalc = Math.round(bactSize / 24.0 * 100 + 100); // Base score approx 100, max score approx 200
  score += scoreCalc; // Adding score
}

// Getting shape (sphere or bacteria)
function getShape(gl, isSphere, bactRadius, bactColor, angle1, angle2) {
  var latitudes = 96; // Number of latitudes
  var longitudes = 96; // Number of longitudes
  if (isSphere) {
    // Creating sphere 
    var radius = 1.0; // Radius
    var grey = [0.6, 0.6, 0.6, 1.0]; // Color of sphere
    var white = [1.0, 1.0, 1.0, 1.0]; // Color of dots
    var sphereData = sphere(radius, latitudes, longitudes, grey, white);
    var vertices = new Float32Array([...sphereData.vertices]);
    var indices = new Uint16Array([...sphereData.indices]);

    // Initializing buffers for sphere
    return initBuffers(gl, vertices, indices, sphereData);
  } else {
    // Creating bacteria
    var bacteriaData = bacteria(bactRadius, latitudes, longitudes, bactColor, angle1, angle2);
    var vertices = new Float32Array([...bacteriaData.vertices]);
    var indices = new Uint16Array([...bacteriaData.indices]);

    // Initializing buffers for bacteria
    return initBuffers(gl, vertices, indices, bacteriaData);
  }
}

function initBuffers(gl, vertices, indices, data) {
  // Creating buffers
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Writing vertices to buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  var FSIZE = data.vertices.BYTES_PER_ELEMENT; // Size of each element in bytes

  // Getting storage location of position
  var position = gl.getAttribLocation(gl.program, 'position');
  if (position < 0) {
    console.log('Failed to get the storage location of position');
    return -1;
  }

  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, FSIZE * 7, 0); // Setting up x,y,z pointer
  gl.enableVertexAttribArray(position);  // Enabling assignment of buffer object

  // Getting storage location of color
  var color = gl.getAttribLocation(gl.program, 'color');
  if (color < 0) {
    console.log('Failed to get the storage location of color');
    return -1;
  }

  gl.vertexAttribPointer(color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3); // Setting up color pointer
  gl.enableVertexAttribArray(color);  // Enabling assignment of buffer object

  return indices.length;
}

function sphere(radius, latitudes, longitudes, color, dots) {
  // Calculating vertices
  var vertices = []; // To store vertices
  for (var i = 0; i <= latitudes; i++) {
    var theta = i * Math.PI / latitudes; // Calculating theta
    for (var j = 0; j <= longitudes; j++) {
      var phi = j * 2 * Math.PI / longitudes; // Calculating phi
      // Calculating x,y,z
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.cos(theta);
      var z = radius * Math.sin(phi) * Math.sin(theta);
      // Calculating vertice color (for dots on the sphere)
      if (i % 12 == 0 && j % 12 == 0) {
        var r = dots[0];
        var g = dots[1];
        var b = dots[2];
        var a = dots[3];
      } else {
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var a = color[3];
      }
      // Pushing x,y,z to array 
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);

      // Pushing vertice color to array
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
      vertices.push(a);
    }
  }

  // Calculating indices for rendering
  var indices = [];
  for (var i = 0; i < latitudes; i++) {
    for (var j = 0; j < longitudes; j++) {
      var first = (i * (longitudes + 1)) + j; // First Vertex
      var second = first + longitudes + 1; // Second Vertex

      // Triangle one
      indices.push(first);
      indices.push(second);
      indices.push(first + 1);

      // Triangle two
      indices.push(second);
      indices.push(second + 1);
      indices.push(first + 1);
    }
  }

  // Returning vertices and indices to be accessed seperately as object
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
  };
}

function bacteria(radius, latitudes, longitudes, color, angle1, angle2) {
  // Calculating vertices
  var vertices = []; // To store vertices
  for (var i = 0; i <= latitudes; i++) {
    var theta = i * Math.PI / latitudes; // Calculating theta
    for (var j = 0; j <= longitudes; j++) {
      var phi = j * 2 * Math.PI / longitudes; // Calculating phi
      // Calculating x,y,z
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.cos(theta);
      var z = radius * Math.sin(phi) * Math.sin(theta);
      // Vertice color
      var r = color[0];
      var g = color[1];
      var b = color[2];
      var a = color[3];

      // Pushing rotated x,y,z to array 
      var rotatedVertex = rotateVertex([x, y, z], angle1, angle2);
      vertices.push(rotatedVertex[0]);
      vertices.push(rotatedVertex[1]);
      vertices.push(rotatedVertex[2]);


      // Pushing vertice color to array
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
      vertices.push(a);
      // }
    }
  }
  // Calculating indices for rendering
  var indices = [];
  for (var i = 0; i < latitudes; i++) {
    for (var j = 0; j < longitudes; j++) {
      var first = (i * (longitudes + 1)) + j; // First Vertex
      var second = first + longitudes + 1; // Second Vertex
      if (i < bactSize) {
        // Triangle one
        indices.push(first);
        indices.push(second);
        indices.push(first + 1);

        // Triangle two
        indices.push(second);
        indices.push(second + 1);
        indices.push(first + 1);
      }
    }
  }

  // Returning vertices and indices to be accessed seperately as object
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
  };
}

function rotateVertex(vertex, angle1, angle2) {
  var x = vertex[0];
  var y = vertex[1];
  var z = vertex[2];

  // Applying rotation around x-axis
  var rotatedX = x;
  var rotatedY = y * Math.cos(angle1) - z * Math.sin(angle1);
  var rotatedZ = y * Math.sin(angle1) + z * Math.cos(angle1);

  // Applying rotation around y-axis
  x = rotatedX * Math.cos(angle2) + rotatedZ * Math.sin(angle2);
  y = rotatedY;
  z = -rotatedX * Math.sin(angle2) + rotatedZ * Math.cos(angle2);

  return [x, y, z];
}

function displayGameState(bactSize, numOfBacteria) {
  if (bactSize < 24 && !gameEnded) { // If game is playing -> show score
    var scoreboard = "Score: " + score;
    document.getElementById("game-state").innerText = scoreboard;
  } else if (bactSize > 24 && numOfBacteria >= 2) { // If radius gets too big and 2+ bacteria, you lose 
    document.getElementById("game-state").innerText = "You Lost.  There is still bacteria in the dish.  Refresh to play again";
    gameEnded = true;
  } else { // Else you won and will display the score
    document.getElementById("game-state").innerText = "You Won! Score: " + score + ".  Refresh to play again";
    gameEnded = true;
  }
}