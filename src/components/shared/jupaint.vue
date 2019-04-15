<template>
  <div>
    <span style="display: inline-block">
      <el-radio-group v-model="drawMode">
        <el-radio-button label="pencil">
          <i class="fas fa-pencil-alt"></i>
        </el-radio-button>
        <el-radio-button label="line">
          <i class="fas fa-minus"></i>
        </el-radio-button>
        <el-radio-button label="box">
          <i class="far fa-square"></i>
        </el-radio-button>
        <el-radio-button label="text">
          <i class="fas fa-font"></i>
        </el-radio-button>
      </el-radio-group>
    </span>

    <span style="display: inline-block; margin-left: 20px">
      <el-radio-group v-model="strokeColor">
        <el-radio-button label="black">
          <i class="fas fa-square" style="-webkit-text-fill-color: black"></i>
        </el-radio-button>
        <el-radio-button label="red">
          <i class="fas fa-square" style="-webkit-text-fill-color: red"></i>
        </el-radio-button>
        <el-radio-button label="blue">
          <i class="fas fa-square" style="-webkit-text-fill-color: blue"></i>
        </el-radio-button>
        <el-radio-button label="green">
          <i class="fas fa-square" style="-webkit-text-fill-color: green"></i>
        </el-radio-button>
      </el-radio-group>
    </span>

    <div ref="canvasCont" style="position: relative">
      <canvas class="canvas temp" id="canvasImg" :width="canvasSize.w" :height="canvasSize.h"></canvas>
      <canvas class="canvas" id="canvas" :width="canvasSize.w" :height="canvasSize.h"></canvas>
      <canvas
        class="canvas temp"
        id="canvasTemp"
        v-on:mousedown="handleMouseDown"
        v-on:mouseup="handleMouseUp"
        v-on:mousemove="handleMouseMove"
        :width="canvasSize.w"
        :height="canvasSize.h"
      ></canvas>
      <div
        v-bind:style="{ display: showTextFloater}"
        class="addTextFloater"
        id="addTextFloater"
        @mousemove="moveAddTextFloater"
      >
        <textarea
          v-model="textToAdd"
          v-bind:style="{ color: strokeColor, 'font-size': fontSize + 'px' }"
          class="addTextFloaterInput"
          name="name"
          rows="1"
          cols="10"
          @mousemove="moveAddTextFloater"
        ></textarea>
        <span
          style="display: inline-block; width: 92px; vertical-align: top"
          @mousemove="moveAddTextFloater"
        >
          <el-button
            class="md-icon-button md-raised md-dense"
            @click="fontSize=fontSize+4"
            @mousemove.native="moveAddTextFloater"
          >
            <i class="fas fa-font"></i>
          </el-button>
          <el-button
            class="md-icon-button md-raised md-dense"
            @mousedown.native="downAddTextFloater"
            @mouseup.native="upAddTextFloater"
            @mousemove.native="moveAddTextFloater"
          >
            <i class="fas fa-pencil-alt"></i>
          </el-button>
          <el-button
            style="margin-top: 10px"
            class="md-icon-button md-raised md-dense"
            @click="fontSize=fontSize-4"
            @mousemove.native="moveAddTextFloater"
          >
            <i class="fas fa-pencil-alt"></i>
          </el-button>
          <el-button
            style="margin-top: 10px"
            class="md-icon-button md-raised md-dense md-accent"
            @click="drawText"
            @mousemove.native="moveAddTextFloater"
          >
            <i class="fas fa-pencil-alt"></i>
          </el-button>
        </span>
        <resize-observer @notify="onResize"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ResizeObserver } from "vue-resize";
