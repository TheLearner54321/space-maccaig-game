
// Space MacCaig Game - GitHub-Ready Version
const quotes = [
  { quote: 'The dwarf with his hands on backwards', correct: 'Grotesque imagery', options: ['Grotesque imagery', 'Personification', 'Symbolism'] },
  { quote: 'slumped like a half-filled sack', correct: 'Simile', options: ['Metaphor', 'Alliteration', 'Simile'] }
  // Add more quotes as needed
];

let score = 0, health = 3, level = 1;
let bullets, answers, questionText, scoreText, healthText, levelText;
let currentQuote;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ship', 'assets/ship.png');
  this.load.image('bullet', 'assets/bullet.png');
  this.load.image('book', 'assets/book.png');
  this.load.image('background', 'assets/space-bg.png');
  this.load.audio('shoot', 'assets/sounds/shoot.wav');
  this.load.audio('correct', 'assets/sounds/correct.wav');
  this.load.audio('wrong', 'assets/sounds/wrong.wav');
  this.load.audio('gameover', 'assets/sounds/gameover.wav');
}

function create() {
  this.add.tileSprite(400, 300, 800, 600, 'background');
  const player = this.physics.add.image(400, 550, 'ship').setCollideWorldBounds(true);
  bullets = this.physics.add.group();
  answers = this.physics.add.group();
  questionText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#fff' });
  scoreText = this.add.text(650, 20, 'Score: 0', { fontSize: '16px', fill: '#fff' });
  healthText = this.add.text(650, 40, 'Health: 3', { fontSize: '16px', fill: '#fff' });
  levelText = this.add.text(20, 50, 'Level: 1', { fontSize: '16px', fill: '#fff' });

  const cursors = this.input.keyboard.createCursorKeys();
  const shootSound = this.sound.add('shoot');
  const correctSound = this.sound.add('correct');
  const wrongSound = this.sound.add('wrong');
  const gameOverSound = this.sound.add('gameover');

  this.input.keyboard.on('keydown-SPACE', () => {
    const bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-300);
    shootSound.play();
  });

  this.physics.add.overlap(bullets, answers, (bullet, answer) => {
    bullet.destroy();
    if (answer.getData('correct')) {
      correctSound.play();
      score += 10;
      level = Math.floor(score / 50) + 1;
      scoreText.setText('Score: ' + score);
      levelText.setText('Level: ' + level);
      nextQuestion.call(this);
    } else {
      wrongSound.play();
      health -= 1;
      healthText.setText('Health: ' + health);
      if (health <= 0) {
        gameOverSound.play();
        alert('Game Over!');
        score = 0;
        health = 3;
        this.scene.restart();
      }
    }
    answer.destroy();
  }, null, this);

  this.updateControls = () => {
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);
  };

  nextQuestion.call(this);
}

function update() {
  this.updateControls();
}

function nextQuestion() {
  answers.clear(true, true);
  currentQuote = Phaser.Utils.Array.GetRandom(quotes);
  questionText.setText('"' + currentQuote.quote + '"');
  Phaser.Utils.Array.Shuffle(currentQuote.options).forEach((opt, i) => {
    const x = 200 + i * 200;
    const ans = answers.create(x, 0, 'book');
    ans.setData('text', opt);
    ans.setData('correct', opt === currentQuote.correct);
    ans.setVelocityY(100 + (level - 1) * 30);
    this.add.text(x - 40, 40, opt, { fontSize: '12px', fill: '#fff' });
  });
}
