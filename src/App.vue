<template>
  <div id="app">
    <h1>Monitor Ghosting Test</h1>
    <p>
    Enter the text that's moving across the screen correctly into the text field,
    then press enter. If it was correct, a new text will be generated and the speed
    increases. See how far you can make it before the text becomes too blurry to read.
    </p>

    <svg :width="svgWidth_" :height="svgHeight_">
      <rect width="100%" height="100%" :style="{fill:bgcolor.hex}" />
      <text fill="transparent" ref="textElement" :style="textStyle">{{ text }}</text>
      <text v-for="i in fitCount_"
           :key="'txt' + i"
           :x="x + (blockWidth_ * (i-1))"
           :y="svgPaddingTop"
           :style="textStyle"
           :fill="color.hex"
           alignment-baseline="hanging">{{ text }}</text>
    </svg>

    <div class="controls">
      <p>Repeat the above text here:</p>
      <input type="text" v-model="userInput" id="userInput" @keyup="
      if($event.key === 'Enter') {
        checkUserInput()
      }">
      <label>Current speed: <input type="number" v-model="speed" min=1 max=100 step=0.25></label>
      <input type="button" value="Start" @click="start" v-show="!moving">
      <input type="button" value="Stop" @click="stop" v-show="moving">
    </div>

    <toggle-box title="Customize" :open="false">
      <div class="font-config">
        <label>
        Font:
        <select v-model="fontFamily">
          <option v-for="(font, key) in fonts" :key="key" :value="key">{{ key }}</option>
        </select>
        </label>

        <label>
        Font size:
        <input type="number" v-model="fontSize" min=8 max=72>
        </label>

        <label>
        Font variation:
        <div class="radiogroup">
          <template v-for="variation in fonts[fontFamily].variations">
            <input type="radio"
                  name="fv-radios"
                  :id="variation.readable"
                  v-model="fontVariation"
                  :key="variation.readable + 'radio'"
                  :value="variation">
            <label :for="variation.readable"
                  :key="variation.readable + 'label'">
              {{ variation.readable }}
            </label>
          </template>
        </div>
        </label>

        <label>
        Letter spacing:
        <input type="number" v-model="letterSpacing" min=-3 max=50>
        </label>

        <label>
        Word spacing:
        <input type="number" v-model="textPadding" min=10 max=100>
        </label>
      </div>

      <div class="color-config">
        <span>Text color: </span>
        <span>Background color: </span>
        <chrome-colorpicker v-model="color" :disable-alpha=true></chrome-colorpicker>
        <chrome-colorpicker v-model="bgcolor" :disable-alpha=true></chrome-colorpicker>
      </div>
    </toggle-box>
  </div>
</template>

<script>
import { Chrome as chromeColorpicker } from 'vue-color';
import WebFont from 'webfontloader';
import ToggleBox from './components/toggle-box';

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
      weight: `${weight}00`,
      style: fontVariations[variant].css,
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
    ToggleBox,
  },
  data: () => ({
    fonts,
    fontFamily: 'Times New Roman',
    text: '',
    fitCount_: 1,
    blockWidth_: 0,
    svgWidth_: 100,
    svgHeight_: 100,
    svgPaddingTop: 5,
    userInput: '',
    color: { hex: '#000' },
    bgcolor: { hex: '#FFF' },
    x: 0,
    textPadding: 40,
    speed: 2,
    fontSize: 20,
    letterSpacing: 0,
    fontVariation: DecodeFVD('n4'),
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

    this.generateNewText(15);
    this.svgWidth_ = window.innerWidth;
    window.addEventListener('resize', () => {
      this.svgWidth_ = window.innerWidth;
      this.recalculateTextSize();
    });
    window.requestAnimationFrame(this.update);
  },
  watch: {
    fontFamily() {
      // When switching fonts, if the new font doesn't have the
      // currently selected fontVariation, use the first in the list
      if (!fonts[this.fontFamily].variations.find(fv => fv.fvd === this.fontVariation.fvd)) {
        this.fontVariation = fonts[this.fontFamily].variations[0];
      }
      this.recalculateTextSize();
    },
    fontSize() {
      this.recalculateTextSize();
    },
    fontVariation() {
      this.recalculateTextSize();
    },
    textPadding() {
      this.blockWidth_ = textWidth + parseInt(this.textPadding, 10);
    },
  },
  computed: {
    textStyle() {
      return {
        fontSize: this.fontSize,
        letterSpacing: this.letterSpacing,
        fontFamily: this.fontFamily,
        fontWeight: this.fontVariation.weight,
        fontStyle: this.fontVariation.style,
      };
    },
  },
  methods: {
    update() {
      if (this.moving) {
        this.x += parseFloat(this.speed) || 0;
      }
      if (this.x >= 0) {
        this.x -= this.blockWidth_;
      }
      window.requestAnimationFrame(this.update);
    },
    checkUserInput() {
      if (this.userInput === this.text) {
        this.nextLevel();
      }
    },
    nextLevel() {
      this.speed += 1;
      this.generateNewText(15);
      this.userInput = '';
    },
    generateNewText(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      const text = Array(length).fill(0)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join('');
      this.text = text;
      this.recalculateTextSize();
      this.x = -(textWidth + this.textPadding);
    },
    recalculateTextSize() {
      this.$nextTick(() => {
        const bounds = this.$refs.textElement.getBBox();
        textWidth = bounds.width;
        this.svgHeight_ = bounds.height + this.svgPaddingTop;
        this.blockWidth_ = textWidth + parseInt(this.textPadding, 10);
        this.fitCount_ = Math.ceil(this.svgWidth_ / this.blockWidth_) + 1;
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
  padding: 0px;
}
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Verdana";
  width: 800px;
  margin: 0 auto;
}
input[type=button] {
  margin-right: 5px;
  padding: 5px 10px;
}
input[type=radio] {
  display: none;
}
input[type=radio] + label {
  font-size: 14px;
  user-select: none;
  padding: 5px;
  background: #eaeaea;;
  box-shadow: inset -1px -1px 1px 0px #292929b5, 1px 1px 1px -1px #292929b5;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
.radiogroup input[type=radio] + label:first-of-type {
  border-left: 1px solid black;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.radiogroup input[type=radio] + label:last-of-type {
  border-right: 1px solid black;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
input[type=radio]:checked + label {
  background: #cacaca;
  padding-top: 7px;
  padding-bottom: 3px;
  position: relative;
  top: 2px;
  box-shadow: inset 0px 1px 1px 1px #292929b5, 1px 1px 1px -1px #292929b5;
}
.controls {
  display: grid;
  width: 300px;
  grid-gap: 10px;
  margin: 20px 0px;
}
.controls > p {
  margin: 0px;
}
.config {
  width: 600px;
  margin: 0 auto;
  padding: 10px;
}
h2 {
  margin: 10px 0px;
}
.font-config {
  margin: 5px 0px;
}
.font-config > label {
  display: grid;
  text-align: right;
  grid-template-columns: 175px max-content;
  grid-gap: 10px;
  width: 200px;
  margin-bottom: 10px;
}
.color-config {
  display: grid;
  grid-template-columns: 250px 250px;
  grid-gap: 10px;
  justify-items: center;
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
