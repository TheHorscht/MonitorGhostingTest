webpackJsonp([1],{NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("7+uW"),o=n("Zzkc"),a=n("01M/"),r=n.n(a),s=null,l={i:{css:"italic",readable:"Italic"},n:{css:"normal",readable:"Normal"},o:{css:"oblique",readable:"Oblique"}};function c(t){if(/^[ino]+\d$/.test(t)){var e=t.substring(0,1),n=t.substring(1);return{readable:l[e].readable+" "+n+"00",css:n+"00 "+l[e].css,weight:n+"00",style:l[e].css,fvd:t}}throw Error("FVD "+t+" has the wrong format.")}var u={"Times New Roman":{variations:[c("n4"),c("n7")]},Arial:{variations:[c("n4"),c("n7")]}},v={name:"App",components:{chromeColorpicker:o.Chrome},data:function(){return{fonts:u,fontFamily:"Times New Roman",text:"",fitCount_:1,blockWidth_:0,svgWidth_:100,svgHeight_:100,svgPaddingTop:5,userInput:"",color:{hex:"#000"},bgcolor:{hex:"#FFF"},x:0,textPadding:40,speed:2,fontSize:20,letterSpacing:0,fontVariation:c("n4"),moving:!0}},mounted:function(){var t=this;r.a.load({classes:!1,google:{families:["Cormorant Garamond:300,400,700","Crimson Text:400,700","Indie Flower","Open Sans Condensed:300,300i,700"]},fontactive:function(e,n){var i=c(n);void 0===t.fonts[e]?t.$set(t.fonts,e,{variations:[i]}):t.fonts[e].variations.push(i)}}),this.generateNewText(),this.svgWidth_=window.innerWidth,window.addEventListener("resize",function(){t.svgWidth_=window.innerWidth,t.recalculateTextSize()}),window.requestAnimationFrame(this.update)},watch:{fontFamily:function(){var t=this;u[this.fontFamily].variations.find(function(e){return e.fvd===t.fontVariation.fvd})||(this.fontVariation=u[this.fontFamily].variations[0]),this.recalculateTextSize()},fontSize:function(){this.recalculateTextSize()},fontVariation:function(){this.recalculateTextSize()},textPadding:function(){this.blockWidth_=s+parseInt(this.textPadding)}},computed:{textStyle:function(){return{fontSize:this.fontSize,letterSpacing:this.letterSpacing,fontFamily:this.fontFamily,fontWeight:this.fontVariation.weight,fontStyle:this.fontVariation.style}}},methods:{update:function(){this.moving&&(this.x+=parseFloat(this.speed)),this.x>=0&&(this.x-=this.blockWidth_),window.requestAnimationFrame(this.update)},checkUserInput:function(){this.userInput===this.text&&this.nextLevel()},nextLevel:function(){this.speed+=2,this.generateNewText(),this.userInput=""},generateNewText:function(){var t=Array(20).fill(0).map(function(){return"abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random()*"abcdefghijklmnopqrstuvwxyz".length)]}).join("");this.text=t,this.recalculateTextSize(),this.x=-(s+this.textPadding)},recalculateTextSize:function(){var t=this;this.$nextTick(function(){var e=t.$refs.textElement.getBBox();s=e.width,t.svgHeight_=e.height+t.svgPaddingTop,t.blockWidth_=s+parseInt(t.textPadding),t.fitCount_=Math.ceil(t.svgWidth_/t.blockWidth_)+1})},start:function(){this.moving=!0},stop:function(){this.moving=!1}}},d={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("svg",{attrs:{width:t.svgWidth_,height:t.svgHeight_}},[n("rect",{style:{fill:t.bgcolor.hex},attrs:{width:t.svgWidth_,height:"100"}}),t._v(" "),n("text",{ref:"textElement",style:t.textStyle,attrs:{fill:"transparent"}},[t._v(t._s(t.text))]),t._v(" "),t._l(t.fitCount_,function(e){return n("text",{key:"txt"+e,style:t.textStyle,attrs:{x:t.x+t.blockWidth_*(e-1),y:t.svgPaddingTop,fill:t.color.hex,"alignment-baseline":"hanging"}},[t._v(t._s(t.text))])})],2),t._v(" "),t._m(0),t._v(" "),n("div",{staticClass:"controls"},[n("p",[t._v("Repeat the above text here:")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.userInput,expression:"userInput"}],attrs:{type:"text",id:"userInput"},domProps:{value:t.userInput},on:{keyup:function(e){"Enter"===e.key&&t.checkUserInput()},input:function(e){e.target.composing||(t.userInput=e.target.value)}}}),t._v(" "),n("label",[t._v("Current speed: "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.speed,expression:"speed"}],attrs:{type:"number",min:"1",max:"100"},domProps:{value:t.speed},on:{input:function(e){e.target.composing||(t.speed=e.target.value)}}})]),t._v(" "),n("input",{directives:[{name:"show",rawName:"v-show",value:!t.moving,expression:"!moving"}],attrs:{type:"button",value:"Start"},on:{click:t.start}}),t._v(" "),n("input",{directives:[{name:"show",rawName:"v-show",value:t.moving,expression:"moving"}],attrs:{type:"button",value:"Stop"},on:{click:t.stop}})]),t._v(" "),n("h2",[t._v("Config")]),t._v(" "),n("div",{staticClass:"config"},[n("div",{staticClass:"font-config"},[n("label",[t._v("\n      Font:\n      "),n("select",{directives:[{name:"model",rawName:"v-model",value:t.fontFamily,expression:"fontFamily"}],on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.fontFamily=e.target.multiple?n:n[0]}}},t._l(t.fonts,function(e,i){return n("option",{key:i,domProps:{value:i}},[t._v(t._s(i))])}))]),t._v(" "),n("label",[t._v("\n      Font size:\n      "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.fontSize,expression:"fontSize"}],attrs:{type:"number",min:"8",max:"72"},domProps:{value:t.fontSize},on:{input:function(e){e.target.composing||(t.fontSize=e.target.value)}}})]),t._v(" "),n("label",[t._v("\n      Font variation:\n      "),n("select",{directives:[{name:"model",rawName:"v-model",value:t.fontVariation,expression:"fontVariation"}],on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){return"_value"in t?t._value:t.value});t.fontVariation=e.target.multiple?n:n[0]}}},t._l(t.fonts[t.fontFamily].variations,function(e){return n("option",{key:e.readable,domProps:{value:e}},[t._v("\n          "+t._s(e.readable)+"\n        ")])}))]),t._v(" "),n("label",[t._v("\n      Letter spacing:\n      "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.letterSpacing,expression:"letterSpacing"}],attrs:{type:"number",min:"-3",max:"50"},domProps:{value:t.letterSpacing},on:{input:function(e){e.target.composing||(t.letterSpacing=e.target.value)}}})]),t._v(" "),n("label",[t._v("\n      Word spacing:\n      "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.textPadding,expression:"textPadding"}],attrs:{type:"number",min:"10",max:"100"},domProps:{value:t.textPadding},on:{input:function(e){e.target.composing||(t.textPadding=e.target.value)}}})])]),t._v(" "),n("div",{staticClass:"color-config"},[n("span",[t._v("Text color: ")]),t._v(" "),n("span",[t._v("Background color: ")]),t._v(" "),n("chrome-colorpicker",{attrs:{"disable-alpha":!0},model:{value:t.color,callback:function(e){t.color=e},expression:"color"}}),t._v(" "),n("chrome-colorpicker",{attrs:{"disable-alpha":!0},model:{value:t.bgcolor,callback:function(e){t.bgcolor=e},expression:"bgcolor"}})],1)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"info"},[e("h1",[this._v("Monitor Ghosting Test")]),this._v(" "),e("p",[this._v("\n    Enter the text that see at the top correctly into the text field, then press enter.\n    If it was correct, a new text will get generated and the speed increases.\n    See how far you can make it before the text becomes too blurry to make out.\n    ")])])}]};var p=n("VU/8")(v,d,!1,function(t){n("WH/e")},null,null).exports;i.a.config.productionTip=!1,new i.a({el:"#app",components:{App:p},template:"<App/>"})},"WH/e":function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.0d39f9117b2505ce1f5e.js.map