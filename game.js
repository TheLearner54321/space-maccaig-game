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

let score = 0, health = 3, level = 1;
let bullets, answers, questionText, scoreText, healthText, levelText, answerTexts = [];
let currentQuote;

function preload() {
  // preload assets
}

function create() {
  // create game objects
}

function update() {
  // update game logic
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let questionTimer;

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
  this.add.tileSprite(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 'background');
  const player = this.physics.add.image(this.scale.width / 2, this.scale.height - 50, 'ship').setCollideWorldBounds(true);
  bullets = this.physics.add.group();
  answers = this.physics.add.group();

  questionText = this.add.text(20, 20, '', { fontSize: '18px', fill: '#fff', wordWrap: { width: this.scale.width - 40 } });
  scoreText = this.add.text(this.scale.width - 150, 20, 'Score: 0', { fontSize: '16px', fill: '#fff' });
  healthText = this.add.text(this.scale.width - 150, 40, 'Health: 3', { fontSize: '16px', fill: '#fff' });
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
    answerTexts.forEach(txt => txt.destroy());
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
      } else {
        nextQuestion.call(this);
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

  // Check if any answer has moved off the screen
  answers.getChildren().forEach(answer => {
    if (answer.y > this.sys.game.config.height) {
      answer.destroy();
      answerTexts.forEach(txt => txt.destroy());
      health -= 1;
      healthText.setText('Health: ' + health);
      if (health <= 0) {
        this.sound.play('gameover');
        alert('Game Over!');
        score = 0;
        health = 3;
        this.scene.restart();
      } else {
        this.sound.play('wrong');
        nextQuestion.call(this);
      }
    }
  });

  // Check if any bullet has moved off the screen
  bullets.getChildren().forEach(bullet => {
    if (bullet.y < 0) {
      bullet.destroy();
    }
  });
}

function nextQuestion() {
  answers.clear(true, true);
  answerTexts.forEach(txt => txt.destroy());
  answerTexts = [];
  currentQuote = Phaser.Utils.Array.GetRandom(quotes);
  questionText.setText('"' + currentQuote.quote + '"');

  Phaser.Utils.Array.Shuffle(currentQuote.options).forEach((opt, i) => {
    const x = 200 + i * 200;
    const ans = answers.create(x, 0, 'book');
    ans.setData('text', opt);
    ans.setData('correct', opt === currentQuote.correct);
    ans.setVelocityY(100 + (level - 1) * 30);
    const label = this.add.text(x - 40, 120, opt, { fontSize: '12px', fill: '#fff' });
    answerTexts.push(label);
  });

  // Clear any existing timer
  if (questionTimer) {
    clearTimeout(questionTimer);
  }

  // Set a new timer for the next question
  questionTimer = setTimeout(() => {
    health -= 1;
    healthText.setText('Health: ' + health);
    if (health <= 0) {
      this.sound.play('gameover');
      alert('Game Over!');
      score = 0;
      health = 3;
      this.scene.restart();
    } else {
      this.sound.play('wrong');
      nextQuestion.call(this);
    }
  }, 1000); // 1 seconds for each question
}

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

// Resize the game when the window is resized
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
  // Adjust game elements if necessary
});
