
// Phaser 3 game based on your concept
const quotes = [
  // Assisi
  {
    quote: 'The dwarf with his hands on backwards',
    correct: 'Grotesque imagery',
    options: ['Grotesque imagery', 'Personification', 'Symbolism']
  },
  {
    quote: 'slumped like a half-filled sack',
    correct: 'Simile',
    options: ['Metaphor', 'Alliteration', 'Simile']
  },
  {
    quote: 'tiny twisted legs from which sawdust might run',
    correct: 'Alliteration',
    options: ['Enjambment', 'Alliteration', 'Onomatopoeia']
  },
  {
    quote: 'a priest explained how clever it was',
    correct: 'Irony',
    options: ['Irony', 'Tone', 'Hyperbole']
  },

  // Visiting Hour
  {
    quote: 'The hospital smell combs my nostrils',
    correct: 'Personification',
    options: ['Personification', 'Alliteration', 'Irony']
  },
  {
    quote: 'I will not feel, I will not feel',
    correct: 'Repetition',
    options: ['Repetition', 'Enjambment', 'Metaphor']
  },
  {
    quote: 'books that will not be read',
    correct: 'Symbolism',
    options: ['Symbolism', 'Tone', 'Irony']
  },
  {
    quote: 'distance shrinks till there is none left',
    correct: 'Metaphor',
    options: ['Simile', 'Personification', 'Metaphor']
  },

  // Brooklyn Cop
  {
    quote: 'built like a gorilla',
    correct: 'Simile',
    options: ['Metaphor', 'Simile', 'Irony']
  },
  {
    quote: 'thin tissue over violence',
    correct: 'Metaphor',
    options: ['Irony', 'Tone', 'Metaphor']
  },
  {
    quote: 'who would be him',
    correct: 'Rhetorical question',
    options: ['Rhetorical question', 'Alliteration', 'Symbolism']
  },
  {
    quote: 'see you, babe',
    correct: 'Colloquialism',
    options: ['Colloquialism', 'Imagery', 'Onomatopoeia']
  },

  // Basking Shark
  {
    quote: 'A rock where none should be',
    correct: 'Metaphor',
    options: ['Metaphor', 'Simile', 'Personification']
  },
  {
    quote: 'room-sized monster with a matchbox brain',
    correct: 'Contrast',
    options: ['Alliteration', 'Contrast', 'Metaphor']
  },
  {
    quote: 'he displaced more than water',
    correct: 'Double meaning',
    options: ['Irony', 'Double meaning', 'Tone']
  },
  {
    quote: 'shook on a wrong branch of his family tree',
    correct: 'Metaphor',
    options: ['Metaphor', 'Simile', 'Hyperbole']
  },

  // Aunt Julia
  {
    quote: 'Aunt Julia spoke Gaelic',
    correct: 'Cultural identity',
    options: ['Cultural identity', 'Tone', 'Enjambment']
  },
  {
    quote: 'she was buckets',
    correct: 'Metaphor',
    options: ['Simile', 'Metaphor', 'Personification']
  },
  {
    quote: 'absolute darkness',
    correct: 'Word choice',
    options: ['Symbolism', 'Word choice', 'Alliteration']
  },
  {
    quote: 'by the time I had learned a little',
    correct: 'Tone of regret',
    options: ['Irony', 'Tone of regret', 'Hyperbole']
  }
];

let score = 0;
let level = 1;
let health = 3;
let currentQuote;
let bullets;
let answers;
let questionText;
let scoreText;
let levelText;
let healthText;
let quoteAnswered = false;
let feedbackOverlay;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

let game = new Phaser.Game(config);

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

  questionText = this.add.text(20, 20, '', { fontSize: '18px', fill: '#fff', wordWrap: { width: 760 } });
  scoreText = this.add.text(650, 20, 'Score: 0', { fontSize: '18px', fill: '#fff' });
  healthText = this.add.text(650, 50, 'Health: 3', { fontSize: '18px', fill: '#fff' });
  levelText = this.add.text(20, 60, 'Level: 1', { fontSize: '18px', fill: '#fff' });

  const cursors = this.input.keyboard.createCursorKeys();
  const shootSound = this.sound.add('shoot');
  const correctSound = this.sound.add('correct');
  const wrongSound = this.sound.add('wrong');
  const gameOverSound = this.sound.add('gameover');

  feedbackOverlay = this.add.rectangle(400, 300, 800, 600, 0x00ff00, 0);
  feedbackOverlay.setDepth(10);

  this.input.keyboard.on('keydown-SPACE', () => {
    const bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-300);
    shootSound.play();
  });

  this.physics.add.overlap(bullets, answers, (bullet, answer) => {
    bullet.destroy();
    answer.destroy();
    if (answer.getData('correct')) {
      correctSound.play();
      score += 10;
      scoreText.setText('Score: ' + score);
      level = Math.floor(score / 50) + 1;
      levelText.setText('Level: ' + level);
      flashFeedback.call(this, 0x00ff00);
    } else {
      wrongSound.play();
      health -= 1;
      healthText.setText('Health: ' + health);
      flashFeedback.call(this, 0xff0000);
      if (health <= 0) {
        gameOverSound.play();
        alert('Game Over!');
        score = 0;
        health = 3;
        this.scene.restart();
        return;
      }
    }
    quoteAnswered = true;
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

  answers.getChildren().forEach(answer => {
    if (answer.y > 600) {
      if (answer.getData('correct')) {
        health -= 1;
        healthText.setText('Health: ' + health);
        flashFeedback.call(this, 0xff0000);
        if (health <= 0) {
          this.sound.play('gameover');
          alert('Game Over!');
          score = 0;
          health = 3;
          this.scene.restart();
          return;
        }
      }
      quoteAnswered = true;
      answer.destroy();
    }
  });

  if (quoteAnswered && answers.countActive(true) === 0) {
    quoteAnswered = false;
    nextQuestion.call(this);
  }
}

function flashFeedback(color) {
  feedbackOverlay.setFillStyle(color, 0.4);
  this.time.delayedCall(150, () => {
    feedbackOverlay.setFillStyle(color, 0);
  });
}

function nextQuestion() {
  answers.clear(true, true);
  currentQuote = Phaser.Utils.Array.GetRandom
    ? Phaser.Utils.Array.GetRandom(quotes)
    : quotes[Math.floor(Math.random() * quotes.length)];

  questionText.setText('"' + currentQuote.quote + '"');

  const shuffled = Phaser.Utils.Array.Shuffle
    ? Phaser.Utils.Array.Shuffle(currentQuote.options)
    : currentQuote.options.sort(() => Math.random() - 0.5);

  shuffled.forEach((opt, i) => {
    const x = 200 + i * 180;
    const ans = answers.create(x, 0, 'book');
    ans.setData('text', opt);
    ans.setData('correct', opt === currentQuote.correct);
    ans.setVelocityY(60 + (level - 1) * 20);  // slower base speed
    this.add.text(x - 60, 180, opt, { fontSize: '20px', fill: '#fff' });
  });
}
