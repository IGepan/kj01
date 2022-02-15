define(['jquery', 'laydate', '/common/js/libs/im/webimconfig.js', 'websdk', 'httpUrl'], function ($, laydate, imconfig, WebIM, httpUrl) {
  var m_connected = false;                                    //webscoket是否连接成功
  var noop = function () { };                                   //空函数
  var tFn = noop;                                             //连接丢失之前的操作，在连接恢复后执行
  var userList = [];                                          //记录用户列表及消息列表
  var shopInfo = {};                                          //记录用户信息，避免重复获取
  var his = {};                                               //当前消息列表，会获取一次最新的历史消息
  var regs = {};                                              //用户是否注册过，防止重复提交注册验证
  var defaultLogo = '/common/js/libs/im/default.gif';                        //默认头像
  var target = {};                                            //当前窗口实例
  var chat_im_dlg, chat_his_dlg;                              //保存仅有的实例窗口
  var chat_index = -1;                                        //保证聊天窗口与用户列表信息索引一致
  var pt = { dx: 0, dy: 0, update: false };                     //移动后的窗口坐标信息
  var OPS = {
    merge: false,       //窗口合并,为true时，忽略多窗口
    multiple: true,     //多个窗口
    listopen: false      //消息列表双击打开聊天框
  };
  var multiple_ims = [];  //记录多窗口实例
  var IM = null;          //聊天窗口构造函数
  var Z = 102;            //多窗口层叠索引值
  var config = {
    contactUser: httpUrl.baseUrl + '/im/getContactUserInfo',        //获取历史联系人或单个联系人信息
    regist: httpUrl.baseUrl + '/im/contactUser',                    //点击联系他注册
    base_url: '/common/js/libs/im',                                  //表情目录
    searchHistory: httpUrl.baseUrl + '/im/getHistoryMsgByUserId',   //获取历史信息
    clearUnreadMsg: httpUrl.baseUrl + '/im/delUnreadMsg',           //清除所有未读
    token: httpUrl.baseUrl + '/im/getUserToken'                     //获取IM token
  };
  WebIM.config = imconfig;
  var conn = {};
  conn = WebIM.conn = new WebIM.connection({
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: true,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    isStropheLog: WebIM.config.isStropheLog,
    delivery: WebIM.config.delivery
  });

  function listen (ops) {
    conn.listen({
      onOpened: function (message) {          //连接成功回调
        m_connected = true;
        tFn();
        tFn = noop;
        console.log('connect success');
      },
      onClosed: function (message) {
        m_connected = false;
        errorTips('IM连接已关闭');
      },         //连接关闭回调
      onTextMessage: function (message) {
        ops.onMessage(message);
      },    //收到文本消息
      onPictureMessage: function (message) {
        ops.onPictureMessage(message);
      }, //收到图片消息
      onFileMessage: function (message) {
        ops.onFileMessage(message);
      },    //收到文件消息
      onError: function (message) {
      }       //收到消息已读回执

    });
  }

  function connect (token, userName) {
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: userName,
      accessToken: token,
      appKey: WebIM.config.appkey
    };
    conn.open(options);
  }

  function send (txt, user) {
    var id = conn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
      msg: txt,                  // 消息内容
      to: user,                          // 接收消息对象（用户id）
      roomType: false,
      success: function (id, serverMsgId) {
      },                                       // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
      fail: function (e) {
        errorTips('消息发送失败');
      }                                        // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
    });
    conn.send(msg.body);
  }

  var mixins = {
    props: {
      userinfo: {
        type: Object,
        default: function(){
          return {}
        }
      }
    },
    data: function () {
      return {
        targetId: '',
        chat_title: '',
        chat_logo: '',
        show: false,
        anis: false,
        //表情
        gifs: [
          '/emoji/0.gif', '/emoji/1.gif', '/emoji/2.gif', '/emoji/3.gif', '/emoji/4.gif', '/emoji/5.gif', '/emoji/6.gif', '/emoji/7.gif', "/emoji/8.gif",
          '/emoji/9.gif', '/emoji/10.gif', '/emoji/11.gif', '/emoji/12.gif', '/emoji/13.gif', '/emoji/14.gif', '/emoji/15.gif'
        ],
        m_message: '',
        emoji: false,
        err_msg: false,
        // 0: send, 1: recive
        list: []
      };
    },
    computed: {
      userHead: function () {
        if (this.userinfo.userLogo) {
          return this.userinfo.userLogo;
        }
        return defaultLogo;
      }
    },
    methods: {
      sendImage: function (input) {
        var id = conn.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('img', id);        // 创建图片消息
        var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
        var index = this.list.length;
        var $this = this;
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: this.targetId,                       // 接收消息对象
          roomType: false,
          onFileUploadError: function () {      // 消息上传失败
            $this.list[index].anis = 0;
            errorTips('图片发送失败');
          },
          onFileUploadComplete: function () {   // 消息上传成功
            $this.list[index].anis = 0;
            //console.log('onFileUploadComplete');
          },
          success: function () {                // 消息发送成功
            //console.log('Success');
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
        this.list.push({
          type: 0,
          datetime: formatTime(),
          userName: this.userinfo.userName,
          anis: 1,
          message: '<img class="chat-img-pick" src="' + file.url + '">'
        });
        imgOnload(file.url, function () {
          $this.scrollBottom();
        });
      },
      //有可会出现为空的情况，用null来代替
      getShopName: function (id) {
        if (shopInfo[id]) {
          return shopInfo[id].name;
        }
        return null;
      },
      sendFile: function (input) {
        var id = conn.getUniqueId();                   // 生成本地消息id
        var msg = new WebIM.message('file', id);        // 创建文件消息
        var file = WebIM.utils.getFileUrl(input);      // 将文件转化为二进制文件
        var index = this.list.length;
        var $this = this;
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: this.targetId,                       // 接收消息对象
          roomType: false,
          onFileUploadError: function () {      // 消息上传失败
            $this.list[index].anis = 0;
            errorTips('文件发送失败');
          },
          onFileUploadComplete: function () {   // 消息上传成功
            $this.list[index].anis = 0;
            //console.log('onFileUploadComplete');
          },
          success: function () {                // 消息发送成功
            //console.log('Success');
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
        this.list.push({
          type: 0,
          datetime: formatTime(),
          userName: this.userinfo.userName,
          anis: 1,
          message: '<i class="iconfont icon-wenjian"></i>' + input.files[0].name
        });
      },
      //清除所有未读消息
      clearUnreadMsg: function () {
        var $this = this;
        this.$http.post(config.clearUnreadMsg).then(function (res) {
          $this.$emit('clearmsg');
        });
      },
      hideGif: function () {
        this.emoji = false;
      },
      //文件选择0: 图片，1: 文件
      fileSelect: function (type) {
        var $this = this;
        var fl = this.$refs.file;
        this.fileType = type;
        this.hideGif();
        if (!this._bindchange) {
          this._bindchange = true;
          fl.onchange = function () {
            var files = fl.files[0];
            var err = 0;
            if ($this.fileType === 1) {
              if (!(/\.(gif|png|jpeg|jpg|bmp)$/.test(files.name.toLocaleLowerCase()))) {
                err = '不是一个图片';
              } else if (files.size === 0) {
                err = '图片大小不能为0';
              } else if (files.size > 1048576) {
                err = '图片太大，不能超过1MB';
              }
            } else {
              if (!(/\.(gif|png|jpeg|jpg|bmp|txt|zip|doc|pdf|xlsx|psd|rar|xls|docx)$/.test(files.name.toLocaleLowerCase()))) {
                err = '不支持此类文件传输';
              } else if (files.size === 0) {
                err = '文件大小不能为0';
              } else if (files.size > 104857600) {
                err = '文件太大，不能超过100MB';
              }
            }
            if (err) {
              errorTips(err);
            } else {
              $this.fileType === 1 ? $this.sendImage(fl) : $this.sendFile(fl);
            }
            fl.value = '';
          };
        }
        this.$refs.file.click();
      },
      showEmoji: function () {
        this.emoji = !this.emoji;
      },
      selectGif: function (index) {
        this.m_message += '[:' + index + ']';
        this.emoji = false;
        this.$refs.textarea.focus();
      },
      getGif: function (src) {
        return config.base_url + src;
      },
      mouseDown: function (e) {
        var target = e.target;
        var container = this.$refs.container;
        var lx = container.offsetLeft;
        var ly = container.offsetTop;
        var x = e.clientX;
        var y = e.clientY;
        var mm = function (e) {
          e.preventDefault();
          var dx = e.clientX - x + lx;
          var dy = e.clientY - y + ly;
          if (dx < 0) {
            dx = 0;
          } else if (dx > document.body.clientWidth - container.offsetWidth) {
            dx = document.body.clientWidth - container.offsetWidth;
          }
          if (dy < 0) {
            dy = 0;
          } else if (dy > document.body.clientHeight - container.offsetHeight) {
            dy = document.body.clientHeight - container.offsetHeight;
          }
          pt.dx = dx;
          pt.dy = dy;
          pt.update = true;
          container.style.marginLeft = dx + 'px';
          container.style.marginTop = dy + 'px';
        };
        var mu = function (e) {
          document.removeEventListener('mousemove', mm);
          document.removeEventListener('mouseup', mu);
        };
        document.addEventListener('mousemove', mm);
        document.addEventListener('mouseup', mu);
        if (this._mpl) {
          this.top();
          e.stopPropagation();
        }
      },
      gifConvert: function (msg) {
        var $this = this;
        return msg.replace(/\[:(\d*)\]/g, function (a, b) {
          return '<img class="c-chat-facegif" src="' + config.base_url + '/' + $this.gifs[b] + '">';
        });
      },
      updatePosition: function () {
        if (pt.update) {
          var container = this.$refs.container;
          container.style.marginLeft = pt.dx + 'px';
          container.style.marginTop = pt.dy + 'px';
        }
      },
      filterMsg: function (msg) {
        var $this = this;
        return msg.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/[\n\r]/g, '<br>').replace(/\s/g, '&nbsp;');
      },
      hideError: function () {
        var $this = this;
        setTimeout(function () {
          $this.err_msg = false;
        }, 2000);
      },
      sendByEnter: function (e) {
        if (e.ctrlKey && e.keyCode === 13) {
          e.preventDefault();
          this.send();
        }
      },
      scrollBottom: function () {
        this.$nextTick(function () {
          this.$refs.record.scrollTop = this.$refs.record.scrollHeight;
        });
      },
      initScroll: function () {
        var $this = this;
        //监听是否有新元素添加
        this.$refs.viewchat.addEventListener('DOMNodeInserted', function () {
          $this.scrollBottom();
        });
      },
      checkUserList: function (message, ob, tm) {
        var n = indexOfList(userList, message.from, 'userId');
        var _readed = message.from === target.targetId ? true : false;
        var msg = message.data || '';
        if (message.type === 'img') {
          msg = '[图片]';
        } else if (message.type === 'file') {
          msg = '[文件]';
        }
        if (OPS.multiple && multiple_ims.length > 0 && !_readed) {
          var m = indexOfList(multiple_ims, message.from, 'targetId');
          if (m > -1) {
            multiple_ims[m].tooltips();
          }
        }
        //服务器历史消息包含了最新的离线消息，避免重复
        if (message.delay) return;
        if (n > -1) {
          //如果拉取过历史记录才加入新的消息，避免重复
          if (his[message.from]) {
            userList[n].list.push(ob);
          }
          userList[n].time = tm.split(' ').pop();
          userList[n]._readed = _readed;
          userList[n].message = msg;
        } else {
          userList.push({
            userId: message.from,
            userName: ob.userName,
            message: msg,
            time: tm.split(' ').pop(),
            _readed: _readed,
            list: []
          });
          if (ob.userName === null) {
            var index = userList.length - 1;
            this.getShopInfo(message.from, function (res) {
              var name = shopInfo[message.from].name;
              var logo = shopInfo[message.from].logo;
              userList[index].userName = name;
              userList[index].userLogo = logo;
            });
          }
        }
      },
      pickText: function (e) {
        if (e.target.nodeName === 'IMG' && e.target.className === 'chat-img-pick') {
          imgPreview(e.target);
        }
      },
      onPictureMessage: function (message) {
        var tm = this.getTime(message);
        var userName = this.getShopName(message.from);
        message.type = 'img';
        var ob = {
          type: 1,
          datetime: tm,
          userName: userName,
          message: '<img class="chat-img-pick" src="' + message.url + '">'
        };
        if (OPS.multiple && multiple_ims.length > 0) {
          var m = indexOfList(multiple_ims, message.from, 'targetId');
          imgOnload(message.url, function () {
            multiple_ims[m].scrollBottom();
          });
        }
        imgOnload(message.url, function () {
          target.scrollBottom();
        });
        this.checkUserList(message, ob, tm);
      },
      onFileMessage: function (message) {
        var tm = this.getTime(message);
        var userName = this.getShopName(message.from);
        message.type = 'file';
        var ob = {
          type: 1,
          datetime: tm,
          userName: userName,
          message: '<i class="iconfont icon-wenjian"></i>' + message.filename + '<a target="_blank" href="' + message.url + '">下载</a>'
        };
        this.checkUserList(message, ob, tm);
      },
      onMessage: function (message) {
        var tm = this.getTime(message);
        var userName = this.getShopName(message.from);
        message.type = 'txt';
        var ob = {
          type: 1,
          datetime: tm,
          userName: userName,
          message: this.gifConvert(message.data)
        };
        this.checkUserList(message, ob, tm);
      },
      close: function () {
        this.show = false;
        this.userName = '';
      },
      getTime: function (message) {
        return message.delay ? formatTime(new Date(message.delay).getTime()) : formatTime();
      },
      getShopInfo: function (userId, fn, reject) {
        var $this = this;
        reject = reject || noop;
        this.$http.post(config.contactUser, { contactUserId: userId }).then(function (res) {
          res.result.forEach(function (d) {
            if (!shopInfo[d.userId]) {
              shopInfo[d.userId] = {
                name: d.nickName,
                logo: d.headPath || defaultLogo,
                time: d.shopData || '',
                addr: d.shopAddr || '',
                isShop: d.isShop
              };
            }
          });
          fn.call($this, res.result);
        }).catch(function () {
          reject();
        });
      },
      //获取最新50条聊天记录，包含了最新离线消息
      getLastMsgs: function () {
        var id = this.targetId;
        if (!his[id]) {
          var $this = this;
          var m = indexOfList(userList, id, 'userId');
          if (m > -1) {
            this.$http.post(config.searchHistory, {
              toUserId: id,
              pageNum: -1,
              pageSize: this.pageSize
            }).then(function (res) {
              his[id] = 1;
              $this.convertMessage(res.result.list).forEach(function (d) {
                userList[m].list.push(d);
              });
              $this.list = userList[m].list;
            });
          }
        }
      },
      convertMessage: function (list) {
        var id = this.userinfo.userId;
        var name = this.userinfo.userName;
        var a = [];
        var $this = this;
        list.forEach(function (d) {
          var o = { datetime: d.timestamp };
          var fId = d.fromUserId;
          if (fId === id) {
            o.userName = name;
            o.type = 0;
          } else {
            o.userName = $this.getShopName(fId);
            o.type = 1;
          }
          if (d.type === 'txt') {
            o.message = d.msg;
          } else if (d.type === 'img') {
            o.message = '<img class="chat-img-pick" src="' + d.msg + '">';
          } else if (d.type === 'file') {
            var index = d.msg.indexOf(':');
            var filename = d.msg.substr(0, index);
            var filepath = httpUrl.imgUploadUrl + '/file/download?filePath=' + d.msg.substr(index + 1);
            o.message = '<i class="iconfont icon-wenjian"></i>' + filename + '<a target="_blank" href="' + filepath + '">下载</a>';
          } else {
            o.message = '';
          }
          a.push(o);
        });
        return a;
      },
      connectWS: function (fn) {
        var $this = this;
        fn = fn || noop;
        if (!m_connected) {
          var onMessage = this.onMessage.bind(this);
          var onPictureMessage = this.onPictureMessage.bind(this);
          var onFileMessage = this.onFileMessage.bind(this);
          this.$http.get(config.token).then(function (res) {
            var token = res.result;
            listen({
              onMessage: onMessage,
              onPictureMessage: onPictureMessage,
              onFileMessage: onFileMessage
            });
            connect(token, $this.userinfo.userId);
            tFn = fn;
          }).catch(function () {
            errorTips('获取授权出错');
          });
        } else {
          fn.call(this);
        }
      },
      send: function () {
        var $this = this;
        this.hideGif();
        if (this.m_message.length < 1) {
          this.err_msg = true;
        } else if (this.m_message.length > 1000) {
          errorTips('1000字符以内');
        } else {
          this.connectWS(function () {
            var msg = $this.filterMsg($this.m_message);
            $this.list.push({
              type: 0,
              datetime: formatTime(),
              userName: $this.userinfo.userName,
              message: msg
            });
            $this.m_message = '';
            send(msg, $this.targetId);
            $this.$refs.textarea.focus();
          });
        }
      }
    }
  };
  var chat = {
    install: function (vue) {
      vue.component('chat-history', function (resolve) {
        $.get(config.base_url + '/history.html', function (res) {
          resolve({
            template: res,
            mixins: [mixins],
            data: function () {
              return {
                m_getlist_once: false, //只获取一次用户列表
                keyId: 0, //节流
                recordList: [], //历史消息
                userList: [], //消息列表
                userName: '', //搜索用户名
                page: -1,
                pageSize: 50,
                totalPage: 1,
                m_prev_disable: true,
                m_next_disable: true,
                m_history_keyword: '',  //历史消息搜索关键字
                m_history: false, //默认聊天框
                menuActiveIndex: 0, //默认当前消息
                userActiveIndex: -1, //消息列表激活项
                date: formatTime('Y-M-D')
              }
            },
            methods: {
              init: function () {
                var $this = this;
                if (userList.length > 0) {
                  var n = 0;
                  if (this.userActiveIndex === -1) {
                    this.userActiveIndex = n;
                  } else {
                    n = this.userActiveIndex;
                  }
                  this.list = userList[n].list;
                  userList[n]._readed = true;
                  this.userList = userList;
                  this.targetId = userList[n].userId;
                  this.chat_title = userList[n].userName;
                  this.getLastMsgs();
                  if (this.menuActiveIndex === 1) {
                    this.search();
                  }
                }
                this.connectWS(function () {
                  $this.$nextTick(()=>{
                    $this.show = true;
                  })
                  $this.scrollBottom();
                  $this.clearUnreadMsg();
                });
              },
              showDlg: function () {
                var $this = this;
                target = this;
                this.updatePosition();
                if (chat_im_dlg) {
                  if (OPS.multiple) {
                    multiple_ims.forEach(function (d) {
                      d.close();
                    });
                  }
                  chat_im_dlg.close();
                }
                if (chat_index > -1) {
                  this.userActiveIndex = chat_index;
                }
                if (!$this.m_getlist_once) {
                  $this.getShopInfo('', function (res) {
                    $this.m_getlist_once = true;
                    res.sort(function (a, b) {
                      if (a.lastTime && b.lastTime) {
                        return b.lastTime.localeCompare(a.lastTime);
                      }
                      return 0;
                    });
                    res.forEach(function (d) {
                      if (indexOfList(userList, d.userId, 'userId') < 0 && d.userId !== $this.userinfo.userId) {
                        var ob = shopInfo[d.userId];
                        regs[d.userId] = 1;
                        var o = {
                          userId: d.userId,
                          userLogo: ob.logo,
                          userName: ob.name,
                          list: []
                        };
                        if (d.lastMsg) {
                          if (d.type === 'txt') {
                            o.message = d.lastMsg;
                          } else if (d.type === 'file') {
                            o.message = '[文件]';
                          } else if (d.type === 'img') {
                            o.message = '[图片]';
                          }
                          o.time = d.lastTime.split(' ').pop();
                        }
                        userList.push(o);
                      }
                    });
                    $this.init();
                  }, function () {
                    errorTips('获取用户列表失败, 请重试');
                  });
                } else {
                  this.init();
                }
              },
              searchUserByEnter: function (e) {
                var $this = this;
                clearTimeout(this.keyId);
                if (e.keyCode === 13) {
                  this.searchUser();
                } else {
                  this.keyId = setTimeout(function () {
                    $this.searchUser();
                  }, 500);
                }
              },
              searchUser: function () {
                var name = this.userName;
                var a = [];
                var exp = new RegExp('.*' + name + '.*');
                userList.forEach(function (d) {
                  if (exp.test(d.userName)) {
                    a.push(d);
                  }
                });
                if (a.length > 0) {
                  this.list = a[0].list;
                  this.targetId = a[0].userId;
                  this.chat_title = a[0].userName;
                  a[0]._readed = true;
                  this.userActiveIndex = 0;
                  if (this.m_history) {
                    this.search();
                  } else {
                    this.getLastMsgs();
                  }
                } else {
                  this.list = [];
                  this.targetId = null;
                  this.chat_title = '';
                  this.userActiveIndex = -1;
                  this.recordList = [];
                }
                this.userList = a;
              },
              activeUser: function (v, n) {
                if (this.userActiveIndex !== n) {
                  this.userActiveIndex = n;
                  chat_index = n;
                  this.targetId = v.userId;
                  if (chat_im_dlg) {
                    chat_im_dlg.targetId = v.userId;
                  }
                  this.list = userList[n].list;
                  this.chat_title = userList[n].userName;
                  this.resetPage();
                  v._readed = true;
                  if (this.m_history) {
                    this.search();
                  } else {
                    this.getLastMsgs();
                    this.$nextTick(function () {
                      this.scrollBottom();
                    });
                  }
                }
              },
              popDlg: function (v, n) {
                if (!OPS.listopen) return;
                this.show = false;
                this.userActiveIndex = n;
                chat_index = n;
                this.targetId = v.userId;
                v._readed = true;
                var m = indexOfList(userList, v.userId, 'userId');
                chat_im_dlg.targetId = v.userId;
                chat_im_dlg.businfo = shopInfo[v.userId];
                chat_im_dlg.chat_title = shopInfo[v.userId].name;
                chat_im_dlg.chat_logo = shopInfo[v.userId].logo;
                chat_im_dlg.list = userList[m].list;
                merge.call(chat_im_dlg);
              },
              activeMenu: function (n) {
                if (this.menuActiveIndex !== n) {
                  this.menuActiveIndex = n;
                  this.m_history = n === 0 ? false : true;
                }
                if (n === 1) {
                  this.search();
                } else {
                  this.getLastMsgs();
                }
              },
              searchByBtn: function () {
                this.resetPage();
                this.search();
              },
              search: function () {
                if (!this.targetId) return;
                var $this = this;
                this.$http.post(config.searchHistory, {
                  searchDate: this.date,
                  toUserId: this.targetId,
                  searchMsg: this.m_history_keyword,
                  pageNum: this.page,
                  pageSize: this.pageSize
                }).then(function (res) {
                  $this.totalPage = res.result.pages;
                  if ($this.page === -1) {
                    $this.page = $this.totalPage;
                  }
                  if ($this.totalPage > $this.page) {
                    $this.m_next_disable = false;
                  }
                  if ($this.page > 1) {
                    $this.m_prev_disable = false;
                  }
                  $this.recordList = $this.convertMessage(res.result.list);
                  $this.$nextTick(function () {
                    $this.$refs.history.scrollTop = 0; //每次翻页置顶
                  });
                }).catch(function () {
                  errorTips('获取历史消息失败，请重试');
                });
              },
              searchHistory: function (e) {
                if (e.keyCode === 13) {
                  this.resetPage();
                  this.search();
                }
              },
              resetPage: function () {
                this.page = -1;
                this.m_prev_disable = true;
                this.m_next_disable = true;
              },
              toPage: function (n) {
                switch (n) {
                  case 0:
                    if (this.m_prev_disable) {
                      return;
                    }
                    this.page = 1;
                    this.m_prev_disable = true;
                    break;
                  case 1:
                    if (this.m_next_disable) {
                      return;
                    }
                    if (this.page + 1 <= this.totalPage) {
                      this.page++;
                    }
                    break;
                  case -1:
                    if (this.m_prev_disable) {
                      return;
                    }
                    if (this.page - 1 >= 1) {
                      this.page--;
                    }
                    break;
                  case 2:
                    if (this.m_next_disable) {
                      return;
                    }
                    this.page = this.totalPage;
                    this.m_next_disable = true;
                    break;
                }
                this.m_prev_disable = this.page > 1 ? false : true;
                this.m_next_disable = this.page < this.totalPage ? false : true;
                this.search();
              }
            },
            mounted: function () {
              var $this = this;
              this.initScroll();
              if (!chat_his_dlg) {
                chat_his_dlg = this;
              }
              laydate.render({
                elem: '.c-laydate',
                value: this.date,
                done: function (v) {
                  $this.date = v;
                  $this.m_history_keyword = '';
                  $this.resetPage();
                  $this.search();
                }
              });
              this.$root.$chat_history = this;
            }
          });
        });
      });
      vue.component('chat-im', function (resolve) {
        $.get(config.base_url + '/chat.html', function (res) {
          var ob = {
            template: res,
            mixins: [mixins],
            data: function () {
              return {
                //店铺推荐
                recommend: [
                  {
                    name: '店铺1',
                    logo: '/im/emoji/0.gif',
                    price: 4500.00,
                    fav: 45,
                    link: '#1'
                  }, {
                    name: '店铺1',
                    logo: '/im/emoji/1.gif',
                    price: 4500.00,
                    fav: 45,
                    link: '#2'
                  }
                ],
                //店铺信息
                businfo: {
                  name: '', //名字
                  time: '', //开店时间
                  scale: '', //规模
                  addr: '', //地址
                  serve_score: 4.99, //服务评分
                  speed_score: 4.88, //速度评分
                  quality_score: 4.98//质量评分
                }
              }
            },
            mounted: function () {
              this.initScroll();
              if (!chat_im_dlg) {
                chat_im_dlg = this;
              }
              this.$root.$chat_im = this;
            },
            watch: {
              show: function () {
                this.scrollBottom();
              }
            },
            methods: {
              regIm: function (userId, fn) {
                var $this = this;
                this.$http.get(config.regist, { userId: userId }).then(function (res) {
                  if (res.code === 'rest.success') {
                    regs[userId] = 1;
                    fn.call($this);
                  } else {
                    $this.targetId = '';
                  }
                });
              },
              connect: function (id) {
                var $this = this;
                target = this;
                var onMessage = this.onMessage.bind(this);
                if (!this.userinfo.userName) {
                  errorTips('请先登录');
                } else {
                  if (this.userinfo.userId === id) {
                    errorTips('不能联系自己！');
                    return;
                  } else if (this.targetId === id && !shopInfo[id] && !regs[id]) {
                    errorTips('正在努力连接中，请不要重复连接');
                    return;
                  }
                  this.targetId = id;
                  var n = indexOfList(userList, id, 'userId');
                  var userName = this.getShopName(id);
                  if (n < 0) {
                    userList.push({
                      userId: id,
                      userName: userName,
                      time: formatTime().split(' ').pop(),
                      list: []
                    });
                    chat_index = userList.length - 1;
                    this.list = userList[userList.length - 1].list;
                  } else {
                    this.list = userList[n].list;
                    chat_index = n;
                  }
                  if (userName === null) {
                    var l = userList.length - 1;
                    this.getShopInfo(id, function (res) {
                      userList[l].userName = shopInfo[id].name;
                      userList[l].userLogo = shopInfo[id].logo;
                      userList[l]._readed = true;
                      $this.chat_title = shopInfo[id].name;
                      $this.chat_logo = shopInfo[id].logo;
                      $this.businfo = shopInfo[id];
                      $this.getLastMsgs();
                      updateMpl(id);
                    });
                  } else {
                    this.chat_title = shopInfo[id].name;
                    this.chat_logo = shopInfo[id].logo;
                    this.businfo = shopInfo[id];
                  }
                  if (!regs[id]) {
                    this.regIm(id, function () {
                      $this.connectWS(function () {
                        merge.call($this);
                        $this.scrollBottom();
                      });
                    });
                  } else {
                    this.connectWS(function () {
                      merge.call($this);
                      $this.scrollBottom();
                    });
                  }
                }
              },
            }
          };
          resolve(ob);
          IM = vue.extend(ob);
        });
      });
    }
  };

  loadCss(config.base_url + '/chat.css');

  function updateMpl (id) {
    if (OPS.multiple && multiple_ims.length > 0) {
      var n = indexOfList(multiple_ims, id, 'targetId');
      if (n > -1) {
        var ob = multiple_ims[n];
        ob.businfo = shopInfo[id];
        ob.chat_title = shopInfo[id].name;
        ob.chat_logo = shopInfo[id].logo;
      }
    }
  }

  function merge () {
    this.updatePosition();
    if (chat_his_dlg && OPS.merge) {
      if (!chat_his_dlg.show) {
        if (!chat_im_dlg.show) {
          this.show = true;
        } else {
          chat_im_dlg.close();
          chat_his_dlg.showDlg();
        }
      } else {
        chat_his_dlg.showDlg();
      }
    } else if (IM && OPS.multiple && !OPS.merge) {
      if (chat_his_dlg && chat_his_dlg.show) {
        chat_his_dlg.showDlg();
        return;
      }
      var m = indexOfList(multiple_ims, this.targetId, 'targetId');
      if (m < 0) {
        var $this = this;
        let im = document.createElement('div');
        im.setAttribute("id", "im_box");
        document.body.append(im)
        var s = new IM({
          el: '#im_box', created: function () {
            this._mpl = true;
            this.targetId = $this.targetId;
            this.userinfo = $this.userinfo;
            this.businfo = $this.businfo;
            this.chat_title = $this.chat_title;
            this.chat_logo = $this.chat_logo;
            this.list = $this.list;
            this.show = true;
            this.anis = false;
          },
          mounted: function () {
            this.$el.style.zIndex = Z;
            this._append = true;
            var $this = this;
            //this.updatePosition();  //新窗口不更新坐标
            this.$el.firstChild.addEventListener('mousedown', function () {
              $this.top();
            });
          },
          methods: {
            tooltips: function () {
              this.anis = true;
            },
            append: function () {
              this._append = true;
              this.show = true;
              document.body.appendChild(this.$el);
            },
            remove: function () {
              if (this._append) {
                this._append = false;
                document.body.removeChild(this.$el);
              }
            },
            top: function () {
              this.anis = false;
              var m = indexOfList(userList, this.targetId, 'userId');
              userList[m]._readed = true;
              this.$el.style.zIndex = Z++;
              target = this;
              chat_im_dlg.targetId = this.targetId;
              chat_index = m;
            },
            close: function () {
              this.show = false;
              this.remove();
            }
          }
        });
        document.body.appendChild(s.$el);
        multiple_ims.push(s);
      } else {
        multiple_ims[m].append();
        multiple_ims[m].updatePosition();
        multiple_ims[m].top();
      }
    } else {
      this.show = true;
      if (chat_his_dlg && chat_his_dlg.show) {
        chat_his_dlg.close();
      }
    }
  }

  function errorTips (msg) {
    var d = document.createElement('div');
    d.className = 'c-chat-errortips';
    d.innerHTML = '[IM]：' + msg;
    document.body.appendChild(d);
    setTimeout(function () {
      d.className = 'c-chat-errortips anis';
      setTimeout(function () {
        d.className = 'c-chat-errortips';
        setTimeout(function () {
          document.body.removeChild(d);
        }, 300);
      }, 2000);
    }, 30);
  }

  function imgOnload (src, fn) {
    var img = new Image();
    img.src = src;
    img.style.display = 'none';
    img.onload = function () {
      fn();
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
  }

  function imgPreview (target) {
    var c = document.createElement('div');
    var d = document.createElement('div');
    var ww = document.body.clientWidth;
    var hh = document.body.clientHeight;
    var parent = target.parentNode;
    c.style.cssText = 'position:fixed;z-index:99999;background:rgba(0,0,0,0.9);width:100%;height:100%;top:0;left:0';
    d.style.cssText = 'position:absolute;overflow:auto';
    target.style.width = target.naturalWidth + 'px';
    target.style.height = target.naturalHeight + 'px';
    if (target.naturalWidth > ww) {
      d.style.width = '90%';
      d.style.left = '5%';
      if (target.naturalHeight >= hh) {
        d.style.height = '90%';
        d.style.top = '5%';
      } else {
        d.style.height = target.naturalHeight + 'px';
        d.style.top = (hh - target.naturalHeight) / 2 + 'px';
      }
    } else if (target.naturalHeight > hh) {
      d.style.height = '90%';
      d.style.top = '5%';
      d.style.width = target.naturalWidth + 'px';
      d.style.left = (ww - target.naturalWidth) / 2 + 'px';
    } else {
      d.style.height = target.naturalHeight + 'px';
      d.style.width = target.naturalWidth + 'px';
      d.style.top = (hh - target.naturalHeight) / 2 + 'px';
      d.style.left = (ww - target.naturalWidth) / 2 + 'px';
    }
    d.appendChild(target);
    c.appendChild(d);
    c.onclick = function () {
      target.style.cssText = '';
      parent.appendChild(target);
      document.body.removeChild(c);
    };
    document.body.appendChild(c);
  }

  function indexOfList (ar, v, key) {
    for (var i = 0, l = ar.length;i < l;i++) {
      if (ar[i][key] === v) {
        return i;
      }
    }
    return -1;
  }

  function loadCss (css) {
    var link = document.createElement('link');
    link.href = css;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    $('head')[0].appendChild(link);
  }

  function formatTime (timestamp, format) {
    var time;
    if (!isNaN(timestamp)) {
      time = new Date(Number(timestamp));
    } else {
      time = new Date();
      if (typeof timestamp === 'string' && typeof format === 'undefined') {
        format = timestamp;
      }
    }
    var key = {
      Y: time.getFullYear() < 10 ? '0' + time.getFullYear() : time.getFullYear(),
      M: time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1,
      D: time.getDate() < 10 ? '0' + time.getDate() : time.getDate(),
      h: time.getHours() < 10 ? '0' + time.getHours() : time.getHours(),
      m: time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes(),
      s: time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds(),
      d: time.getDay()
    };
    var _f = function (format) {
      return format.replace(/[YMDhmsd]/g, function (a) {
        return key[a];
      });
    };
    return typeof format === 'string' ? _f(format) : _f('Y-M-D h:m:s');
  }

  return chat;
});
