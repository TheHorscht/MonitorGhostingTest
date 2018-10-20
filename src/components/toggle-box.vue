<template>
  <div :style="isMeasuringComplete_ ? '' : 'opacity: 0'">
    <button :class="['title-tab',
                      isOpen_ ? '' : 'title-tab-closed',
                      isMeasuringComplete_ ? 'title-tab-closed-transition' : '']"
                      @click="toggle">
      {{ title }}
      <span ref="arrow" :class="arrowClasses"></span>
    </button>
    <div :class="contentClasses">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ToggleBox',
  props: {
    title: String,
    open: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isOpen_: true,
    isMeasuringComplete_: false,
  }),
  mounted() {
    const els = document.querySelectorAll('.content');
    els.forEach((element) => {
      let height = element.clientHeight;
      const paddingTop = window.getComputedStyle(element).getPropertyValue('padding-top');
      const paddingBottom = window.getComputedStyle(element).getPropertyValue('padding-bottom');
      height -= parseInt(paddingTop, 10);
      height -= parseInt(paddingBottom, 10);
      element.style.setProperty('--expanded-height', `${height}px`);
    });
    this.isOpen_ = this.open;
    this.$nextTick(() => {
      this.isMeasuringComplete_ = true;
    });
  },
  methods: {
    toggle() {
      this.isOpen_ = !this.isOpen_;
    },
  },
  computed: {
    arrowClasses() {
      const classes = ['arrow-up'];
      if (!this.isMeasuringComplete_ && !this.open) {
        classes.push('arrow-flip');
      }
      if (!this.isOpen_) {
        classes.push('arrow-flip');
      }
      if (this.isMeasuringComplete_) {
        classes.push('arrow-transition-enabled');
      }
      return classes;
    },
    contentClasses() {
      const classes = ['content'];
      if (this.isMeasuringComplete_) {
        if (!this.isOpen_) {
          classes.push('content-closed');
        } else {
          classes.push('content-open');
        }
        classes.push('content-transition-enabled');
      }
      return classes;
    },
  },
};
</script>
<style scoped>
.title-tab {
  display: inline-block;
  position: relative;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  top: 0px;
  border: 1px solid #00000088;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
  padding: 2px 5px;
}
.title-tab-closed {
  border-bottom: 1px solid #00000088;
  border-radius: 2px 2px 2px 2px;
}
.title-tab-closed-transition {
  transition: border-bottom 0ms 300ms linear;
}
.content {
  border-radius: 0 2px 2px 2px;
  overflow: hidden;
}
.content-transition-enabled {
  transition: all 300ms ease-in-out;
}
.content-open {
  height: var(--expanded-height);
  padding: 20px 5px;
  border: 1px solid #00000088;
  box-shadow: 0px 8px 10px -5px #4848488c;
  transition: all 300ms ease-in-out,
              padding 150ms 150ms linear,
              border 0ms linear;
}
.content-closed {
  height: 0px;
  padding: 0px 5px;
  border: 0px solid #00000088;
  box-shadow: 0px 0px 0px 0px #4848488c;
  transition: all 300ms ease-in-out,
              padding 150ms 150ms linear,
              border 0ms 300ms linear;
}
.arrow-up {
  display: inline-block;
  position: relative;
  top: -2px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid black;
  transform: rotateX(0deg);
}
.arrow-transition-enabled {
  transition: transform 200ms linear;
}
.arrow-flip {
  transform: rotateX(180deg);
}
</style>
