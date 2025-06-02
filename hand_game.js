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

  // 初始化手勢追蹤模型
  handpose = ml5.handpose(video, modelReady, modelError);
  handpose.on("predict", results => {
    predictions = results;
  });

  // 初始化目標圓形位置
  circleX = random(50, width - 50);
  circleY = random(50, height - 50);
}

function modelReady() {
  console.log("Handpose model loaded!");
  modelLoaded = true;
}

function modelError(err) {
  console.error("Error loading Handpose model:", err);
}

function draw() {
  background(220);

  // 顯示攝影機影像
  image(video, 0, 0, width, height);

  if (!modelLoaded) {
    fill(255, 0, 0);
    textSize(24);
    text("Loading model, please wait...", 10, height / 2);
    return;
  }

  // 繪製目標圓形
  fill(255, 0, 0);
  ellipse(circleX, circleY, 50);

  // 繪製手勢追蹤結果
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexFinger = hand.landmarks[8]; // 食指尖端座標
    let x = indexFinger[0];
    let y = indexFinger[1];

    // 繪製食指尖端
    fill(0, 255, 0);
    ellipse(x, y, 20);

    // 檢查食指是否碰到目標圓形
    if (dist(x, y, circleX, circleY) < 25) {
      score++;
      circleX = random(50, width - 50);
      circleY = random(50, height - 50);
    }
  }

  // 顯示分數
  fill(0);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}
