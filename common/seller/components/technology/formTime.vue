<template>
  <div class="expitem form_item">
		<span class="expname w218" v-text='data.specName+"："'></span>
		<input v-model='mValue' type="text" class="timeipt w344" :id='"time"+index'>
	</div>
</template>
<script>
  module.exports = {
    props: ['value', 'index', 'data'],
    data: function() {
      return {
        
        mValue: this.value,
      }
    },
    mounted() {
    	this.initData();
    },
    watch:{
	    value(val) {
	      this.mValue = val;
	    },
	    mValue(val) {
	      this.$emit("input", val);
	    }
    },
    methods: {
			
    	initData() {
				var vm = this;
			laydate.render({
					elem: '#time' + this.index, //指定元素
					value: vm.mValue,
					done: function (val) { //选择日期完毕的回调
        				vm.mValue = val;
    				},
				});
    	}
    }
  }
</script>

<style scoped>

</style>