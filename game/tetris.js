const { Input, Audio, PicoSystem } = require("../index");
const font = require("simple-fonts/minimal");
const { BuzzerMusic } = require("buzzer-music");

const BOX_SIZE = 10;
const MAX_FPS = 60; // frame per second
const DEFAULT_DELAY = 1500;

const BOX = [
  require("./box0.bmp.json"),
  require("./box1.bmp.json"),
  require("./box2.bmp.json"),
  require("./box3.bmp.json"),
  require("./box4.bmp.json"),
  require("./box5.bmp.json"),
  require("./box6.bmp.json"),
];

// decode all bitmap for performance
BOX.forEach((b) => {
  b.data = atob(b.data);
});

const BLOCK = [
  // type-0: []
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
  ],
  // type-1: |-
  [
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 0 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
  // type-2: |_
  [
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 0 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
    ],
  ],
  // type-3: _-
  [
    [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
  ],
  // type-4: |
  [
    [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
  ],
];

const HOME_MAP = [
  [2, 2, 2, 0, 3, 3, 0, 4, 4, 4, 0, 5, 5, 0, 0, 3, 0, 6, 6],
  [0, 2, 0, 0, 3, 0, 0, 0, 4, 0, 0, 5, 0, 5, 0, 3, 0, 6, 0],
  [0, 2, 0, 0, 3, 3, 0, 0, 4, 0, 0, 5, 5, 0, 0, 3, 0, 6, 6],
  [0, 2, 0, 0, 3, 0, 0, 0, 4, 0, 0, 5, 0, 5, 0, 3, 0, 0, 6],
  [0, 2, 0, 0, 3, 3, 0, 0, 4, 0, 0, 5, 0, 5, 0, 3, 0, 6, 6],
];

const END_MAP = [
  [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
];

class Tetris extends PicoSystem {
  init() {
    super.init();
    this.gc.setFont(font);
    this.gc.setFontScale(2, 2);

    this.music = new BuzzerMusic(Audio, 16, 150);
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.scene = "home"; // home | play | end

    // 0 = empty, 1 = rigid, 2 = block
    this.map = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.mapBuffer = JSON.parse(JSON.stringify(this.map)); // deep copy
    this.rows = this.map.length;
    this.cols = this.map[0].length;
    this.block = {};

    this.updateTimer = setInterval(() => {
      if (this.scene === "play") this.update();
    }, Math.round(1000 / MAX_FPS));

    setWatch(
      () => {
        this.keydown(Input.LEFT);
      },
      Input.LEFT,
      FALLING
    );
    setWatch(
      () => {
        this.keydown(Input.RIGHT);
      },
      Input.RIGHT,
      FALLING
    );
    setWatch(
      () => {
        this.keydown(Input.UP);
      },
      Input.UP,
      FALLING
    );
    setWatch(
      () => {
        this.keydown(Input.A);
      },
      Input.A,
      FALLING
    );
    setWatch(
      () => {
        this.keydown(Input.B);
      },
      Input.B,
      FALLING
    );
    setWatch(
      () => {
        this.keydown(Input.DOWN);
      },
      Input.DOWN,
      FALLING
    );
  }

  start() {
    this.init();
    this.homeScene();
  }

  setFallTimer(delay) {
    if (this.fallTimer) {
      clearInterval(this.fallTimer);
    }
    this.fallTimer = setInterval(() => {
      if (this.scene === "play") this.fall();
    }, delay);
  }

  keydown(value) {
    if (this.scene === "home") {
      delay(100);
      this.playScene();
    } else if (this.scene === "play") {
      switch (value) {
        case Input.LEFT:
          this.move(-1, 0);
          break;
        case Input.RIGHT:
          this.move(1, 0);
          break;
        case Input.UP:
        case Input.A:
          this.rotate();
          break;
        case Input.B:
          this.drop();
          this.score += 20 - this.block.y;
          break;
        case Input.DOWN:
          this.fall();
          this.score++;
          break;
      }
    } else if (this.scene === "end") {
      delay(100);
      this.homeScene();
    }
  }

  homeScene() {
    this.scene = "home";
    this.gc.fillScreen(this.gc.color16(0, 0, 0));
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.drawBoxMap(HOME_MAP, 80);
    const text = "PRESS ANY KEY TO START";
    const m = this.gc.measureText(text);
    this.gc.drawText(Math.round((240 - m.width) / 2), 160, text);
    this.gc.display();
    this.playBGM();
    this.setFallTimer(DEFAULT_DELAY);
  }

  endScene() {
    this.scene = "end";
    this.gc.fillScreen(this.gc.color16(0, 0, 0));
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.drawBoxMap(END_MAP, 60);
    this.gc.display();
  }

  playScene() {
    seed(millis());
    this.scene = "play";
    this.stopBGM();
    for (let i = 0; i < this.rows - 1; i++) {
      for (let j = 1; j < this.cols - 1; j++) {
        this.map[i][j] = 0;
      }
    }
    this.score = 0;
    this.lines = 0;
    this.newBlock();
    this.drawBackground();
  }

  drawBoxMap(boxMap, y) {
    const x = Math.round((240 - boxMap[0].length * BOX_SIZE) / 2);
    for (let i = 0; i < boxMap.length; i++) {
      for (let j = 0; j < boxMap[0].length; j++) {
        this.gc.drawBitmap(
          j * BOX_SIZE + x,
          i * BOX_SIZE + y,
          BOX[boxMap[i][j]]
        );
      }
    }
  }

  playBGM() {
    const m1 = "5a.a.Aagaa.g.f.g.f.f.gfefd-......";
    const m2 = "a.a.A.6c.d.c.5A.a.g.g.a.g.f.f.g.a.";
    const m3 = "a.a.A.6c.d.c.5A.a.g.g.a.g.f-......";
    const m4 = "a.a.A.6c.d.c.5A.a.g.g.f.e.d-......";
    this.music.play(m1 + m1 + m2 + m3 + m2 + m4, true);
  }

  stopBGM() {
    this.music.stop();
  }

  collide(dx, dy) {
    const bs = BLOCK[this.block.type][this.block.rotation];
    for (let i = 0; i < bs.length; i++) {
      const bx = this.block.x + bs[i].x + dx;
      const by = this.block.y + bs[i].y + dy;
      if (bx >= 0 && by >= 0 && this.map[by][bx] > 0) {
        return true;
      }
    }
    return false;
  }

  move(dx, dy) {
    if (!this.collide(dx, dy)) {
      this.block.x += dx;
      this.block.y += dy;
      this.tone(400, 50);
    }
  }

  rotate() {
    this.block.rotation++;
    if (this.block.rotation > 3) this.block.rotation = 0;
    if (this.collide(0, 0)) {
      if (!this.collide(-1, 0)) {
        this.move(-1, 0);
        return;
      }
      if (!this.collide(1, 0)) {
        this.move(1, 0);
        return;
      }
      if (!this.collide(-2, 0)) {
        this.move(-2, 0);
        return;
      }
      if (!this.collide(2, 0)) {
        this.move(2, 0);
        return;
      }
      this.block.rotation--;
      if (this.block.rotation < 0) this.block.rotation = 3;
    }
    this.tone(400, 50);
  }

  fall() {
    if (this.collide(0, 1)) {
      this.landing();
      return true;
    }
    this.block.y++;
    return false;
  }

  drop() {
    while (!this.fall());
    this.tone(200, 200);
  }

  landing() {
    const bs = BLOCK[this.block.type][this.block.rotation];
    for (let i = 0; i < bs.length; i++) {
      const bx = this.block.x + bs[i].x;
      const by = this.block.y + bs[i].y;
      if (bx < 0 || by < 0) {
        this.endScene();
        return;
      }
      this.map[by][bx] = this.block.color;
    }
    this.match();
    this.newBlock();
  }

  newBlock() {
    this.block.type = Math.round(Math.random() * 4);
    this.block.rotation = Math.round(Math.random() * 3);
    const bs = BLOCK[this.block.type][this.block.rotation];
    const mx = Math.max(...bs.map((b) => b.x)) + 1;
    const my = Math.max(...bs.map((b) => b.y)) + 1;
    this.block.y = -my;
    this.block.x = Math.round((this.cols - mx) / 2);
    this.block.color = this.block.type + 2;
    this.fall();
  }

  match() {
    let fullRows = [];
    for (let i = 0; i < this.rows - 1; i++) {
      if (this.map[i].every((b) => b > 0)) {
        fullRows.push(i);
      }
    }
    if (fullRows.length > 0) {
      fullRows.sort();
      fullRows.forEach((r) => {
        this.deleteRow(r);
        this.score += 100;
        this.lines++;
      });
      if (this.lines > this.level * 10) {
        this.level++;
        const delay = DEFAULT_DELAY - (this.level - 1) * 200;
        this.setFallTimer(Math.max(delay, 100));
      }
    }
  }

  deleteRow(r) {
    for (let i = 1; i < this.cols - 1; i++) this.map[r][i] = 0;
    if (r > 0) {
      for (let i = r; i > 0; i--) {
        for (let j = 1; j < this.cols - 1; j++) {
          this.map[i][j] = this.map[i - 1][j];
          this.map[i - 1][j] = 0;
        }
      }
    }
  }

  drawBox(x, y, c) {
    if (x > -1 && y > -1) {
      const sx = x * BOX_SIZE + 20;
      const sy = y * BOX_SIZE + 15;
      this.gc.drawBitmap(sx, sy, BOX[c]);
    }
  }

  drawBackground() {
    this.gc.clearScreen();
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.drawMap(true);
    this.gc.display();
  }

  drawMap(enforce = false) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const c = this.map[i][j];
        const c0 = this.mapBuffer[i][j];
        if (enforce || c !== c0) {
          this.drawBox(j, i, c);
          this.mapBuffer[i][j] = c;
        }
      }
    }
  }

  drawBlock() {
    BLOCK[this.block.type][this.block.rotation].forEach((b) => {
      const bx = this.block.x + b.x;
      const by = this.block.y + b.y;
      this.drawBox(bx, by, this.block.color);
      if (by >= 0) this.mapBuffer[by][bx] = this.block.color;
    });
  }

  drawInfo() {
    this.gc.setFillColor(this.gc.color16(0, 0, 0));
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.gc.fillRect(160, 15, 70, 140);
    this.gc.setFontColor(this.gc.color16(128, 128, 128));
    this.gc.drawText(160, 15, "SCORE");
    this.gc.drawText(160, 65, "LINES");
    this.gc.drawText(160, 115, "LEVEL");
    this.gc.setFontColor(this.gc.color16(255, 255, 255));
    this.gc.drawText(160, 35, this.score.toString());
    this.gc.drawText(160, 85, this.lines.toString());
    this.gc.drawText(160, 135, this.level.toString());
  }

  update() {
    this.drawInfo();
    this.drawMap();
    this.drawBlock();
    this.gc.display();
  }
}

const game = new Tetris();
game.start();
