
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
    return Math.atan2(y2 - y1, x2 - x1); 
}



document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    console.log(keysPressed);
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


var x = (canvas.width-canvas.height)/2
var y = 0
var robot_wdith = canvas.height/8;

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



    turret = pointFromDistanceAndAngle(x+robot_wdith/2, y+robot_wdith/2, 29, turret_angle+radToDeg(angle))

    
   


   
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

    
    turretAngle = angleBetweenPoints(turret.x, turret.y, (canvas.width-canvas.height)/2 , 0) - Math.PI/2

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

