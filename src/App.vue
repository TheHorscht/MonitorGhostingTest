<template>
  <div id="app">
    <canvas ref="canvas"></canvas>

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
          <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
        </select>
        </label>
        <label>
        Font size:
        <input type="number" v-model="fontSize" min=8 max=72>
        </label>
        <label>
        Font weight:
        <select v-model="fontWeight">
          <option v-for="fontWeight in fontWeights" :key="fontWeight" :value="fontWeight">{{ fontWeight }}</option>
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
import { Chrome as chromeColorpicker } from "vue-color";

let c;
let w, h = 100;
let textWidth = null;
let fonts = [
  "Times New Roman",
  "Arial",
];
let fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export default {
  name: "App",
  components: {
    chromeColorpicker 
  },
  data: () => ({
    font: fonts[0],
    fonts, fontWeights,
    fontSize: 20,
    fontWeight: fontWeights[4],
    text: "gg",
    userInput: "",
    color: { hex:"#000" },
    bgcolor: { hex:"#FFF" },
    x: 0,
    textPadding: 40,
    speed: 2,
    moving: true,
  }),
  mounted() {
    c = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.width = w = window.innerWidth;
    this.$refs.canvas.height = h = parseInt(this.fontSize) + 20;
    this.recalculateTextSize();
    this.generateNewText();
    window.requestAnimationFrame(this.draw);
  },
  watch: {
    font() {
      this.recalculateTextSize();
    },
    fontSize() {
      this.recalculateTextSize();
      this.$refs.canvas.height = h = parseInt(this.fontSize, 10) + 20;
    },
    fontWeight() {
      this.recalculateTextSize();
    },
  },
  computed: {
    fontStyle() {
      return `${this.fontWeight} normal ${this.fontSize}px ${this.font}`;
    }
  },
  methods: {
    draw() {
      c.fillStyle = this.bgcolor.hex;
      c.fillRect(0, 0, w, h);
      c.fillStyle = this.color.hex;
      c.font = this.fontStyle;
      c.textBaseline = "top";
      let blockWidth = textWidth + this.textPadding;
      let fitCount = Math.ceil(window.innerWidth / blockWidth);
      for(let i = 0; i < fitCount + 1; i++) {
        c.fillText(this.text, this.x + (i * blockWidth), 10);
      }
      if(this.moving) {
        this.x += parseFloat(this.speed);
      }
      if(this.x + blockWidth >= blockWidth) {
        this.x -= blockWidth;
      }
      window.requestAnimationFrame(this.draw);
    },
    checkUserInput() {
      if(this.userInput === this.text) {
        this.nextLevel();
      }
    },
    nextLevel() {
      this.speed += 2;
      this.generateNewText();
      this.userInput = "";
    },
    generateNewText() {
      let characters = "abcdefghijklmnopqrstuvwxyz";
      let text = Array(20).fill(0)
                 .map(() => characters[Math.floor(Math.random() * characters.length)])
                 .join("");
      this.text = text;
      this.recalculateTextSize();
      this.x = -(textWidth + this.textPadding);
    },
    recalculateTextSize() {
      c.font = this.fontStyle;
      textWidth = c.measureText(this.text).width;
    },
    start() {
      this.moving = true;
    },
    stop() {
      this.moving = false;
    }
  }
};
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
label {
/*   display: grid;
  text-align: right;
  grid-template-columns: 80px auto;
  grid-gap: 10px;
  width: 300px;
  margin-bottom: 10px; */
}
canvas {
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
</style>
