require(['/common/js/require.config.js'], function() {
  require([
        'jquery',
        'dic',
        'vue',
        'httpVueLoader',
        '/style/js/api/technologyMarket.js',
        'httpUrl',
    '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
        new Vue({
          el: '#index_box',
          data: {
            dataList: [],//列表
            'total': 0, //总条数
            // 'currentPage': 1,//当前页
            // 'pageSize': 8,//每页显示条数
            conditionsList: {
              'honor_level': {
                name: '荣誉等级',
                id: 'honorLevel',
                dictCodes: [{'display': '全部', dictValue: ''}],
                index: 0,
              },
              'credit_level': {
                name: '信用等级',
                id: 'creditLevel',
                dictCodes: [{'display': '全部', dictValue: ''}],
                index: 0,
              },
              'capability_level': {
                name: '能力等级',
                id: 'capabilityLevel',
                dictCodes: [{'display': '全部'}],
                index: 0,
              },
            },
            sortActive: 0,
            sortList: [
              {id: 'create_time', name: '发布时间'},
              {id: 'read_count', name: '人气'},
              {id: 'agentCount', name: '经纪人规模'},
            ],
            queryModel: {
              'pageParam': {
                'current': 1,
                'size': 8,
                'order': 'desc',
                'sort': 'id',
              },
              'payload': {
                honorLevel: null,
                creditLevel: null,
                capabilityLevel: null,
              },
            },
          },
          components: {
            //插入头信息
            'ly-toper': httpVueLoader('/style/components/toper.vue'),
            //插入市场
            'tech_market_header': httpVueLoader(
                '/style/components/tech_market_header.vue'),

            //插入脚信息
            'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          },

          watch: {
            queryModel: {
              handler(n, o) {
                this.queryList();
              },
              deep: true,
            },
          },
          created: function() {
            this.queryList();
            this.find_dictionary_type_list();
          },
          methods: {
            getImgPath(path) {
              return httpUrl.fileShowUrl + '/resource/' + path;
            },
            clickCondition(key, id, dictValue, index) {
              console.log(key, id, dictValue, index);
              this.conditionsList[key]['index'] = index;
              this.queryModel.payload[id] = dictValue;
            },
            orderClick(id, index) {
              console.log(id, index);
              this.sortActive = index;
              this.queryModel.pageParam.sort = id;
            },

            queryList() {
              let _this = this;
              indexApi.pageZMTechOrgan(this.queryModel).then(function(res) {
                if (!res.code) {
                  vm.$dialog.showToast(res.message);
                  return;
                }
                let data = res.data;
                _this.dataList = data.records;
                _this.total = data.total;
              });
            },

            // 查询字典 并填充条件
            find_dictionary_type_list: function() {
              let _this = this;
              let codes = Object.keys(this.conditionsList);
              codes = codes.filter(key => !this.conditionsList[key].queryTag);
              // 技术成果列表查询
              indexApi.dictionary_type_list(codes).then(function(res) {
                    console.log(res);
                    if (!res.code) {
                      vm.$dialog.showToast(res.message);
                      return;
                    }
                    let data = res.data;
                    let dictGroup = _this.arrayGroup(data);
                    for (let dictKey of codes) {
                      if (dictGroup[dictKey]) {
                        _this.conditionsList[dictKey]['dictCodes'].push(
                            ...dictGroup[dictKey]);
                      }
                    }
                  },
              );
            },

            find_tag_list: function() {
              let _this = this;
              let codes = Object.keys(this.conditionsList);
              codes = codes.filter(key => this.conditionsList[key].queryTag);
              codes.forEach(code => {

                indexApi.query_tag_list(code).then(function(res) {
                  console.log('查询' + code + '： ', res);
                  if (!res.code) {
                    vm.$dialog.showToast(res.message);
                    return;
                  }
                  let data = res.data;
                  let arr = _this.getLevelTag(data, 1,
                      _this.conditionsList[code].level);
                  arr = arr.map(item => {
                    return {'display': item.name, dictValue: item.id};
                  });
                  _this.conditionsList[code]['dictCodes'] = [
                    ..._this.conditionsList[code]['dictCodes'],
                    ...arr];
                });

              });

            },

            getLevelTag(arr, index, level) {
              let result = [];
              if (index === level) {
                return arr;
              }
              arr.forEach(item => {
                if (item.children && item.children.length > 0) {
                  if (index < level) {
                    let r = (this.getLevelTag(item.children, index + 1,
                        level));
                    result = [...result, ...r];
                  }
                }
              });
              return result;
            },

            //数组变型得到新数组 JS数组根据字段进行分组
            arrayGroup(arr) {
              let obj = {};
              for (let item of arr) {
                if (!obj[item.dictCode]) {
                  obj[item.dictCode] = [];
                }
                obj[item.dictCode].push(item);
              }
              return obj;
            },

          },
        });
      });
});
