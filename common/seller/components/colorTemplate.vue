<template>
	<div class="storemodel">
		<div>
			<span class="modeltit" v-text="info.propertyName+'：'"></span>
		</div>
		<div class="modellist">
			<div class="cols" v-for="(item,index) in colorList" style="margin: 4px 0px" @click="itemClick(index)">
				<div class="colmdl" :style="{backgroundColor: item.display}" :class="{active: item.isSelect}">
					<span class="del" v-if="(defLength-1) < index" @click="colorDelClick">删除</span>
				</div>
				<span v-text="item.display"></span>
			</div>
			<label class="addcolmodel" style="margin: 4px 0px">
                <input type="color" class="addcolor" @change="colorChange($event)">
                <span class="zdy">自定义</span>
              </label>
		</div>
	</div>
</template>
<script>
	module.exports = {
		props: ['info', 'http'],
		data: function() {
			return {
				colorList: [],
				activeIndex: 0,
				defLength: 0 // 默认长度
			}
		},
		mounted() {
			var vm = this;
			this.http.dict({
				code: this.info.field1
			}).then(function(res){
				vm.colorList = res.result;
				vm.initColor()
			})
		},
		watch: {

		},
		methods: {
			initColor: function() {
				var vm = this;
				vm.$set(vm.colorList[vm.activeIndex], 'isSelect', false);
				var colorList = JSON.parse(JSON.stringify(vm.colorList));
				this.defLength = colorList.length;
				var isAdd = true;
				for(var index in this.info.defaultValueList) {
					var defColor = this.info.defaultValueList[index];
					if (this.info.defaultValueList.hasOwnProperty(index)) {
					 	for(var colorIndex in colorList){
					 		if (colorList.hasOwnProperty(colorIndex)) {
					 			if(colorList[colorIndex].display == defColor.value)  {
					 				vm.activeIndex = colorIndex;
					 				isAdd = false;
					 			}
					 		}
						}
					}
				}
				if(isAdd) {
					vm.activeIndex = colorList.length + 1;
			 		vm.colorList.push({
			 			display: vm.info.defaultValueList[0]
			 		});
			 	}
				vm.$set(vm.colorList[vm.activeIndex], 'isSelect', true);
			},
			itemClick: function(index) {
				this.colorList[this.activeIndex].isSelect = false;
				this.$set(this.colorList[index], 'isSelect', true)
				this.activeIndex = index;
				// 更新数据
				this.info.defaultValueList = [{
					value: this.colorList[this.activeIndex].display
				}]
			},
			colorChange: function(event) {
				var color = event.srcElement.value;
				// 更新颜色
				if(this.defLength < this.colorList.length) {
					this.colorList[this.colorList.length-1].display = color;
				}else {
					this.colorList.push({
			 			display: color
			 		});
				}
			},
			colorDelClick() {
				var isMove = this.colorList[this.colorList.length-1].isSelect;
				// 最后一个选中，移到前一个
				this.colorList.pop();
				if(isMove) {
					this.activeIndex = this.colorList.length -1;
					this.colorList[this.colorList.length-1].isSelect = true;
				}
			}
		}
	}
</script>

<style scoped>

</style>