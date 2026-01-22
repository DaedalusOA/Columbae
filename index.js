
// -----------------------------------------------------
// CANVAS SETUP
// -----------------------------------------------------
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

c.imageSmoothingEnabled = true;  
c.imageSmoothingQuality = 'high'; 

const field = new Image();
field.src = "decode.png"; 

const robot = new Image();
robot.src = "noTurret.png"; 

const turret_img = new Image();
turret_img.src = "turret.png"; 

const keysPressed = {};

function angleBetweenPoints(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1); // radians
}

function applyDeadzone(value, deadzone = 0.1) {
    return Math.abs(value) < deadzone ? 0 : value;
}


document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
   
});
window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});
window.addEventListener("gamepaddisconnected", (e) => {
  console.log(
    "Gamepad disconnected from index %d: %s",
    e.gamepad.index,
    e.gamepad.id,
  );
});

const gamepads = {};

function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connected) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

window.addEventListener("gamepadconnected", (e) => {
  gamepadHandler(e, true);
});
window.addEventListener("gamepaddisconnected", (e) => {
  gamepadHandler(e, false);
});

window.addEventListener("gamepadconnected", (e) => {
  const gp = navigator.getGamepads()[e.gamepad.index];
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gp.index,
    gp.id,
    gp.buttons.length,
    gp.axes.length,
  );
});


function pointFromDistanceAndAngle(x0, y0, distance, angleDeg) {
    const angleRad = angleDeg * (Math.PI / 180);
    const x = x0 + distance * Math.cos(angleRad);
    const y = y0 + distance * Math.sin(angleRad);
    return { x, y };
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

function outerSquareSide(innerSide, angle) {
   
    return innerSide * (Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)));
}

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


function drawCircle(ctx, x, y, radius, fillColor = 'white', strokeColor = 'black', lineWidth = 2) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2); // full circle
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.closePath();
}

var field_width = canvas.width;


var x = (canvas.width-canvas.height)/2
var y = 0
var robot_wdith =field_width/8;

var vecy = 0
var vecx = 0
var rotation = 0;
var angle = 0;
var turret;
var turret_angle = -49;
var turretwid = robot_wdith/2
var turretAngle = 0;

// Update function (for animations)
amount = 0.6
rotation_amount = 0.006;

function update() {
    const pads = navigator.getGamepads();
    const gp = pads[0]; // first connected controller

    if (gp) {
        // Left stick = movement
        const lx = applyDeadzone(gp.axes[0]);
        const ly = applyDeadzone(gp.axes[1]);

        vecx += lx * amount;
        vecy += ly * amount;

        // Right stick X = rotation
        const rx = applyDeadzone(gp.axes[2]);
        rotation -= rx * rotation_amount ;
    }
    

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





   var bounce = 0.8
    if (y< outer){
        y = outer
        vecy *= -bounce
    } else if (y > canvas.height-outer-robot_wdith){
        y = canvas.height-outer-robot_wdith;
        vecy *= -bounce
    }

    if (x< outer){
        x = outer
        vecx *= -bounce
    } else if (x > canvas.width-outer-robot_wdith){
        x = canvas.width-outer-robot_wdith;
        vecx *= -bounce
    }



    turret = pointFromDistanceAndAngle(x+robot_wdith/2, y+robot_wdith/2, 29, turret_angle+radToDeg(angle))

    

    
   


   
}

// Draw function
function draw() {
  
    c.drawImage(field,0,0, field_width, field_width);

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

    
    turretAngle = angleBetweenPoints(turret.x, turret.y, 30 , 30) - Math.PI/2

    const turretCenterX = turret.x;
    const turretCenterY = turret.y;

   

    c.save();
    c.translate(turretCenterX, turretCenterY);
    c.rotate(turretAngle); // turret rotation in radians
    c.drawImage(turret_img, -turretwid / 2, -turretwid / 2, turretwid, turretwid);
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

