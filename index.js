const { ST7789 } = require("st7789");

const Audio = 11;

const Input = {
  A: 18,
  B: 19,
  X: 17,
  Y: 16,
  UP: 23,
  DOWN: 20,
  LEFT: 22,
  RIGHT: 21,
};

class PicoSystem {
  constructor() {
    // this.init();
  }

  init() {
    // buttons
    pinMode(Input.A, INPUT_PULLUP);
    pinMode(Input.B, INPUT_PULLUP);
    pinMode(Input.X, INPUT_PULLUP);
    pinMode(Input.Y, INPUT_PULLUP);
    pinMode(Input.UP, INPUT_PULLUP);
    pinMode(Input.DOWN, INPUT_PULLUP);
    pinMode(Input.LEFT, INPUT_PULLUP);
    pinMode(Input.RIGHT, INPUT_PULLUP);
    // display
    pinMode(12, OUTPUT);
    this.backlight(true);
    this.st7789 = new ST7789();
    this.st7789.setup(board.spi(0, { sck: 6, mosi: 7, baudrate: 20000000 }), {
      width: 240,
      height: 240,
      dc: 9,
      rst: 4,
      cs: 5,
      rotation: 0,
    });
    this.gc = this.st7789.getContext("buffer");
    this.gc.clearScreen();
    this.gc.display();
  }

  input(key) {
    return 1 - digitalRead(key);
  }

  backlight(onoff) {
    digitalWrite(12, onoff ? HIGH : LOW);
  }

  tone(freq, duration) {
    tone(Audio, freq, { duration: duration });
  }
}

exports.Input = Input;
exports.Audio = Audio;
exports.PicoSystem = PicoSystem;
