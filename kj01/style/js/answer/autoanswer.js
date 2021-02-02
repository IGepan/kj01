require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/answer.js', 'laydate', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
      new Vue({
        el: '#autoanswer_box',
        data: {
          msg: '',
          connectionList: [
          //   {
          //   title: '2020年重大项目服务咨询研究课题研究单位的公告',
          //   key: '咨询研究'
          // },{
          //   title: '2020年度重庆市技术预见与制度创新专项人才工作研究课题',
          //   key: '研究'
          // }
         ],
          messageList: [
          //   {
          //   time: '2021-01-19 10:00',
          //   content: '重庆市2020年度粮食安全行政 首长责任制考核内容',
          //   from: 'user'
          // },{
          //   time: '2021-01-19 14:00',
          //   content: '重庆市2020年度粮食安全行政 首长责任制考核内容',
          //   from: 'yi'
          // }
        ]
        },
        filters: {
          formatShowTime(time) {
            // time = +time * 1000
            const d = new Date(time)
            var now = Date.now()          
            const diff = (now - d) / 1000         
            if (diff < 30) {
              return '刚刚'
            } else if (diff < 3600) { // less 1 hour
              return Math.ceil(diff / 60) + '分钟前'
            } else if (diff < 3600 * 24) {
              return Math.ceil(diff / 3600) + '小时前'
            } else if (diff < 3600 * 24 * 2) {
              return '1天前'
            }else {
              return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
            }
          }
        },
        created() {
          // this.resetConnection();
        },
        methods: {
          sendMsg() {
            console.log(this.msg);
            var obj = {
              content: this.msg,
              from: 'user',
              time: new Date().getTime()
            }
            this.messageList.push(obj);           
            this.getAnswer();
            this.msg = '';
          },
          // 获取答案
          getAnswer() {
            indexApi.getQuestionRecordAnswer({questions: this.msg}).then(res => {
              console.log(res)
              var obj = {
                content: '',
                from: 'yi',
                time: new Date().getTime()
              }              
              if(res.result.length == 0) {
                obj.content = '暂无相关答案'
              }else {
                obj.content = res.result.join('<br/>');
              }
              this.messageList.push(obj);
              console.log(this.messageList)
            })
          },
          chooseMsg() {
           
          },
          resetConnection() {
            this.connectionList = this.connectionList.map(item => {
              let replaceReg = new RegExp(item.key, 'g')// 匹配关键字正则
              let replaceString = '<span class="highlights-text">' + item.key + '</span>' // 高亮替换v-html值
              item.title = item.title.replace(replaceReg, replaceString) // 开始替换           
              return item
            })
          },                   
        }
      })
    })
  });