// -----------------------------------------------------
// CANVAS SETUP
// -----------------------------------------------------
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

c.imageSmoothingEnabled = true;  // turn on smooth scaling
c.imageSmoothingQuality = 'high'; // 'low', 'medium', 'high'

const field = new Image();
field.src = "decode.png"; // path or URL to your image

const robot = new Image();
robot.src = "doveup.png"; // path or URL to your image

const keysPressed = {};

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    console.log(keysPressed); // Shows all currently pressed keys
});

function outerSquareSide(innerSide, angle) {
   
    return innerSide * (Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)));
}

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

// Resize canvas ONCE on load and whenever the window resizes
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);



function drawCircle(x, y, radius, color, lineWidth=3) {
    c.lineWidth = lineWidth;
    c.strokeStyle = textColor;
    
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2); // full circle
    c.fillStyle = color;
    c.fill();
    c.closePath();
    c.stroke();  
}


var x = (canvas.width-canvas.height)/2
var y = 0
var robot_wdith = canvas.height/8;

var vecy = 0
var vecx = 0
var rotation = 0;
var angle = 0;
// Update function (for animations)
amount = 0.6
rotation_amount = 0.006;
function update() {

    var outer = (outerSquareSide(robot_wdith, angle)-robot_wdith)/2

    if (keysPressed['w']){
        vecy-=amount;

    }
    if (keysPressed['a']){
        vecx-=amount;
        
    }
    if (keysPressed['s']){
        vecy+=amount;
        
    }
    if (keysPressed['d']){
        vecx+=amount;
        
    }
    if (keysPressed['j']){
        rotation += rotation_amount
        
    }
    if (keysPressed['l']){
        rotation -= rotation_amount
        
    }
    x += vecx
    y += vecy
    angle += rotation

    degradation = 0.08
    
    if (vecx>0){
        vecx -= degradation * Math.abs(vecx)
    }else if (vecx<0){
        vecx += degradation * Math.abs(vecx)
    }
    if (vecy>0){
        vecy -= degradation * Math.abs(vecy)
    }else if (vecy<0){
        vecy += degradation * Math.abs(vecy)
    }

    if (rotation>0){
        rotation -= degradation * Math.abs(rotation)
    }else if (rotation<0){
        rotation += degradation * Math.abs(rotation)
    }





    if (x<(canvas.width-canvas.height)/2 + outer){
        x = (canvas.width-canvas.height)/2 + outer;
        vecx = 0;
    }
    else if (x>(canvas.width-canvas.height)/2+ canvas.height - robot_wdith - outer){
        x = (canvas.width-canvas.height)/2 + canvas.height - robot_wdith - outer;
        vecx = 0;
    }

    if (y< outer){
        y = outer
        vecy = 0
    } else if (y > canvas.height-outer){
        y = canvas.height-outer;
        vecy = 0;
    }
   


   
}

// Draw function
function draw() {
  
    c.drawImage(field,(canvas.width-canvas.height)/2,0, canvas.height, canvas.height);

     // Calculate the robot's center
    const centerX = x + robot_wdith / 2;
    const centerY = y + robot_wdith / 2;

    // Save the current state
    c.save();
    

    // Move origin to robot center
    c.translate(centerX, centerY);

    // Rotate (in radians)
   
    c.rotate(angle);

    // Draw the robot image, offset by half width/height
    c.drawImage(robot, -robot_wdith / 2, -robot_wdith / 2, robot_wdith, robot_wdith);

    // Restore the canvas state
    c.restore();

    
   
   
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    update();
    draw();
}

animate();
