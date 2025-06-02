let video;
let handpose;
let predictions = [];

let questions = [
  "什麼是教育科技？",
  "教育科技的例子？",
  "教育科技的優點？",
  "教育科技有挑戰嗎？",
  "你最喜歡哪種教育科技？"
];
let currentQuestion = 0;
let answered = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Handpose model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    drawHand(predictions[0].landmarks);
    checkGesture(predictions[0].landmarks);
  }

  fill(255);
  textSize(20);
  text(questions[currentQuestion], 10, height - 30);
}

function drawHand(landmarks) {
  for (let i = 0; i < landmarks.length; i++) {
    const [x, y] = landmarks[i];
    fill(0, 255, 0);
    ellipse(x, y, 10, 10);
  }
}

function checkGesture(landmarks) {
  if (answered) return;

  // 偵測比 "大拇指向上" 手勢
  let thumbTip = landmarks[4];
  let indexTip = landmarks[8];

  if (thumbTip[1] < indexTip[1] - 50) {
    answered = true;
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        currentQuestion = 0;
      }
      answered = false;
    }, 2000);
  }
}
