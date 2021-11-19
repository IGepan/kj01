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
					demandList:[],
					goodsSelectList:[],
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
					conditionsList: {
						'industryType': {
							name: '行业领域',
							queryTag: true,
							level: 2,
							id: 'projectIndustryType',
							dictCodes: [{ 'name': '全部', dictValue: '' }],
							index: 0,
						},},
					webInfo:'',
					extId: '',
					currentIndex:0,
					zhiboList:[],
					activityList:[],
					activityTypeList:[],
					scienceTypeList:[],
					mailServiceTypeList: [],//科技服务分类
					goodList: [],//商品列表
					scienceList:[],
					serviceList:[],
					shopList:[],
					policyList:[],
					userInfo:'',
					searchForm:{},
					bannerList: [],
					userList:[],
					enterList:[],
					highList:[],
					sum1:0,
					sum2:0,
					sum3:0,
					queryModel: {
						pageNum: 1,
						pageSize: 10,
						enterprise: 1,
						orderBy:'ac03.createTime desc'
					},
				},
				computed: {
					/*	text () {
                            return {
                                id: this.number,
                                val: this.honorList[this.number].name
                            };
                        }*/
				},
				watch: {
					queryModel: {
						handler(n, o) {
							this.getBoxList();
							this.getHighList()
						},
						deep: true,
					},
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
					// formatPrice: function (flag,v, n, m) {
					// 	if(flag === '2') {
					// 		return '面议'
					// 	}
					// 	if(flag === "3"){
					// 		return '查看价格详情'
					// 	}else {
					// 		if(typeof v !== 'undefined') {
					// 			return v/10000+'万'
					// 		} else if(!v && !m) {
					// 			return n/10000+'万'
					// 		} else {
					// 			return n/10000 + '万-' + m/10000+'万'
					// 		}
					// 	}
					// },
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
				},
				mounted(){
					this.userInfo = JSON.parse(
						this.$utils.getCookie("USER_INFO")
					);
					this.getPublicDetail();
					window.addEventListener("setItem", (e) => {
						if(e.key==='webInfo'){
							let info=JSON.parse(e.newValue)
							this.webInfo=info?info:'';
							this.extId = info.extId ? info.extId : '';
							this.getBannerList();
						}
					});
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
					this.getShopList();
					this.getPolicyList();
					this.getDemandList();
					this.getGoodsList();
					this.getScienceType();
					this.getMailServiceType();
					this.searchForm.pageNum=1;
					this.searchForm.pageSize=4
					this.getMailGoods();
					// this.getScienceList('001,010','scienceList');
					// this.getScienceList('009','serviceList');
					this.find_tag_list();
					this.getNewsList();
					this.getUser();
					this.getBoxList();
					this.getHighList()

				},

				methods:{
					//首页轮播图
					getBannerList:function (){
						var vm = this;
						indexApi.getBanner({extId: this.extId}).then(function(res) {
							if (res.code === "rest.success") {
								vm.bannerList = res.result
							}
						});
					},
					getImgPath(path) {
						return httpUrl.fileShowUrl + '/resource/' + path;
					},
					change:function(index){
						this.currentIndex=index;
					},
					formatPrice: function (flag, v, n, m) {
						if (flag == '2') {
							return '面议'
						}if(flag == "3"){
							return '查看价格详情'
						}
						// else {
						// 	if (typeof v !== 'undefined' ) {
						// 		if (v >= 10000) {
						// 			return  '￥'+((v / 10000).toFixed(2) + '万元');
						// 		}else {
						// 			return '￥'+ v + '元'
						// 		}
						// 	} else if (!v && !m ) {
						// 		if (n >= 10000) {
						// 			return  '￥'+((n / 10000).toFixed(2)+"万元");
						// 		}else {
						// 			return  '￥'+n+"元";
						// 		}
						// 	} else {
						// 		if(n >= 100 && m >=10000 ){
						// 			return '￥'+((n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)+'万元');
						// 		}else if (n < 100 && m >= 10000) {
						// 			return '￥'+((n / 10000).toFixed(3) + '-' + (m / 10000).toFixed(2)+'万元');
						// 		} else {
						// 			return '￥' + (n + '-' + m + '元');
						// 		}
						//
						// 	}
						// }
						else {
							if (typeof v !== 'undefined' ) {

								return '￥'+ v

							} else if (!v && !m ) {

								return  '￥'+ n

							} else if(n >= 0 && m) {

								return '￥' + n + '~' + m
							}
						}
					},
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
					find_tag_list: function () {
						let _this = this;
						let codes = Object.keys(this.conditionsList);
						codes = codes.filter(key => this.conditionsList[key].queryTag);
						codes.forEach(code => {
							indexApi.query_tag_list(code).then(function (res) {
								console.log('查询' + code + '： ', res);
								if (!res.code) {
									vm.$dialog.showToast(res.message);
									return;
								}
								let data = res.data;
								// let arr = _this.getLevelTag(data, 1,
								//   _this.conditionsList[code].level);

								// let arr = _this.getLevelTag(data, 1,
								//   _this.conditionsList[code].level);
								console.log(data,'===')
								data.forEach(d => {
									d.children = d.children.map(item => {
										return { 'display': item.name, dictValue: item.id, index: -1 };
									});
								})
								_this.conditionsList[code]['dictCodes'] = [
									..._this.conditionsList[code]['dictCodes'],
									...data];
								console.log('11111111111111', _this.conditionsList[code]['dictCodes'])
							});

						});

					},
					//科技成果
					getGoodsList: function () {
						var vm = this
						indexApi.goodsSelectbByPage({
							pageParam: {current: 1, size: 4, order: "desc", sort: "create_time"},
							payload: {achievementBelong:null,
								achievementMaturity:null,
								budget_sectionQuery:null,
								businessPlanProportion:null,
								cooperationMode:null,
								projectIndustryType:null,
								projectSource:null}
						}).then(function (res) {

							vm.goodsSelectList = res.data.records

						})
					},
					//技术需求
					getDemandList: function () {
						var vm = this
						indexApi.demandSelectbByPage({
							pageParam: {current: 1, size: 4, order: "desc", sort: "create_time"},
							payload: {achievementBelong:null,
								achievementMaturity:null,
								budget_sectionQuery:null,
								businessPlanProportion:null,
								cooperationMode:null,
								projectIndustryType:null,
								projectSource:null}
						}).then(function (res) {

							vm.demandList = res.data.records

						})
					},
					//服务分类
					getMailServiceType: function () {
						var vm = this
						indexApi.mailServiceType().then(function (res) {
							if (res.code === 'rest.success') {
								vm.mailServiceTypeList = res.result
								vm.mailServiceTypeList.forEach(function (item, si) {
									item.children.unshift({ id: "-1", id: -1, parentId:item.id,name: '不限', selected: true })
									item.selected = false
								});

								if (vm.searchForm.type) {
									var types = vm.mailServiceTypeList.filter(function (el) {
										return el.id == vm.searchForm.type;
									});
									types[0].selected = true
									vm.activeAll = false
									vm.parentId=vm.searchForm.type;
									vm.result = types
								}
							}
						})
					},
					//商品-列表
					getMailGoods: function () {
						var vm = this
						indexApi.selectMailGoods(this.searchForm).then(function (res) {
							if (res.code === 'rest.success') {
								vm.goodList = res.result.list
								vm.$data.pages = res.result || ''
							}
						})
					},
					//科技-列表
					// getScienceList(code,list){
					// 	let vm=this,params={
					// 		categoryCode: code,
					// 		orderBy: "saasId desc,homePageFlag desc,createTime desc",
					// 		pageNum: 1,
					// 		pageSize: 4
					// 	};
					// 	vm[list]=[];
					// 	indexApi.scienceList(params).then(function(res) {
					// 		if (res.code === "rest.success") {
					// 			vm[list]=res.result.list
					// 		}
					// 	});
					// },
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
							nowIndex:1,
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
					//用户列表
					getUser(){
						let vm=this,params={
							pageNum: 1,
							pageSize: 10,
						};
						indexApi.getUserList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.userList=res.result.list;
								vm.sum1=res.result.total
								vm.$nextTick(()=>{
									$(".slideFromBox1").slide({
										titCell: ".hd ul",
										mainCell: ".bd ul",
										autoPage: true,
										effect: "topLoop",
										autoPlay: true,
										vis: 6
									});
								})
							}
						});
					},
					getBoxList(){
						let vm=this,
							params={
							pageNum: 1,
							pageSize: 10,
							enterprise: 1,
								orderBy:'ac03.createTime desc'
						};
						indexApi.getEnterList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.enterList=res.result.list;
								vm.sum2=res.result.total
								vm.$nextTick(()=>{
									$(".slideFromBox2").slide({
										titCell: ".hd ul",
										mainCell: ".bd ul",
										autoPage: true,
										effect: "topLoop",
										autoPlay: true,
										vis: 6
									});
								})
							}
						});
					},

					getHighList(){
						let vm=this,
							params={
								pageNum: 1,
								pageSize: 10,
								highEnterprise: 1,
								orderBy:'ac03.createTime desc'
							};
						indexApi.getEnterList(params).then(function(res) {
							if (res.code === "rest.success") {
								vm.highList=res.result.list;
								vm.sum3=res.result.total
								vm.$nextTick(()=>{
									$(".slideFromBox3").slide({
										titCell: ".hd ul",
										mainCell: ".bd ul",
										autoPage: true,
										effect: "topLoop",
										autoPlay: true,
										vis: 6
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
