<template>
	<div>
		<label :class="{disable: (item.value != mValue) && disabeld}" v-for="item in selectList">
	      <input :disabled="disabeld && item.value != mValue" @change="radioChange($event)" 
				type="radio" :name="'ly-radio'+code" :value="item.value" v-model="mValue" 
				:checked="mValue == item.value">
	      <b></b>{{item.display}}
		</label>
	</div>
</template>
<script>
	module.exports = {
		props:  ['code', 'group', 'parentId', 'value', 'exp', 'only', 'mdisabeld'],
		data: function() {
			return {
				mValue: this.value,
				selectList: [],
				disabeld: this.mdisabeld,
			}
		},
		mounted() {
			this.initData();
		},
		 watch: {
			 mdisabeld:function(val) {
				 this.disabeld = val;
			 },
		    value:function(val) {
					this.mValue = val;
		    },
		    mValue:function(val) {
		      this.$emit("input", val);
		    }
		  },
		methods: {
			initData: function(){
				var vm = this;
				this.$httpCom.dict({
					code: this.code,
					group: this.group,
					parentId: this.parentId
				}).then(function(res) {
					vm.selectList = res.result;
					// if(!this.mValue || this.mValue === ''){
					// 	vm.mValue = vm.selectList[0].value;
					// }
				})
			},
			setDisabeld: function(){
				this.disabeld = true;
			},
			getValue: function() {
				var radios = document.getElementsByName("ly-radio");
				var value = '';
				for(var i=0;i<radios.length;i++){
					if(radios[i].checked == true){
							value = radios[i].value;
					}
				}
				return value
			},
			radioChange: function(e){
				this.$emit('change', e.srcElement.value)
			},
		}
	}
</script>

<style scoped>
	.disable{
		color: #cccccc;
	}
</style>