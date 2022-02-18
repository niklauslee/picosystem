# PicoSystem

![picosystem](https://github.com/niklauslee/picosystem/blob/main/images/picosystem.jpg?raw=true)

A Kaluma library for Pimoroni's [PicoSystem](https://shop.pimoroni.com/products/picosystem), pocket-sized handheld gaming console.

- __BOOTSEL__ : Keep pressing __Button X__ and turn on power.
- __SKIP CODE LOADING__ : Keep pressing __Left Button__ and turn on power. (Don't want to load JavaScript code stored in the flash)

# Usage

Here is some code examples:

```js
const {PicoSystem, Input} = require('picosystem');
const pico = new PicoSystem();

// Initialize
pico.init();

// Graphics
pico.gc.setFillColor(pico.gc.color16(255, 255, 255));
pico.gc.fillRect(0, 0, 240, 240);
pico.gc.display();

// Buttons
// - synchronous
let a = pico.input(Input.A);
console.log(a); // 1 = on, 0 = off
// - asynchronous
setWatch(() => {
  console.log('A clicked');
}, Input.A, FALLING);

// Sound
pico.tone(400, 1000); // 400Hz 1sec
```

# Sample Game (Tetris)

Tetris is provided as a sample game in `game/tetris.js`.

```sh
kaluma flash ./game/tetris.js --bundle --port <port>
```

![tetris](https://github.com/niklauslee/picosystem/blob/main/images/tetris.jpg?raw=true)

# API

## Class: PicoSystem

A class for PicoSystem.

### new PicoSystem()

Create an instance of PicoSystem class.

```js
const {PicoSystem} = require('picosystem');
const pico = new PicoSystem();
pico.init();
// ...
```

### picosystem.gc

- `<BufferedGraphicContext>` An instance of `BufferedGraphicContext` for the LCD display.

### picosystem.init()

Initialize the PicoSystem.

### picosystem.input(pin)

- **`pin`** `<number>` The pin number to read state.

Read the state of the input button.

### picosystem.backlight(onoff)

- **`onoff`** `<boolean>` Turn on or off the LCD's backlight.

### picosystem.tone(freq, duration)

- **`freq`** `<number>` Frequency.
- **`duration`** `<number>` Time duration.

Generate sound on the PicoSystem's buzzer.

## Object:Input

### Input.A

- `<number>` The pin number for Button A.

### Input.B

- `<number>` The pin number for Button B.

### Input.X

- `<number>` The pin number for Button X.

### Input.Y

- `<number>` The pin number for Button Y.

### Input.UP

- `<number>` The pin number for the joypad up.

### Input.DOWN

- `<number>` The pin number for the joypad down.

### Input.LEFT

- `<number>` The pin number for the joypad left.

### Input.RIGHT

- `<number>` The pin number for the joypad right.

## Audio

- `<number>` The pin number for the PicoSystem' buzzer.
