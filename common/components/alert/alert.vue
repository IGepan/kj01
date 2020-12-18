<template>
  <div>
    <div class="cover toast" v-if="type=='toast'">
      <div class="ctr">
        <div class="tips" v-text="texts"></div>
      </div>
    </div>
    <div class="cover" v-if="type=='alert'||type=='confirm'">
      <div class="ctr">
        <div class="alert warning" v-if="type=='alert'">
          <div class="clear">
            <div class="icon">
              <i class="iconfont icon-jinggao"></i>
              <i class="iconfont icon-cuowu"></i>
            </div>
            <div class="content">
              <div class="title" v-text="title"></div>
              <div class="text" v-text="texts"></div>
            </div>
          </div>
          <button class="primary" v-text="buttons[0]"></button>
        </div>
        <div class="alert confirm" v-if="type=='confirm'">
          <div class="clear">
            <div class="content">
              <div class="title" v-text="title"></div>
              <div class="text" v-text="texts"></div>
            </div>
          </div>
          <div class="btnbox">
            <button class="primary" v-text="buttons[0]"></button>
            <button v-text="buttons[1]"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  module.exports = {
    data: function() {
      return {
        type:"alert",//alert,confirm,toast
				degree:"warning",//warning,error  仅alert生效
				title:"提示",
				texts:"",
				buttons:["确定","取消"],
      }
    },
    
  }
</script>