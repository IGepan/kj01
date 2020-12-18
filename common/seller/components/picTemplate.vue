<template>
	<div class="storemodel">
		<div class="expitem mt20">
			<span class="modeltit fl" v-text="info.propertyName+'：'"></span>
			<div class="imglistcs">
				<div class="mb20">
					<label class="csimg inline">
                    <span>选择文件</span>
                    <input type="file" class="hide">
                  </label>
				</div>
				<div class="imglist">
					<!--<div class="imgs">
						<i class="iconfont icon-shanchuguanbicha2"></i>
						<img src="../images/alink1.jpg" alt="">
					</div>
					<div class="imgs">
						<i class="iconfont icon-shanchuguanbicha2"></i>
						<img src="../images/alink1.jpg" alt="">
					</div>-->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	module.exports = {
		props: ['info', 'http'],
		data: function() {
			return {

			}
		},
		mounted() {

		},
		watch: {

		},
		methods: {

		}
	}
</script>

<style scoped>

</style>