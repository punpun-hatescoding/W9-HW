let fireworks = []; 
let font;
let fireworkSound;

function preload() {
  soundFormats('mp3');
  fireworkSound = loadSound('fireworks.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fireworkSound.playMode('sustain'); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 2. MOUSE PRESSED: Create a NEW firework object and add it to the list
function mousePressed() {
  // "new Firework" calls the constructor inside the class below
  let f = new Firework(mouseX, mouseY);
  fireworks.push(f);
  if (fireworkSound.isLoaded()) {
    fireworkSound.rate(random(1.5, 3));
    fireworkSound.play();
  }
}

// 3. DRAW: Loop through the list and animate everyone
function draw() {
  background(0, 25); // Slight fade effect (optional, change to 255 for solid black)

  // We loop BACKWARDS through the array. 
  // This is a safety trick when removing items from a list while looping.
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    
    f.update();  // Calculate math
    f.show();    // Draw the shape

    // If the firework is finished, remove it from the list to save memory
    if (f.isFinished()) {
      fireworks.splice(i, 1);
    }
  }
  // 2. Add the Bright Text
  push(); // Start a temporary styling state
  translate(width / 2, height / 6); // Move to TOP center of screen
  textAlign(CENTER, CENTER);
  textSize(60);           
  textFont('Candal');
  noFill();
  // Main Text Color
  fill(255, 255, 200);   
  text("HAPPY NEW YEAR", 0, 0); // Main text at center
  text("2026 ☘️", 0, 80); // Subtext below 80 pixels from main
  
  textSize(20);           
  fill(200, 240, 255); 
  text("Click Anywhere to Launch Fireworks!", 0, 140); // Instruction text at bottom 140 pixels
  pop(); // End styling state

}

// 4. THE CLASS: The Blueprint for a single firework
class Firework {
  
  constructor(targetX, targetY) {
    this.stopX = targetX;
    this.stopY = targetY;
    this.y = height; 
    this.color = color(random(255), random(255), random(255));
    
    // 1. Pick a Random Shape
    this.shapeType = random(['circle', 'heart', 'star', 'flower']);
    
    // 2. Adjust "Scatters" (Density) based on the shape
    // Complex shapes like Hearts need more points (80+) to look clear.
    // Simple circles can be random.
    if (this.shapeType === 'circle') {
       this.scatters = int(random(1, 20)) * 4;  // Lower density for circles
    } else {
       this.scatters = 80; // Fixed high density for shapes
    }

    this.steps = 20; // How long the explosion lasts
    this.angle = TWO_PI / this.scatters;
    this.currentStep = 0;
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.y -= 10; 
      if (this.y <= this.stopY) {
        this.exploded = true;
      }
    } else {
      if (this.currentStep < this.steps) {
        this.currentStep++;
      }
    }
  }

  show() {
    noStroke();
    fill(this.color);

    if (!this.exploded) {
      ellipse(this.stopX, this.y, 10, 40);
    } else {
      push(); 
      translate(this.stopX, this.stopY);
      
      // Loop through every "dot" in the explosion
      for (let j = 0; j < this.scatters; j++) {
        
        let theta = this.angle * j; // Current angle in radians
        let r = 10 * this.currentStep; // Base radius (expansion size)
        
        let x2 = 0;
        let y2 = 0;

        // 3. APPLY SHAPE MATH
        
        if (this.shapeType === 'circle') {
            // Standard Circle
            x2 = cos(theta) * r;
            y2 = sin(theta) * r;
        } 
        else if (this.shapeType === 'heart') {
            // Heart Formula
            // We scale 'r' down significantly (/15) because the formula creates large numbers
            let scale = r / 15; 
            x2 = scale * 16 * pow(sin(theta), 3);
            y2 = -scale * (13 * cos(theta) - 5 * cos(2*theta) - 2 * cos(3*theta) - cos(4*theta)); // Negative to flip upright
        }
        else if (this.shapeType === 'star') {
            // Star Formula: Varies the radius based on angle
            // (1 + sin(4 * theta)) creates 4 spikes
            let starR = r * (0.5 + 0.5 * sin(9 * theta));
            x2 = starR * cos(theta);
            y2 = starR * sin(theta);
        }
        else if (this.shapeType === 'flower') {
            // Flower Formula
            let flowerR = r * (0.8 + 0.5 * sin(5 * theta));
            x2 = flowerR * cos(theta);
            y2 = flowerR * sin(theta);
        }

     ellipse(x2, y2, random(2, 4), random(2, 4));
      }
      pop();
    }
  }

  // Helper to check if animation is done
  isFinished() {
    if (this.exploded && this.currentStep >= this.steps) {
      return true;
    }
    return false;
  }
}
