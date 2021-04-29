// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
		'./style/js/api/about.js', 'httpUrl'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
			new Vue({
				el: '#index_box',
				data: {
					detail:'',
					sidebarList:[
						{
							label:'关于易智网',
						},{
							label:'免责声明',
							type:'10'
						},{
							label:'隐私政策',
							type:'5'
						},{
							label:'平台协议',
							type:'9'
						},{
							label:'联系客服',
						},
					],
					activeIndex:0,
					activeName:'关于易智网',
				},
				mounted(){
					// this.getInfo();
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
				},
				methods:{
					getInfo(id){
						let vm=this,params={
							protocolType:id
						};
						indexApi.selectLatest(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.detail=res.result.protocolContact;
							}
						});
					},
					handleTabs(index,item){
						this.activeIndex=index;
						this.activeName=item.label;
						this.detail='';
						if(item.type){
							this.getInfo(item.type);
						}
					}
				},
			});
		})
});
