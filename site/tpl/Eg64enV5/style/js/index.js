// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
		'./style/js/api/index.js', 'httpUrl','/common/js/libs/jquery.SuperSlide.2.1.3.js','httpStore'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl,superSlide,httpStore) {
			new Vue({
				el: '#index_box',
				data: {
					navIndex:0,
					cmsUrl: httpUrl.cmsUrl,
					newsList:[],
					publishList:[
						{
							title:'发布需求',
							sub_title:'快速发布需求',
							src:this.$pathPrefix+'/common/buyer/demand/add.html?code=001.001.002.002'
						},
						{
							title:'发布服务',
							sub_title:'快速发布服务',
							src:this.$pathPrefix+'/common/seller/addpatent.html?code=001.002.002.002&categoryId=82779310439534200'
						},{
							title:'发布成果',
							sub_title:'快速发布成果',
							src:this.$pathPrefix+'/common/seller/index.html'

						},{
							title:'发布活动',
							sub_title:'快速发布活动',
							src:this.$pathPrefix+'/common/activity/add.html?code=001.004.001.001'
						}
					],
					technologyTabs: [
						{
							label: '机械',
							industryLevel: '001',
							actvie: true
						},
						{
							label: '汽车',
							industryLevel: '002',
							actvie: false
						},
						{
							label: '集成电路',
							industryLevel: '003',
							actvie: false
						},
						{
							label: '物联网',
							industryLevel: '004',
							active: false
						},
						{
							label: '计算机及通信设备',
							industryLevel: '005',
							active: false
						}
					],
					webInfo:'',
					zhiboList:[],
					activityList:[],
					activityTypeList:[],
					scienceTypeList:[],
					scienceList:[],
					serviceList:[],
					shopList:[],
					policyList:[],
					userInfo:'',
				},
				computed: {
				/*	text () {
						return {
							id: this.number,
							val: this.honorList[this.number].name
						};
					}*/
				},
				filters: {
					formatTime: function (v) {
						return v ? v.split(' ')[0] : ''
					},
					formatTime1: function (v) {
						var t;
						if (v) {
							t = new Date(v);
							v = v.substr(0, 16) + [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六'][t.getDay()]
						}
						return v || '';
					},
					formatPrice: function (flag,v, n, m) {
						if(flag === '1') {
							return '面议'
						} else {
							if(typeof v !== 'undefined') {
								return v/10000+'万'
							} else if(!v && !m) {
								return n/10000+'万'
							} else {
								return n/10000 + '万-' + m/10000+'万'
							}
						}
					},
				},
				mounted(){
					this.userInfo = JSON.parse(
						this.$utils.getCookie("USER_INFO")
					);
					window.addEventListener("setItem", (e) => {
						if(e.key==='webInfo'){
							let info=JSON.parse(e.newValue)
							this.webInfo=info?info:'';
						}
					});
					this.getPublicDetail();
					this.getActivityList({
						pageNum: 1,
						pageSize: 4,
						sortType: "02",
					},'activityList');
					this.getActivityList({
						pageNum: 1,
						pageSize: 1,
						sortType: "02",
						activeType:'218340665870780082'
					},'zhiboList');
					this.getScienceType();
					this.getScienceList('001,010','scienceList');
					this.getScienceList('009','serviceList');
					this.getShopList();
					this.getPolicyList();
					this.getNewsList();
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
				},
				methods:{
					//活动中心---- 一级分类
					getPublicDetail(){
						let vm=this;
						indexApi.activityGetTree([{type:'11'}]).then(function(res) {
							if (res.code === "rest.success") {
								vm.activityTypeList=res.result[0]
							}
						});
					},
					//活动中心---- 列表
					getActivityList(params,key){
						let vm=this
						indexApi.activityList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm[key]=res.result.list
							}
						});
					},
					//科技-分类
					getScienceType(){
						let vm=this,params={
							dictInfos:[{"code":"industry_level1_type"}]
						};
						this.$httpCom.dictList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.scienceTypeList=res.result[0].dictIInfos
							}
						});
					},
					//科技-列表
					getScienceList(code,list){
						let vm=this,params={
							categoryCode: code,
							orderBy: "homePageFlag desc,createTime desc",
							pageNum: 1,
							pageSize: 4
						};
						vm[list]=[];
						indexApi.scienceList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm[list]=res.result.list
							}
						});
					},
					//机构-列表
					getShopList(){
						let vm=this,params={
							orderBy: "createTime desc",
							pageNum: 1,
							pageSize: 6,
							// isContainIdentityTypeSelf: '0'
						};
						indexApi.shopList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.shopList=res.result.list
								vm.shopList.forEach((item)=>{
									let locationShow = [];
									item.provinceDisplay && locationShow.push(item.provinceDisplay);
									if (item.cityDisplay && item.cityDisplay !== '县' && item.cityDisplay !== '市辖区') {
										locationShow.push(item.cityDisplay)
									} else {
										item.districtDisplay && locationShow.push(item.districtDisplay)
									}
									item.cityShow = locationShow.join(' · ')
								})
							}
						});
					},
					//政策-列表
					getPolicyList(){
						let vm=this,params={
							orderBy: "publishDate-desc",
							pageNum: 1,
							pageSize: 4,
							analyzingFlag:"1"
						};
						indexApi.policyList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.policyList=res.result.list
							}
						});
					},
					handleMore(id){
						location.href=id?'./activityList.html?type='+id:'./activityList.html'
					},
					getNewsList(){
						let vm=this,params={
							type:'1',
							pageNum: 1,
							pageSize: 5,
						};
						indexApi.newsList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.newsList=res.result.list;
								vm.$nextTick(()=>{
									$(".slideTxtBox").slide({
										titCell: ".hd ul",
										mainCell: ".bd ul",
										autoPage: true,
										effect: "top",
										autoPlay: true,
										vis: 1
									});
								})
							}
						});
					},
					handlePublish(e){
						let vm=this;
						let url = e.target.dataset.url || e.currentTarget.dataset.url
						if(url.indexOf('/common/seller') === -1){
							location.href=url
						}else{
							if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('002') === -1) {
								e.preventDefault()
								this.$dialog.showToast('您还不是服务商，请先入驻成为服务商！')
							}else{
								//是否激活店铺
								httpStore.validateActive({}).then(function (res) {
									if (res.code == 'rest.success') {
										location.href=url
									} else {
										e.preventDefault()
										var options = {
											title: '温馨提示',
											texts: '请先激活店铺！',
											buttons: ['现在就去', '稍后激活'],
											callback: function () {
												location = vm.$pathPrefix+'/common/seller/activate.html?code=001.002.001.003'
											}
										}
										vm.$dialog.confirm(options)
									}
								})
							}
						}
					}
				},
			});
		})
});