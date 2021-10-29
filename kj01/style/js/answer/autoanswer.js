require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/answer.js', 'laydate', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
      new Vue({
        el: '#autoanswer_box',
        data: {
          msg: '',
          show:false,
          problemList:{},
          connectionList: [
          //   {
          //   title: '2020年重大项目服务咨询研究课题研究单位的公告',
          //   key: '咨询研究'
          // },
         ],
          messageList: [
          //   {
          //   time: '2021-01-19 10:00',
          //   content: '重庆市2020年度粮食安全行政 首长责任制考核内容',
          //   from: 'user'
          // },
          {
            time: 'start',
            content: '您好,请问您想要咨询什么问题呢？',
            from: 'yi'
          }
        ],
        timer: '',

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
            }else if (time === 'start'){
              return '开始对话'
            }else {
              return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
            }
          }
        },
        created() {
          this.getProblemList()
          // this.resetConnection();
        },
        mounted() {
          this.$refs.messagebox.scrollTop = this.$refs.messagebox.scrollHeight
        },
        methods: {
          onProblem(val){
            this.msg = val
            this.sendMsg()
          },
          getProblemList(){
              indexApi.queryProblemList().then(res => this.problemList = res.result)
          },
          sendMsg() {
            console.log(this.msg, this.timer);
            if(!this.msg) {
              this.connectionList = [];
            }
            if(this.timer) {
              return;
            }
            this.timer = setTimeout(() => {
              this.getConnectionList();
            }, 1000)    
          },
          getConnectionList() {
            if(!this.msg) {
              clearTimeout(this.timer)
              this.timer = null;
              return;
            }
            indexApi.getQuestionRecordKeys({questions: this.msg}).then(res => {
              clearTimeout(this.timer)
              this.timer = null;
              console.log(this.timer, this.msg)
              if(!res.result) {
                return;
              }
              this.connectionList = res.result.map(title => {
                return {
                  title: title,
                  otitle: title,
                  key: this.msg
                }
              })
              this.resetConnection();
            })
          },
          // 获取答案
          getAnswer(key) {
            indexApi.getQuestionRecordAnswer({questions: key}).then(res => {
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
              console.log(this.$refs.messagebox.scrollTop, this.$refs.messagebox.scrollHeight)
              this.$nextTick(() => {
                this.$refs.messagebox.scrollTop = this.$refs.messagebox.scrollHeight + 400;
                console.log(this.$refs.messagebox.scrollTop, this.$refs.messagebox.scrollHeight)
              })        
            })
          },
          chooseMsg(item) {
            var obj = {
              content: item.title,
              from: 'user',
              time: new Date().getTime()
            }
            this.messageList.push(obj);  
            this.msg = '';     
            this.connectionList = [];
            this.getAnswer(item.otitle);
          },
          resetConnection() {
            this.connectionList = this.connectionList.map(item => {
              let replaceReg = new RegExp(item.key, 'g')// 匹配关键字正则
              let replaceString = '<span class="highlights-text">' + item.key + '</span>' // 高亮替换v-html值
              item.title = item.title.replace(replaceReg, replaceString) // 开始替换           
              return item;
            })
          },                   
        }
      })
    })
  });
