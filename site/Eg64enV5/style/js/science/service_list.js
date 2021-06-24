// JavaScript Document
require(['/common/js/require.config.js'], function () {
	require(['jquery', 'vue', 'dic', 'httpVueLoader',
			'./style/js/api/science.js', 'httpUrl', 'laydate','./style/js/libs/pagination.js'],
		function ($, Vue, dic, httpVueLoader, indexApi, httpUrl,laydate,pagination) {
			new Vue({
				el: '#index_box',
				data: {
					cmsUrl: httpUrl.cmsUrl,
					saasId: '',
					mailSite: {},
					goodList: [],
					searchForm: {
						pageSize: 12,
						type: '',
						price: '',
						sort: ''
					},
					dicOptsSet: [
						{
							code: 'price',
							label: '服务价格',
							operationType: 'select',
							childIndex: -1,
							valueKey: 'price',
							valueType: 'string',
							isMoreShow: 0,
							isMore: 0,
							isTop: 0
						},
					],
					// options: {
					// 	searchOpts: [],
					// 	selectOpts: [],
					// 	sIndexOtps: {
					// 		'004': 1,
					// 		'006': 2,
					// 		'010': 3,
					// 		'009': 4,
					// 		'002': 5,
					// 		'001': 6
					// 	}
					// },
					// searchForm: {
					// 	categoryCode: "009",
					// 	goodsName: '',
					// 	servicesLevel: '',
					// 	pageNum: 1,	// 	第几页	是	[string]		查看
					// 	pageSize: 12,	// 	每页显示多少行	是	[string]		查看
					// 	orderBy: 'createTime desc',	// 	排序字段	是	[string]		查看
					// },
					selected: false,
					dataList: [],
					count: 0,
					$pages: '',
					filters: [
						{
							value: false,
							label: '综合排序',
							seleced: true
						},
						// {
						//     value: false,
						//     label: '时间排序'
						// },
						{
							value: false,
							label: '价格排序'
						}
					],
					options: {
						selectOpts: [],
						searchOpts: [],
						mailServiceTypeList: [],
					},
					title: '',
					pages: '',
					nameList: [],
					result: [],
					ser: [],
					pr: [],
					active: false,
					activeAll: true,
					activePriceAll:true,
					parentId:null

				},
				filters: {
					formatTime: function (v) {
						if (v) {
							v = v.split(' ')[0]
							v = v.split('-')
							v.splice(1, 0, '年')
							v.splice(3, 0, '月')
							v.push('日')
							return v.join('')
						} else {
							return ''
						}
					},
					firstWord: function (v) {
						return v ? v.substr(0, 1) : ''
					},
					// formatPrice2: function (flag,v, n, m) {
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
				watch: {
					'searchForm.categoryCode': function (v) {
						if (v === '010') {
							if (this.searchForm.province) {
								this.bindChangeProvince(0, '不限')
							}
						}
					}
				},
				components: {
					'ly-toper': httpVueLoader('./style/components/toper.vue'),
					'index-head': httpVueLoader('./style/components/header.vue'),
					'com-footer': httpVueLoader('./style/components/com-footer.vue'),
					'pages1': httpVueLoader('./style/components/pages.vue'),
				},
				created: function () {
					this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
					this.saasId = localStorage.getItem('saasId');
					// var title = this.$utils.getReqStr('title');
					// title && (this.searchForm.goodsName = title);
					// var stype = this.$utils.getReqStr('stype');
					// stype && (this.searchForm.servicesLevel = stype, this.sIndex = this.options.sIndexOtps[stype]);
					// var sctype = this.$utils.getReqStr('sctype');
					// sctype && (this.searchForm.servicesTypeId = sctype);

					// var servicesLevel = this.$utils.getReqStr('servicesLevel')
					// servicesLevel && (this.searchForm.servicesLevel = servicesLevel);
					// var industryLevel = this.$utils.getReqStr('industryLevel')
					// industryLevel && (this.searchForm.industryLevel = industryLevel)
					// var industryTypeId = this.$utils.getReqStr('industryTypeId')
					// industryTypeId && (this.searchForm.industryTypeId = industryTypeId)
					// var industryTypeIdName = this.$utils.getReqStr('industryTypeIdName')
					// industryTypeIdName && (this.searchForm.industryTypeIdName = industryTypeIdName)
					var title = this.$utils.getReqStr('title');
					var type = this.$utils.getReqStr('type');
					this.searchForm.title = title;
					this.searchForm.type = type;
					this.searchForm.orderBy = '';
					this.getMailGoods();
					this.getDicList(this.dicOptsSet);
					this.getMailServiceType();
					// cookie用户信息
					this.userInfo = JSON.parse(
						this.$utils.getCookie("USER_INFO")
					);
					// this.getDicList(this.dicOptsSet);
					// this.getList()
				},
				methods: {
					formatPrice: function (flag, v, n, m) {
						if (flag == '2') {
							return '面议'
						}
						if (flag == "3") {
							return '查看价格详情'
						} else {
							if (typeof v !== 'undefined') {
								if (v >= 10000) {
									return '￥' + ((v / 10000).toFixed(2) + '万元');
								} else {
									return '￥' + v + '元'
								}
							} else if (!v && !m) {
								if (n >= 10000) {
									return '￥' + ((n / 10000).toFixed(2) + "万元");
								} else {
									return '￥' + n + "元";
								}
							} else {
								if (n >= 100 && m >= 10000) {
									return '￥' + ((n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2) + '万元');
								} else if (n < 100 && m >= 10000) {
									return '￥' + ((n / 10000).toFixed(3) + '-' + (m / 10000).toFixed(2) + '万元');
								} else {
									return '￥' + (n + '-' + m + '元');
								}

							}
						}
					},
					handleFilter: function (i) {
						if (this.filters[i].seleced) {
							if (!this.filters[i].value) {
								this.filters[i].value = true
							} else {
								this.filters[i].value = false
							}
						} else {
							this.filters = this.filters.map(function (item, index) {
								if (index === i) {
									item.seleced = true
									item.value = true
								} else {
									item.seleced = false
									item.value = false
								}
								return item
							})
						}
						if (i) {
							if (i === 0) {
								// this.searchForm.orderBy = 'createTime as'
								this.searchForm.orderBy = ''
							}
							if (i === 1) {
								this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc'
							}
						} else {
							 this.searchForm.orderBy = ''
							// this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc'
						}
						this.getMailGoods()
					},

					handleSearchForm: function (e, is) {
						var vm = this

						console.log(e,'e')
						if (e.value) {
							this.searchForm.price = e.value
						} else {
							if (e.id==-1){
								this.searchForm.type = e.parentId
							} else {
								if(e.id) this.searchForm.type = e.id
							}
						}
						if (e.name || e.display) {
							var ser = []
							var pr = []
							if (is == 'server') {
								let list = e
								if (this.ser.length >= 1) {
									this.ser = []
								}
								this.activeAll = false
								this.ser.push(list)
								this.options.mailServiceTypeList.forEach(function (item, dici) {
									if (e.id == item.id) {
										item.selected = true
										vm.parentId=e.id;
									}
									item.children.forEach(function (item2, dici) {
										item2.selected=false
									});
									item.children.forEach(function (item2, dici) {
										if (e.id == item2.id) {
											item2.selected = true
										}else if (e.parentId=='0'){
											if (item2.id==-1){
												item2.selected=true
											}else {
												item2.selected=false
											}
										}
									});
								})
							}
							if (is == 'price') {
								let list = e
								if (this.pr.length >= 1) {
									this.pr = []
								}

								vm.options.searchOpts[0].dictIInfos.forEach(function (item, dici) {
									if (e.id == item.id) {
										item.selected = true
									}
								})
								this.activePriceAll=false
								this.pr.push(list)
							}
							this.result = [...this.ser, ...this.pr]
						} else if (e === 'server') {
							this.result = [...this.ser = [], ...this.pr]
							this.isActive = e
							vm.parentId=null;
							// 清空type
							delete this.searchForm.type
						} else if (e === 'price') {
							this.result = [...this.ser, ...this.pr = []]
							// 清空价格
							delete this.searchForm.price
						}

						indexApi.selectMailGoods(this.searchForm).then(function (res) {
							if (res.code === 'rest.success') {
								vm.goodList = res.result.list
								vm.$data.pages = res.result || ''
							}
						})
					},
					remove: function (index) {
						// this.result.splice(index, 1)
						var vm = this;

						this.result = this.result.filter(function (el) {
							return el.id !== index.id;
						});

						if (index.parentId) {
							this.ser = []
						} else {
							this.pr = []
						}
						// this.nameList.splice(index.name||index.display, 1)
						if (index.value) {
							this.searchForm.price = null
							vm.options.searchOpts[0].dictIInfos.forEach(function (item, dici) {
								item.selected = false
							})
							vm.activePriceAll = true

						} else {
							this.options.mailServiceTypeList.forEach(function (item, dici) {
								item.selected = false
								item.children.forEach(function (item2, dici) {
									item2.selected = false
								});
								vm.activeAll = true
							})
							this.searchForm.type = null
							this.parentId=null
						}
						this.getMailGoods();
					},
					getMailGoods: function () {
						var vm = this
						indexApi.selectMailGoods(this.searchForm).then(function (res) {
							if (res.code === 'rest.success') {
								vm.goodList = res.result.list
								vm.$data.pages = res.result || ''
							}
						})
					},
					getDicList: function (keys) {
						var vm = this
						this.$httpCom.dictList({dictInfos: keys}).then(function (res) {
							if (res.code === 'rest.success') {
								var opts = []
								opts = res.result.map(function (codes, i) {
									var value = vm.searchForm[keys[i].valueKey]
									var display = ''
									var di = ''
									var index = -1
									codes.dictIInfos.forEach(function (dic, dici) {
										dic.children = []
									})
									codes.valueType = keys[i].valueType
									codes.label = keys[i].label
									codes.operationType = keys[i].operationType
									codes.isTop = keys[i].isTop
									codes.valueKey = keys[i].valueKey
									codes.isMoreShow = keys[i].isMoreShow
									codes.isMore = keys[i].isMore
									codes.childIndex = value ? index : keys[i].childIndex
									value && vm.addSelectOpts({
										di: di,
										pi: i + 1 + '',
										value: value,
										code: codes.code,
										label: codes.label,
										display: display
									})
									return codes
								});
								vm.options.searchOpts = opts;
							}
						})
					},
					addSelectOpts: function (dataset) {
						let flag = -1;
						this.options.selectOpts.some(function (item, i) {
							if (item.code === dataset.code) {
								flag = i;
								return true
							}
						});
						if (dataset.value === '-1') {
							this.options.selectOpts.splice(flag, 1)
						} else {
							flag === -1 ? this.options.selectOpts.push(dataset) : (this.options.selectOpts[flag] = dataset)
						}
					},
					bindPageChange: function (e) {
						this.$data.searchForm.pageNum = e;
						this.getMailGoods()
					},
					getMailServiceType: function () {
						var vm = this
						indexApi.mailServiceType().then(function (res) {
							if (res.code === 'rest.success') {
								vm.options.mailServiceTypeList = res.result
								vm.options.mailServiceTypeList.forEach(function (item, si) {
									item.children.unshift({ id: "-1", id: -1, parentId:item.id,name: '不限', selected: true })
									item.selected = false
								});

								if (vm.searchForm.type) {
									var types = vm.options.mailServiceTypeList.filter(function (el) {
										return el.id == vm.searchForm.type;
									});
									types[0].selected = true
									vm.activeAll = false
									vm.parentId=vm.searchForm.type;
									vm.result = types
								}
							}
						})
					},getAttributeData: function (el, keys) {
						var dataset = {}
						if (el.dataset) {
							dataset = el.dataset
						} else {
							keys.forEach(function (tkey) {
								dataset[tkey] = el.getAttribute('data-' + tkey);
							})
						}
						return dataset
					},
					handelSearch: function () {
						var vm = this
						vm.searchForm.title = vm.title
						indexApi.selectMailGoods(this.searchForm).then(function (res) {
							if (res.code === 'rest.success') {
								vm.goodList = res.result.list
								// vm.$data.pages = res.result || ''
							}
						})
					},

					// bindSearchValue: function (key) {
					// 	this.searchForm.goodsName = key;
					// 	this.getList()
					// },
					//
					// getDicList: function (keys) {
					// 	var vm = this
					// 	this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
					// 		if (res.code === 'rest.success') {
					// 			var opts = []
					// 			var sortOpts = {
					// 				code: 'order_by',
					// 				label: '排序',
					// 				operationType: 'switchover',
					// 				valueKey: 'orderBy',
					// 				valueType: 'switchover',
					// 				isTop: 1,
					// 				isMoreShow: 0,
					// 				isMore: 0,
					// 				childIndex: -1,
					// 				dictIInfos: [
					// 					{
					// 						id: 'order_by_1',
					// 						values: ['createTime desc', 'createTime asc'],
					// 						selectedIndex: 0,
					// 						selected: true,
					// 						display: '综合排序'
					// 					},
					// 					{
					// 						id: 'order_by_2',
					// 						values: ['salesVolume desc', 'salesVolume asc'],
					// 						selectedIndex: 0,
					// 						selected: false,
					// 						display: '资源人气'
					// 					},
					// 					{
					// 						id: 'order_by_3',
					// 						values: ['createTime desc', 'createTime asc'],
					// 						selected: false,
					// 						selectedIndex: 0,
					// 						display: '发布时间'
					// 					}
					// 				]
					// 			}
					// 			var getItem = {}
					// 			opts = res.result.map(function (codes, i) {
					// 				var value = vm.searchForm[keys[i].valueKey]
					// 				var display = ''
					// 				var di = ''
					// 				var index = -1
					// 				codes.dictIInfos.unshift({ id: "-1", value: -1, display: '全部' });
					// 				codes.dictIInfos.forEach(function (dic, dici) {
					// 					dic.children = []
					// 					if (value) {
					// 						dic.selected = value === dic.value
					// 						value === dic.value && (display = dic.display, di = '' + dici, index = di)
					// 						codes.code === 'services_level1_type' && (getItem = {
					// 							pi: i + 1 + '',
					// 							di: di,
					// 							code: 'services_level1_type',
					// 							value: value
					// 						})
					// 						codes.code === 'industry_level1_type' && (getItem = {
					// 							pi: i + 1 + '',
					// 							di: di,
					// 							code: 'industry_level1_type',
					// 							value: value
					// 						})
					// 					} else {
					// 						dic.selected = !dici
					// 					}
					// 				});
					// 				codes.valueType = keys[i].valueType
					// 				codes.label = keys[i].label
					// 				codes.operationType = keys[i].operationType
					// 				codes.isTop = keys[i].isTop
					// 				codes.valueKey = keys[i].valueKey
					// 				codes.isMoreShow = keys[i].isMoreShow
					// 				codes.isMore = keys[i].isMore
					// 				codes.childIndex = value ? index : keys[i].childIndex
					// 				value && vm.addSelectOpts({
					// 					di: di,
					// 					pi: i + 1 + '',
					// 					value: value,
					// 					code: codes.code,
					// 					label: codes.label,
					// 					display: display
					// 				})
					// 				return codes
					// 			});
					// 			opts.unshift(sortOpts)
					// 			vm.options.searchOpts = opts;
					// 			getItem.value && vm.getSetChild(getItem.pi, getItem.di, getItem.code === 'services_level1_type', getItem.value);
					// 			getItem.value && vm.getSetChild(getItem.pi, getItem.di, getItem.code === 'industryLevel1Type', getItem.value)
					// 		}
					// 	})
					// },
					// getSetChild: function (pi, di, searchType, value) {
					// 	var vm = this
					// 	var data = {}
					// 	data[searchType ? 'servicesLevel1Type' : 'industryLevel1Type'] = value
					// 	this.$httpCom[searchType ? 'servicesSelect' : 'industrySelect'](data).then(function (res) {
					// 		if (res.code === 'rest.success') {
					// 			var tId = vm.searchForm[searchType ? 'servicesTypeId' : 'industryTypeId']
					// 			res.result.unshift({ id: -1, name: "不限", selected: true })
					// 			res.result.forEach(function (item, i) {
					// 				if (tId) {
					// 					item.selected = item.id === tId
					// 					if (item.id === tId) {
					// 						vm.options.selectOpts[0].display = vm.options.selectOpts[0].display + ' · ' + item.name
					// 					}
					// 				} else {
					// 					item.selected = !i
					// 				}
					// 				item.value = item.id
					// 				item.display = item.name
					// 				item.valueKey = searchType ? 'servicesTypeId' : 'industryTypeId'
					// 				item.valueType = 'string'
					// 			})
					// 			vm.options.searchOpts[pi].dictIInfos[di].children = res.result
					// 		}
					// 	})
					// },
					// getList: function () {
					// 	var vm = this;
					// 	this.$httpCom['searchList'](this.searchForm).then(function (res) {
					// 		if (res.code === 'rest.success') {
					// 			vm.dataList = res.result.list
					// 			if (!vm.$pages) {
					// 				vm.count = res.result.total || 0
					// 				vm.setPages()
					// 			} else if (vm.count !== res.result) {
					// 				vm.count = res.result.total || 0
					// 				vm.$pages.pagination(vm.getPageOptions())
					// 			}
					// 		} else {
					// 			vm.dataList = []
					// 			vm.count = 0
					// 		}
					// 	})
					// },
					// getAttributeData: function (el, keys) {
					// 	var dataset = {}
					// 	if (el.dataset) {
					// 		dataset = el.dataset
					// 	} else {
					// 		keys.forEach(function (tkey) {
					// 			dataset[tkey] = el.getAttribute('data-' + tkey);
					// 		})
					// 	}
					// 	return dataset
					// },
					// handleSetMoreItem: function (i) {
					// 	var oitem = this.options.searchOpts[i]
					// 	oitem.isMore = oitem.isMore ? 0 : 1;
					// 	this.options.searchOpts[i] = oitem
					// },
					// handleSetSearchForm: function (e) {
					// 	var dataset = this.getAttributeData(e.target, ['ci', 'di', 'pi', 'value']);
					// 	var oitem = this.options.searchOpts[dataset.pi]
					// 	var vm = this;
					// 	var t = oitem.dictIInfos[dataset.di]
					// 	var ct;
					// 	oitem.dictIInfos.forEach(function (soi, i) {
					// 		soi.selected = i == dataset.di
					// 		// 修正其他选项
					// 		soi.children && soi.children.length && soi.children.forEach(function (child, ci) {
					// 			child.selected = !ci
					// 		})
					// 		soi.children && !soi.children.length && soi.value !== -1 && (oitem.code === 'services_level1_type' || oitem.code === 'industry_level1_type') && vm.getSetChild(dataset.pi, '' + i, oitem.code === 'services_level1_type', soi.value)
					// 		// 子选项选择
					// 		soi.children && soi.children.length && dataset.ci && i == dataset.di && soi.children.forEach(function (child, ci) {
					// 			child.selected = ci == dataset.ci
					// 		})
					// 	})
					// 	oitem.childIndex = dataset.di
					// 	this.options.searchOpts[dataset.pi] = oitem
					// 	dataset.code = oitem.code
					// 	dataset.label = oitem.label
					// 	if (dataset.ci) {
					// 		ct = t.children[dataset.ci]
					// 		dataset.display = t.display + ' · ' + ct.display
					// 		// 修正子选项值
					// 		if (dataset.ci && dataset.value === '-1') {
					// 			// dataset.value = t.value
					// 			dataset.display = t.display
					// 		}
					// 	} else {
					// 		dataset.display = t.display
					// 	}
					// 	if (oitem.operationType !== 'switchover') {
					// 		// 时间筛选特殊处理
					// 		oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
					// 		if (ct && ct.valueKey) {
					// 			this.$data.searchForm[ct.valueKey] = dataset.value === '-1' ? '' : ct.valueType === 'array' ? [dataset.value] : dataset.value
					// 			this.$data.searchForm[ct.valueKey + 'Name'] = ct.display
					// 		} else {
					// 			this.$data.searchForm[oitem.valueKey] = dataset.value === '-1' ? '' : oitem.valueType === 'array' ? [dataset.value] : dataset.value
					// 			if(!t.children.length){
					// 				let key=oitem.code === 'services_level1_type'? 'servicesTypeId' : 'industryTypeId';
					// 				this.$data.searchForm[key]='';
					// 				this.$data.searchForm[key + 'Name'] = ''
					// 			}
					// 			// 清理子选项的值
					// 			if (t.children.length && t.children[0].valueKey) {
					// 				ct = t.children[0]
					// 				this.$data.searchForm[ct.valueKey] = ''
					// 				this.$data.searchForm[ct.valueKey + 'Name'] = ''
					// 			}
					// 		}
					// 	} else {
					// 		t.selectedIndex = t.selectedIndex ? 0 : 1
					// 		this.$data.searchForm[oitem.valueKey] = t.values[t.selectedIndex];
					// 	}
					// 	// oitem.valueKey === 'servicesLevel' && this.setHotView(dataset.value)
					// 	this.addSelectOpts(dataset)
					// },
					// addSelectOpts: function (dataset) {
					// 	let flag = -1;
					// 	this.options.selectOpts.some(function (item, i) {
					// 		if (item.code === dataset.code) {
					// 			flag = i;
					// 			return true
					// 		}
					// 	});
					// 	if (dataset.value === '-1') {
					// 		this.options.selectOpts.splice(flag, 1)
					// 	} else {
					// 		flag === -1 ? this.options.selectOpts.push(dataset) : (this.options.selectOpts[flag] = dataset)
					// 	}
					// 	this.$data.searchForm.pageNum = 1
					// 	this.getList()
					// },
					// handleDelSelectOpt: function (e) {
					// 	var dataset = this.getAttributeData(e.target, ['index']);
					// 	var delOpt = this.options.selectOpts.splice(dataset.index, 1)[0];
					// 	var vm = this;
					// 	var oitem;
					// 	oitem = this.options.searchOpts[delOpt.pi];
					// 	oitem.dictIInfos.forEach(function (soi, i) {
					// 		soi.selected = !i
					// 		// 修正其他选项
					// 		soi.children && soi.children.length && soi.children.forEach(function (child, ci) {
					// 			child.selected = !ci
					// 		})
					// 		soi.children && soi.children.length && (soi.children[1].valueKey, vm.$data.searchForm[soi.children[1].valueKey] = '')
					// 	});
					// 	oitem.childIndex = -1;
					// 	this.options.searchOpts[delOpt.pi] = oitem;
					// 	this.$data.searchForm[oitem.valueKey] = '';
					// 	// 时间筛选特殊处理
					// 	oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
					// 	this.$data.searchForm.pageNum = 1;
					// 	this.getList()
					// },
					getPageOptions: function () {
						var vm = this
						var sources = function () {
							var result = [];
							var count = vm.count
							for (var i = 0;i < count;i++) {
								result.push(i);
							}
							return result;
						}();
						return {
							dataSource: sources,
							totalNumber: vm.$data.pages.pages,
							pageNumber: vm.$data.pages.pageNum,
							pageSize: vm.$data.pages.pageSize,
							pageRange: 3,
							prevText: '上一页',
							nextText: '下一页',
							callback: function (data, pagination) {
								if (vm.$data.searchForm.pageNum !== pagination.pageNumber) {
									vm.$data.searchForm.pageNum = pagination.pageNumber
									vm.getList()
								}
							}
						}
					},
					setPages: function () {
						this.$nextTick(function () {
							this.$pages = $('#pagination-container').pagination(this.getPageOptions());
						})
					},
				}
			});
		})
});
