<template>
  <div class="wb-scrollBox">
    <span @click.stop="handlePrev" class="scrollLeft"><i class="iconfont-template icon-fanhui"></i></span>
    <span @click.stop="handleNext" class="scrollRight"><i class="iconfont-template icon-gengduokuozhe"></i></span>
    <div ref="scroll" class="wb-scroll">
      <div ref="scrollBody" class="wb-scroll-body" :style="moveStyle">
        <ul>
        <template v-for="(vitem, sri) in value">
          <li :ref="'itemli'+sri" :key="sri">
            <slot name="item" :index="sri" :item="vitem"></slot>
          </li>
        </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    value: {
      type: Array,
      default: function(){
        return []
      }
    },
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      currentIndex: 0, // 当前显示
      moveLength: 0, // 可移动次数
      moveStyle: {
        left: 0
      },
      moveWidth: 0, // 单个子元素所需宽度
      scrollWidth: 0,
      auto: ''
    }
  },
  watch: {
    value: function(v) {
      if (v && v.length) {
        this.$nextTick(function() {
          this.initScroll()
          console.log(1)
        })
      }
    }
  },
  created: function () {
    if (this.value && this.value.length) {
      this.$nextTick(function() {
        this.initScroll()
        console.log(1)
      })
    }
  },
  methods: {
    initScroll: function () {
      this.valueLength = this.value.length;
      this.currentIndex = 0;
      this.moveStyle.left = 0
      this.moveWidth = this.$refs.itemli0[0].clientWidth
      this.scrollWidth = this.$refs.scroll.clientWidth
      //计算子元素可移动次数（被隐藏的子元素数量）
      this.moveLength = this.value.length - parseInt(this.scrollWidth/this.moveWidth) - 1;
      this.autoPlay && this.autoPlayFUN()
    },
    autoPlayFUN: function () {
      var vm = this
      this.auto && clearInterval(this.auto)
      this.auto = setInterval(function () {
        vm.handleNext()
      }, 3000)
    },
    handlePrev: function () {
		  this.currentIndex --
		  if(this.currentIndex >= 0){
        this.moveStyle.left = -(this.moveWidth * this.currentIndex)
		  }else{
			  this.currentIndex = 0;
			  this.moveStyle.left = 0
	    }
    },
    handleNext: function () {
      this.currentIndex ++
      if(this.currentIndex < this.moveLength){
		    this.moveStyle.left = -(this.moveWidth * this.currentIndex)
		  }else{
        if (this.currentIndex > this.moveLength) {
          this.currentIndex = 0;
          this.moveStyle.left = -(this.moveWidth * this.currentIndex)
        } else {
          this.currentIndex = this.moveLength;
          this.moveStyle.left = -(this.moveWidth * this.currentIndex)
        }
      }
    }
  }
}
</script>

<style>
.wb-scrollBox {
	width: 100%;
	position: relative;
}
.wb-scroll {
	display: block;
	width: 100%;
	position: relative;
	overflow: hidden;
}

.wb-scroll .wb-scroll-body {
	display: block;
	float: left;
	position: relative;
	left: 0;
	top: 0;
	width: 1000000px;
}
.wb-scroll ul {
	display: block;
	float: left;
	list-style-type: none;
	padding: 0;
	margin: 0;
}
.wb-scroll ul li {
	display: block;
	float: left;
}
.wb-scroll::after, .wb-scroll .wb-scroll-body::after, .wb-scroll ul::after,  .wb-scroll ul li::after{
	content: '';
	display: block;
	clear: both;
	overflow: auto;
	zoom: 1;
	width: 100%;
	height: 1px;
}
.wb-scrollBox .scrollLeft, .wb-scrollBox .scrollRight, .wb-scroll .wb-scroll-body {
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

.wb-scrollBox .scrollLeft, .wb-scrollBox .scrollRight {
  position: absolute;
  top: 50%;
  display: inline-block;
  width: 30px;
  cursor: pointer;
  height: 30px;
  background-color: #555a77;
  border-radius: 50%;
  z-index: 5;
  padding: 7px;
  user-select: none;
  transform: translateY(-50%);
  color: #fff;
}
.wb-scrollBox .scrollLeft {
  left: -15px;
}
.wb-scrollBox .scrollRight {
  right: -15px;

}

.wb-scrollBox .scrollLeft:hover, .wb-scrollBox .scrollRight:hover {
	background-color: #fda322;
}
.wb-scrollBox .scrollLeft:hover .iconfont-template, .wb-scrollBox .scrollRight:hover .iconfont-template {
  color: #fff;
}
</style>