export default {
  components: {
    "resize-observer": ResizeObserver
  },
  props: ["parentWidth", "parentHeight"],
  data: function() {
    return {
      mounted: false,
      textToAdd: "",
      addTextFloater: {
        mouseDown: false,
        moveStart: {}
      },
      imageCanvas: {
        ctx: ""
      },
      mainCanvas: {
        c: "",
        ctx: "",
        w: "",
        h: ""
      },
      outputCanvas: {
        c: "",
        ctx: ""
      },
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        down: false
      },
      drawMode: "pencil",
      strokeColor: "black",
      fontSize: 12
    };
  },
  computed: {
    random() {
      return new Date().getTime();
    },
    canvasSize: function() {
      var h = this.parentHeight;
      var w = this.parentWidth;
      return {
        w: w + "px",
        h: h + "px",
        wa: w,
        ha: h
      };
    },
    showTextFloater: function() {
      if (this.drawMode === "text") {
        return "block";
      } else {
        return "none";
      }
    },
    currentMouse: function() {
      return {
        x: this.mouse.current.x,
        y: this.mouse.current.y
      };
    }
  },
  mounted: function() {
    this.mainCanvas.c = document.getElementById("canvasTemp");
    this.mainCanvas.ctx = this.mainCanvas.c.getContext("2d");
    this.imageCanvas.c = document.getElementById("canvasImg");
    this.imageCanvas.ctx = this.imageCanvas.c.getContext("2d");
    this.outputCanvas.c = document.getElementById("canvas");
    this.outputCanvas.ctx = this.outputCanvas.c.getContext("2d");
    this.mainCanvas.w = this.outputCanvas.c.style.width;
    this.mainCanvas.h = this.outputCanvas.c.style.height;
    this.mounted = true;
  },
  methods: {
    onResize: function() {
      var div = document.getElementById("addTextFloater");
      this.addTextFloater.w = div.offsetWidth;
      this.addTextFloater.h = div.offsetHeight;
    },
    draw: function(event) {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.lineTo(this.currentMouse.x, this.currentMouse.y);
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.stroke();
      }
    },

    drawLine: function(event) {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.ctx.moveTo(
          this.mouse.previous.x,
          this.mouse.previous.y
        );
        this.mainCanvas.ctx.lineTo(this.currentMouse.x, this.currentMouse.y);
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.stroke();
      }
    },

    drawBox: function(event) {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.strokeRect(
          this.mouse.previous.x,
          this.mouse.previous.y,
          this.currentMouse.x - this.mouse.previous.x,
          this.currentMouse.y - this.mouse.previous.y
        );
      }
    },

    handleMouseDown: function(event) {
      this.mouse.down = true;
      this.mouse.current = {
        x: event.offsetX,
        y: event.offsetY
      };
      this.mainCanvas.ctx.beginPath();
      this.mouse.previous.x = this.mouse.current.x;
      this.mouse.previous.y = this.mouse.current.y;
      this.mainCanvas.ctx.moveTo(this.currentMouse.x, this.currentMouse.y);
    },

    handleMouseUp: function() {
      this.mouse.down = false;
      this.imgUpdate();
      this.addTextFloater.mouseDown = false;
      this.$emit("mouseUp");
    },

    handleMouseMove: function(event) {
      this.moveAddTextFloater();
      this.mouse.current = {
        x: event.offsetX,
        y: event.offsetY
      };
      if (this.drawMode === "pencil") {
        this.draw(event);
      } else if (this.drawMode === "line") {
        this.drawLine(event);
      } else if (this.drawMode === "box") {
        this.drawBox(event);
      }
    },

    imgUpdate: function() {
      this.outputCanvas.ctx.drawImage(this.mainCanvas.c, 0, 0);
      this.mainCanvas.ctx.clearRect(
        0,
        0,
        this.canvasSize.wa,
        this.canvasSize.ha
      );
    },

    downAddTextFloater: function(event) {
      this.addTextFloater.mouseDown = true;
      this.addTextFloater.moveStart.x = event.pageX;
      this.addTextFloater.moveStart.y = event.pageY;
    },
    upAddTextFloater: function() {
      this.addTextFloater.mouseDown = false;
    },
    moveAddTextFloater: function(event) {
      if (this.addTextFloater.mouseDown) {
        event = event || window.event;
        var div = document.getElementById("addTextFloater");
        var y = event.pageY - this.addTextFloater.moveStart.y;
        var x = event.pageX - this.addTextFloater.moveStart.x;

        if (div.offsetLeft < 1) {
          div.style.left = "1px";
          this.upAddTextFloater();
          return;
        } else if (div.offsetTop < 1) {
          div.style.top = "1px";
          this.upAddTextFloater();
          return;
        } else if (
          div.offsetLeft + this.addTextFloater.w >
          this.canvasSize.wa
        ) {
          div.style.left =
            this.canvasSize.wa - this.addTextFloater.w - 1 + "px";
          this.upAddTextFloater();
          return;
        } else if (div.offsetTop + this.addTextFloater.h > this.canvasSize.ha) {
          div.style.top = this.canvasSize.ha - this.addTextFloater.h - 1 + "px";
          this.upAddTextFloater();
          return;
        }
        div.style.top = div.offsetTop + y + "px";
        div.style.left = div.offsetLeft + x + "px";
        this.addTextFloater.moveStart.y = event.pageY;
        this.addTextFloater.moveStart.x = event.pageX;
      }
    },

    drawText: function(event) {
      var div = document.getElementById("addTextFloater");
      var x = div.offsetLeft;
      var y = div.offsetTop;
      var style = this.fontSize + "px monospace";
      this.outputCanvas.ctx.font = style;
      this.outputCanvas.ctx.fillStyle = this.strokeColor;
      this.outputCanvas.ctx.textBaseline = "hanging";
      console.log(x);
      console.log(y);
      this.outputCanvas.ctx.fillText(this.textToAdd, x + 2, y + 4);
      this.drawMode = "pencil";
      var penc = document.getElementById("pencilTool");
      penc.classList.add("md-toggle");
      var text = document.getElementById("textTool");
      text.classList.remove("md-toggle");
    },
    addImage: function(file) {
      var img = document.createElement("img");
      img.setAttribute("crossOrigin", "anonymous");
      img.src =
        this.$store.state.constants.apiUrl + "/ASSETS/SCHEMA/" + file + ".png";
      img.onload = function() {
        var ratio = this.canvasSize.ha / 1400;
        var w = img.width * ratio;
        var h = this.canvasSize.ha;
        var posX = this.canvasSize.wa / 2 - w / 2;
        this.imageCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.imageCanvas.ctx.drawImage(img, posX, 0, w, h);
      }.bind(this);
    },
    setFullCanvas(data) {
      let that = this;
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = function() {
        that.imageCanvas.ctx.drawImage(img, 0, 0);
      };
      img.src =
        this.$store.state.constants.apiUrl +
        "/SCHEMAS/" +
        data +
        ".png?random=" +
        this.random;
    },
    getFullCanvas() {
      this.imageCanvas.ctx.drawImage(this.outputCanvas.c, 0, 0);
      return this.imageCanvas.c.toDataURL();
      this.imageCanvas.ctx.clearRect(0, 0);
    },
    getPainting: function() {
      this.imageCanvas.ctx.drawImage(this.outputCanvas.c, 0, 0);
      //following taken from https://stackoverflow.com/questions/11796554/automatically-crop-html5-canvas-to-contents?answertab=votes#tab-top
      var w = this.imageCanvas.c.width,
        h = this.imageCanvas.c.height,
        pix = { x: [], y: [] },
        imageData = this.imageCanvas.ctx.getImageData(
          0,
          0,
          this.imageCanvas.c.width,
          this.imageCanvas.c.height
        ),
        x,
        y,
        index;

      for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
          index = (y * w + x) * 4;
          if (imageData.data[index + 3] > 0) {
            pix.x.push(x);
            pix.y.push(y);
          }
        }
      }
      pix.x.sort(function(a, b) {
        return a - b;
      });
      pix.y.sort(function(a, b) {
        return a - b;
      });
      var n = pix.x.length - 1;

      w = pix.x[n] - pix.x[0];
      h = pix.y[n] - pix.y[0];
      var cut = this.imageCanvas.ctx.getImageData(pix.x[0], pix.y[0], w, h);

      this.imageCanvas.c.width = w + 5;
      this.imageCanvas.c.height = h + 5;
      this.imageCanvas.ctx.putImageData(cut, 0, 0);

      var dataURL = this.imageCanvas.c.toDataURL();
      return dataURL;
    }
  },
  ready: function() {
    this.mainCanvas.ctx.translate(0.5, 0.5);
    this.mainCanvas.ctx.imageSmoothingEnabled = false;
  }
}
</script>

<style scoped>
.canvas {
  border: solid 1px;
}

.temp {
  position: absolute;
  top: 0;
  left: 0;
}

.addTextFloater {
  position: absolute;
  top: 50px;
  left: 50px;
}

.addTextFloaterInput {
  border: solid 1px black;
  background-color: transparent;
}
.addTextFloaterInput:focus {
  outline: none;
}
</style>
