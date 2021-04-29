// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
		'./style/js/api/activity.js', 'httpUrl'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
			new Vue({
				el: '#index_box',
				data: {
					breadcrumb: [
						{
							label: '活动中心',
							url: './activityList.html'
						},
						{
							label: '详情',
							url:''
						},
						{
							label: '直播'
						}
					],
					saasId: '',
					detail: '',
					userInfo:''
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
				},
				created() {
					this.initData()
				},
				methods: {
					initData: function () {
						// this.saasId = localStorage.getItem('saasId');
						var id = this.$utils.getReqStr('id')
						this.breadcrumb[1].url = './activityDetail.html?id=' + id
						this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
						if (this.userInfo && this.userInfo.userName) {
							this.getDetailInfo(id);
						} else {
							window.location.href = '../../../../../../common/login.html';
						}
					},
					getDetailInfo: function (id) {
						var vm = this;
						indexApi.getLiveDetail({ id: id}).then(function (res) {
							if(res.code==='rest.success'){
								vm.detail = res.result ? res.result : {}
								if(vm.detail){
									// vm.detail.pullStreamUrl=vm.detail.pullStreamUrl+'?name='+vm.userInfo.userName+'&email='+vm.userInfo.userId+'@qq.com';
									vm.detail.pullStreamUrl=vm.detail.recordId?res.result.pullStreamUrl+'&rid='+vm.detail.recordId:vm.detail.pullStreamUrl;
								}
							}
						})
					},
				}
			});
		})
});
