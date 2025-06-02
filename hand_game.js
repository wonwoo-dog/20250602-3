let video;
let handpose;
let predictions = [];
let circleX, circleY;
let score = 0;
let modelLoaded = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 handpose 模型
  handpose = ml5.handpose(video, () => {
    console.log("✅ Handpose model loaded!");
    modelLoaded = true;
  }, (err) => {
    console.error("❌ Error loading handpose model:", err);
  });

  handpose.on("predict", results => {
    predictions = results;
  });

  // 初始化第一個圓圈位置
  circleX = random(50, width - 50);
  circleY = random(50, height - 50);
}

function draw() {
  background(220);

  // 顯示攝影機影像
  image(video, 0, 0, width, height);

  // 如果模型還沒載入，顯示提示
  if (!modelLoaded) {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("正在載入模型，請稍候...", width / 2, height / 2);
    return;
  }

  // 顯示紅色圓圈目標
  fill(255, 0, 0);
  noStroke();
  ellipse(circleX, circleY, 50);

  // 顯示手部食指位置
  if (predictions.length > 0) {
    let hand = predictions[0];
    let index = hand.landmarks[8];
    let x = index[0];
    let y = index[1];

    fill(0, 255, 0);
    ellipse(x, y, 20);

    // 如果食指碰到圓圈，就加分
    if (dist(x, y, circleX, circleY) < 25) {
      score++;
      circleX = random(50, width - 50);
      circleY = random(50, height - 50);
    }
  }

  // 顯示分數
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("分數: " + score, 10, 10);
}
