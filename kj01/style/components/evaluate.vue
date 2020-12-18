<template>
  <div class="cover" v-show="isVisible" type="confirm2-0" style="z-index: 100000">
    <div class="ctr">
      <div class="cover-box evaluateBox" @click.stop="handleFun" :style="{width: width}">
        <div class="evaluate-close" @click.stop="handleHideEvaluate">
          <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="evaluateHead"></div>
        <div class="evaluates">
          <template v-for="(evaluate, ei) in evaluates">
            <div class="evaluate-row" :key="ei">
              <label class="vaMiddle evaluate-label">{{evaluate.label}}</label>
              <div class="vaMiddle evaluate-stars">
                <template v-for="i in 5">
                  <span @click.stop="handleChooseStar" :data-value="i" :data-index="ei" :key="ei + '_index_' + i"  class="vaMiddle iconfont" 
                  :class="{'icon-xingxing': evaluate.evaluateResult >= i, 'icon-xingxingxian': evaluate.evaluateResult < i}"></span>
                </template>
              </div>
              <div class="vaMiddle evaluate-text">
                {{evaluate.starTips[evaluate.evaluateResult]}}
              </div>
            </div>
          </template>
        </div>
        <div class="evaluatebtn">
          <button @click.stop="handleToEvaluate" type="button" typeName="evaluateSubmit">立即评价</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '600px'
    }
  },
  watch: {
    visible: function (v) {
      v ? this.addClass(): this.removeClass()
    }
  },
  computed: {
    isVisible:{
      // getter
      get: function () {
        return this.visible
      },
      // setter
      set: function (newValue) {
        this.$emit('toggle', newValue)
      }
    }
  },
  data: function () {
    return {
      evaluates: []
    }
  },
  created: function () {
    this.getDicts([
      { code: 'evaluate_item', group: 6 }
    ])
  },
  methods: {
    getDicts: function (keys) {
      var vm = this
      this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
        if (res.code === 'rest.success') {
          var evaluates = []
          res.result.forEach(function (codes, i) {
            codes.dictIInfos.forEach((item) => {
              evaluates.push({
                label: item.display,
                evaluateItem: item.value,
                evaluateResult: 0,
                starTips: [
                  '',
                  '非常差',
                  '差',
                  '一般',
                  '满意',
                  '非常满意'
                ]
              })
            })
          })
          vm.evaluates = evaluates
        }
      })
    },
    getAttributeData: function (el, keys) {
      var dataset = {}
      if (el.dataset) {
        dataset = el.dataset
      } else {
        keys.forEach(function (tkey) {
          dataset[tkey] = el.getAttribute('data-' + tkey);
        })
      }
      return dataset
    },
    addClass: function () {
      this.evaluates.forEach(function(item){
        item.evaluateResult = 0
      })
      document.body.classList.add('overflow');
    },
    removeClass: function () {
      document.body.classList.remove('overflow');
    },
    handleChooseStar: function (e) {
      var dataset = this.getAttributeData(e.target, ['value', 'index']);
      this.evaluates[dataset.index].evaluateResult = parseInt(dataset.value);
    },
    handleToEvaluate () { //提交打分
      if (this.evaluates.every(item => item.evaluateResult)) {
        this.$emit('submit', this.evaluates.map((item) => {
          return {
            evaluateItem: item.evaluateItem,
            evaluateResult: item.evaluateResult
          }
        }));
      } else {
        this.$dialog.showToast("请选择一个分数")
      }
    },
    handleFun: function () {},
    handleHideEvaluate: function () {
      this.isVisible = false
      this.removeClass()
    }
  }
}
</script>

<style>
.evaluateBox {
  border-radius: 20px;
  width: 600px;
	height: 560px;
}
.evaluateHead {
  width: 600px;
  height: 120px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: url('/style/images/evaluatehead.png') no-repeat center center;
  background-size: cover;
}
.evaluates {
  margin-top: 40px;
}
.evaluate-row {
  padding: 0 80px;
  font-size: 0;
}
.evaluate-row .evaluate-label {
	font-size: 16px;
	line-height: 60px;
	color: #343334;
  min-width: 88px;
  text-align: right;
}
.evaluate-row:first-child .evaluate-label {
  font-size: 22px;
  font-weight: bold;
}
.evaluate-row .evaluate-stars {
  margin-left: 34px;
  color: #EF5B5B;
}

.evaluate-row .evaluate-stars .iconfont {
  margin-right: 22px;
  font-size: 23px;
  cursor: pointer;
}

.evaluate-row .evaluate-text {
  margin-left: 20px;
	font-size: 16px;
	line-height: 60px;
	color: #9496a5;
}
.evaluatebtn {
  margin-top: 40px;
  text-align: center;
}
button[typeName="evaluateSubmit"]{
  width: 400px;
	height: 60px;
	background-image: linear-gradient(-18deg, 
		#ff7800 0%, 
		#ff8a00 100%);
	border-radius: 30px;
	font-size: 18px;
	line-height: 60px;
	letter-spacing: 2px;
	color: #ffffff;
}
.evaluate-close {
  position: fixed;
  right: 20px;
  top: 20px;
  color: #fff;
  cursor: pointer;
}
.evaluate-close .icon-guanbi {
  font-size: 47px;
}
</style>
