// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
			'./style/js/api/index.js', 'httpUrl'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
			new Vue({
				el: '#index_box',
				data: {
					detailInfo:'',
					id:''
				},
				filters: {
					formatTime: function (v) {
						return v ? v.split(' ')[0] : ''
					},
				},
				mounted(){
					this.id=this.$utils.getReqStr('id');
					if(this.id){
						this.getNewsInfo();
					}
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
				},
				methods:{
					getNewsInfo(){
						let vm=this,params={
							id:this.id
						};
						indexApi.newsDetail(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.detailInfo=res.result;
							}
						});
					},
				},
			});
		})
});
