<template>
  <div id="app">
    <svg :width="svgWidth_p" height="200">
      <rect :width="svgWidth_p" height="100" :style="{fill:bgcolor.hex}" />
      <text fill="transparent" ref="textElement">{{ text }}</text>
      <text v-for="i in fitCount_p"
           :key="'txt' + i"
           :x="x + (blockWidth_p * (i-1))"
           y="15"
           :fill="color.hex">{{ text }}</text>
    </svg>

    <div class="info">
      <h1>Monitor Motion Blur Test</h1>
      <p>
      Enter the text that see at the top correctly into the text field, then press enter.
      If it was correct, a new text will get generated and the speed increases.
      See how far you can make it before the text becomes too blurry to make out.
      </p>
    </div>
    <div class="controls">
      <p>Repeat the above text here:</p>
      <input type="text" v-model="userInput" id="userInput" @keyup="
      if($event.key === 'Enter') {
        checkUserInput()
      }">
      <label>Current speed: <input type="number" v-model="speed" min=1 max=100></label>
      <input type="button" value="Start" @click="start" v-show="!moving">
      <input type="button" value="Stop" @click="stop" v-show="moving">
    </div>
    <h2>Config</h2>
    <div class="config">
      <div class="font-config">
        <label>
        Font:
        <select v-model="font">
          <option v-for="(font, key) in fonts" :key="key" :value="key">{{ key }}</option>
        </select>
        </label>
        <label>
        Font size:
        <input type="number" v-model="fontSize" min=8 max=72>
        </label>
        <label>
        Font weight:
        <select v-model="fontVariation">
          <option v-for="variation in fonts[font].variations"
                  :key="variation.readable" :value="variation">
            {{ variation.readable }}
          </option>
        </select>
        </label>
      </div>
      <div class="color-config">
        <span>Text color: </span>
        <span>Background color: </span>
        <chrome-colorpicker v-model="color" :disable-alpha=true></chrome-colorpicker>
        <chrome-colorpicker v-model="bgcolor" :disable-alpha=true></chrome-colorpicker>
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome as chromeColorpicker } from 'vue-color';
import WebFont from 'webfontloader';

let textWidth = null;

const fontVariations = {
  i: {
    css: 'italic',
    readable: 'Italic',
  },
  n: {
    css: 'normal',
    readable: 'Normal',
  },
  o: {
    css: 'oblique',
    readable: 'Oblique',
  },
};

function DecodeFVD(fvd) {
  if (!/^[ino]+\d$/.test(fvd)) {
    throw Error(`FVD ${fvd} has the wrong format.`);
  } else {
    const variant = fvd.substring(0, 1);
    const weight = fvd.substring(1);
    return {
      readable: `${fontVariations[variant].readable} ${weight}00`,
      css: `${weight}00 ${fontVariations[variant].css}`,
      fvd,
    };
  }
}

const fonts = {
  'Times New Roman': {
    variations: [
      DecodeFVD('n4'),
      DecodeFVD('n7'),
    ],
  },
  Arial: {
    variations: [
      DecodeFVD('n4'),
      DecodeFVD('n7'),
    ],
  },
};

export default {
  name: 'App',
  components: {
    chromeColorpicker,
  },
  data: () => ({
    font: 'Times New Roman',
    fonts,
    fontSize: 20,
    fontVariation: DecodeFVD('n4'),
    text: '',
    fitCount_p: 1,
    blockWidth_p: 0,
    svgWidth_p: 100,
    userInput: '',
    color: { hex: '#000' },
    bgcolor: { hex: '#FFF' },
    x: 0,
    textPadding: 40,
    speed: 2,
    moving: true,
  }),
  mounted() {
    WebFont.load({
      classes: false,
      google: {
        families: [
          'Cormorant Garamond:300,400,700',
          'Crimson Text:400,700',
          'Indie Flower',
          'Open Sans Condensed:300,300i,700',
        ],
      },
      fontactive: (familyName, fvd) => {
        const decodedFVD = DecodeFVD(fvd);
        if (this.fonts[familyName] === undefined) {
          this.$set(this.fonts, familyName, {
            variations: [decodedFVD],
          });
        } else {
          this.fonts[familyName].variations.push(decodedFVD);
        }
      },
    });

    this.generateNewText();
    this.svgWidth_p = window.innerWidth;
    window.addEventListener('resize', () => {
      this.svgWidth_p = window.innerWidth;
      this.recalculateTextSize();
    });
    window.requestAnimationFrame(this.update);
  },
  watch: {
    font() {
      if (!fonts[this.font].variations.find(fv => fv.fvd === this.fontVariation.fvd)) {
        this.fontVariation = fonts[this.font].variations[0];
      }
      this.recalculateTextSize();
    },
    fontSize() {
      this.recalculateTextSize();
    },
    fontVariation() {
      this.recalculateTextSize();
    },
  },
  computed: {
    fontStyle() {
      return `${this.fontVariation.css} ${this.fontSize}px ${this.font}`;
    },
  },
  methods: {
    update() {
      if (this.moving) {
        this.x += parseFloat(this.speed);
      }
      if (this.x >= 0) {
        this.x -= this.blockWidth_p;
      }
      window.requestAnimationFrame(this.update);
    },
    checkUserInput() {
      if (this.userInput === this.text) {
        this.nextLevel();
      }
    },
    nextLevel() {
      this.speed += 2;
      this.generateNewText();
      this.userInput = '';
    },
    generateNewText() {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      const text = Array(20).fill(0)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join('');
      this.text = text;
      this.recalculateTextSize();
      this.x = -(textWidth + this.textPadding);
    },
    recalculateTextSize() {
      // textWidth = c.measureText(this.text).width;
      this.$nextTick(() => {
        const bounds = this.$refs.textElement.getBBox();
        textWidth = bounds.width;

        this.blockWidth_p = textWidth + this.textPadding;
        this.fitCount_p = Math.ceil(this.svgWidth_p / this.blockWidth_p) + 1;
      });
    },
    start() {
      this.moving = true;
    },
    stop() {
      this.moving = false;
    },
  },
};
// # sourceURL=App.vue
</script>

<style>
body {
  margin: 0px;
  margin-top: 120px;
  padding: 0px;
}
#app {
  font-family: "Verdana";
  width: 600px;
  margin: 0 auto;
}
svg {
  position: absolute;
  top: 0px;
  left: 0;
}
input[type=button] {
  margin-right: 5px;
  padding: 5px 10px;
}
.controls {
  display: grid;
  width: 300px;
  grid-gap: 10px;
  margin: 0 auto;
}
.controls > p {
  margin: 0px;
}
.config {
  width: 600px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px;
}
.font-config {
  margin: 20px 0px;
}
.font-config > label {
  display: grid;
  text-align: right;
  grid-template-columns: 120px max-content;
  grid-gap: 10px;
  width: 200px;
  margin-bottom: 10px;
}
.color-config {
  display: grid;
  grid-template-columns: 250px 250px;
  grid-gap: 10px;
  justify-content: center;
}
.info {
  width: 600px;
  margin: 0 auto;
}
.vc-chrome {
  display:inline-block;
}
svg > text {
  user-select: none;
}
</style>
