let video;
let handpose;
let predictions = [];
let circleX = 300;
let circleY = 300;
let score = 0;
let modelLoaded = false;
let currentQuestion = 0;
let questions = [
  { question: "What is the purpose of educational technology?", options: ["Enhance learning", "Entertainment", "Marketing"], answer: 0 },
  { question: "Which tool is used for creating digital presentations?", options: ["Photoshop", "PowerPoint", "Excel"], answer: 1 },
  { question: "What does LMS stand for?", options: ["Learning Management System", "Library Management Software", "Language Modeling System"], answer: 0 },
  { question: "Which programming language is commonly taught to beginners?", options: ["Python", "C++", "Assembly"], answer: 0 },
  { question: "What is the benefit of gamification in education?", options: ["Improves engagement", "Reduces learning", "Increases costs"], answer: 0 }
];
let questionAnswered = false;

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

  if (currentQuestion < questions.length) {
    displayQuestion();
    checkAnswer();
  } else {
    fill(0);
    textSize(32);
    text("Game Over! Your score: " + score, 10, height / 2);
  }
}

function displayQuestion() {
  let q = questions[currentQuestion];
  fill(0);
  textSize(24);
  text(q.question, 10, 50);

  for (let i = 0; i < q.options.length; i++) {
    fill(255, 0, 0);
    ellipse(100 + i * 200, 200, 50);
    fill(0);
    textSize(16);
    text(q.options[i], 80 + i * 200, 210);
  }
}

function checkAnswer() {
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexFinger = hand.landmarks[8]; // 食指尖端座標
    let x = indexFinger[0];
    let y = indexFinger[1];

    // 繪製食指尖端
    fill(0, 255, 0);
    ellipse(x, y, 20);

    // 檢查是否選擇答案
    for (let i = 0; i < questions[currentQuestion].options.length; i++) {
      let optionX = 100 + i * 200;
      let optionY = 200;
      if (dist(x, y, optionX, optionY) < 25 && !questionAnswered) {
        questionAnswered = true;
        if (i === questions[currentQuestion].answer) {
          score++;
        }
        setTimeout(() => {
          currentQuestion++;
          questionAnswered = false;
        }, 1000);
      }
    }
  }
}