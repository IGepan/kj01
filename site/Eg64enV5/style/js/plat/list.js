// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
		'./style/js/api/index.js', 'httpUrl'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
			new Vue({
				el: '#index_box',
				data: {
					newsList:[],
					pages:'',
					search:{
						pageNum: 1,
					}
				},
				filters: {
					formatTime: function (v) {
						return v ? v.split(' ')[0] : ''
					},
				},
				mounted(){
					this.getNewsList();
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
					'pages': httpVueLoader('./style/components/pages.vue'),
				},
				methods:{
					getNewsList(){
						let vm=this,params={
							type:'1',
							pageNum: this.search.pageNum,
							pageSize: 10,
						};
						indexApi.newsList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.newsList=res.result.list;
								res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
								vm.pages = res.result || ''
							}
						});
					},
					bindPageChange: function (e) {
						this.search.pageNum = e;
						this.getNewsList()
					},
				},
			});
		})
});
