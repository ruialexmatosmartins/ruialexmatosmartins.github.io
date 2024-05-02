let circles = [];
let selectedCircle = null;
let centralCircle;

function setup() {
  createCanvas(windowWidth / 2, windowHeight / 2);
  centralCircle = new Circle(width / 2, height / 2, "Me", 80, false); // Central circle, not floating
  textFont('Helvetica');

  let words = ["one", "two", "three", "four", "five"];
  for (let word of words) {
    let safePlacement = false;
    while (!safePlacement) {
      let x = random(60, width - 60);
      let y = random(60, height - 60);
      let newCircle = new Circle(x, y, word, 60, true); // Peripheral circles, floating
      if (!newCircle.overlapsAny([...circles, centralCircle])) {
        circles.push(newCircle);
        safePlacement = true;
      }
    }
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(2);

  // Update and check for collisions among all circles
  let allCircles = [...circles, centralCircle];
  for (let i = 0; i < allCircles.length; i++) {
    for (let j = i + 1; j < allCircles.length; j++) {
      allCircles[i].checkCollision(allCircles[j]);
    }
  }

  // Apply floating effect and update positions
  for (let circle of circles) {
    if (!selectedCircle || circle !== selectedCircle) {
      circle.float();
    }
    circle.update();
  }

  // Draw lines to the central circle and display all circles
  for (let circle of circles) {
    line(circle.x, circle.y, centralCircle.x, centralCircle.y);
  }
  centralCircle.display(); // Display central circle without updating its position
  for (let circle of circles) {
    circle.display();
  }
}

// Mouse interaction functions remain unchanged

class Circle {
  constructor(x, y, word, diameter, shouldFloat) {
    this.x = x;
    this.y = y;
    this.word = word;
    this.diameter = diameter;
    this.shouldFloat = shouldFloat; // Determines if the circle should float
    this.velX = random(-0.5, 0.5);
    this.velY = random(-0.5, 0.5);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  isMouseOver() {
    return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2;
  }

  update() {
    if (this.shouldFloat) {
      this.x += this.velX;
      this.y += this.velY;

      // Reverse direction upon hitting canvas boundaries
      if (this.x - this.diameter / 2 < 0 || this.x + this.diameter / 2 > width) {
        this.velX *= -1;
      }
      if (this.y - this.diameter / 2 < 0 || this.y + this.diameter / 2 > height) {
        this.velY *= -1;
      }
    }
  }

  float() {
    // Apply a gentle floating effect
    this.velX += random(-0.05, 0.05);
    this.velY += random(-0.05, 0.05);

    // Keep the velocity small for gentle floating
    this.velX = constrain(this.velX, -0.5, 0.5);
    this.velY = constrain(this.velY, -0.5, 0.5);
  }

  display() {
    fill(0);
    stroke(255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.word, this.x, this.y);
  }

  checkCollision(other) {
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance < (this.diameter / 2 + other.diameter / 2)) {
      // Simple elastic collision reaction
      let angle = atan2(dy, dx);
      let targetX = this.x + cos(angle) * (this.diameter / 2 + other.diameter / 2);
      let targetY = this.y + sin(angle) * (this.diameter / 2 + other.diameter / 2);
      let ax = (targetX - other.x) * 0.05;
      let ay = (targetY - other.y) * 0.05;
      this.velX -= ax;
      this.velY -= ay;
      other.velX += ax;
      other.velY += ay;
    }
  }

  overlaps(other) {
    return dist(this.x, this.y, other.x, other.y) < (this.diameter + other.diameter) / 2;
  }

  overlapsAny(others) {
    return others.some(other => this.overlaps(other));
  }
}
