(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-mine-change-psword"],{"02a5":function(n,r,t){"use strict";t.r(r);var o=t("f44f"),e=t.n(o);for(var a in o)"default"!==a&&function(n){t.d(r,n,(function(){return o[n]}))}(a);r["default"]=e.a},"1ead":function(n,r,t){var o=t("24fb");r=o(!1),r.push([n.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */uni-page-body[data-v-22f74af6]{background-color:#e9eff5}body.?%PAGE?%[data-v-22f74af6]{background-color:#e9eff5}',""]),n.exports=r},"592b":function(n,r,t){"use strict";t.r(r);var o=t("61d8"),e=t("02a5");for(var a in e)"default"!==a&&function(n){t.d(r,n,(function(){return e[n]}))}(a);t("dae7"),t("c0b8");var s,i=t("f0c5"),u=Object(i["a"])(e["default"],o["b"],o["c"],!1,null,"22f74af6",null,!1,o["a"],s);r["default"]=u.exports},"595b":function(n,r,t){var o=t("24fb");r=o(!1),r.push([n.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.change-psword .u-form[data-v-22f74af6]{background-color:#fff}.change-psword .u-form .u-form-item[data-v-22f74af6]{padding-left:%?20?%!important;padding-right:%?20?%!important}',""]),n.exports=r},"61d8":function(n,r,t){"use strict";t.d(r,"b",(function(){return e})),t.d(r,"c",(function(){return a})),t.d(r,"a",(function(){return o}));var o={uForm:t("1858").default,uFormItem:t("ab32").default,uInput:t("e89b").default},e=function(){var n=this,r=n.$createElement,t=n._self._c||r;return t("v-uni-view",{staticClass:"change-psword"},[t("u-form",{ref:"uForm",attrs:{model:n.form,"label-width":"150"}},[t("u-form-item",{attrs:{label:"旧密码"}},[t("u-input",{attrs:{placeholder:"请输入旧密码"},model:{value:n.form.oldPassword,callback:function(r){n.$set(n.form,"oldPassword",r)},expression:"form.oldPassword"}})],1),t("u-form-item",{attrs:{label:"新密码"}},[t("u-input",{attrs:{type:"password",placeholder:"请输入新密码"},on:{blur:function(r){arguments[0]=r=n.$handleEvent(r),n.toTest("newPassword1")}},model:{value:n.form.newPassword1,callback:function(r){n.$set(n.form,"newPassword1",r)},expression:"form.newPassword1"}})],1),t("u-form-item",{attrs:{label:"确认密码"}},[t("u-input",{attrs:{type:"password",placeholder:"请再次输入新密码"},on:{blur:function(r){arguments[0]=r=n.$handleEvent(r),n.toTest("newPassword")}},model:{value:n.form.newPassword,callback:function(r){n.$set(n.form,"newPassword",r)},expression:"form.newPassword"}})],1)],1),t("v-uni-view",{staticClass:"common-blue-button font32",on:{click:function(r){arguments[0]=r=n.$handleEvent(r),n.toChange.apply(void 0,arguments)}}},[n._v("完成")])],1)},a=[]},7194:function(n,r,t){var o=t("595b");"string"===typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);var e=t("4f06").default;e("a69a1ad2",o,!0,{sourceMap:!1,shadowMode:!1})},"7a8a":function(n,r,t){var o=t("1ead");"string"===typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);var e=t("4f06").default;e("5a2db554",o,!0,{sourceMap:!1,shadowMode:!1})},c0b8:function(n,r,t){"use strict";var o=t("7194"),e=t.n(o);e.a},dae7:function(n,r,t){"use strict";var o=t("7a8a"),e=t.n(o);e.a},f44f:function(n,r,t){"use strict";var o=t("4ea4");Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0,t("96cf");var e=o(t("1da1")),a=o(t("5b43")),s=t("dbca").Base64,i=new a.default,u={data:function(){return{flag:!1,form:{oldPassword:"",newPassword1:"",newPassword:""}}},methods:{toChange:function(){var n=this;return(0,e.default)(regeneratorRuntime.mark((function r(){var t;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(n.form.oldPassword){r.next=3;break}return uni.showToast({title:"请输入旧密码",icon:"none"}),r.abrupt("return");case 3:if(n.form.newPassword){r.next=6;break}return uni.showToast({title:"请输入新密码",icon:"none"}),r.abrupt("return");case 6:if(n.form.newPassword){r.next=9;break}return uni.showToast({title:"请确认密码",icon:"none"}),r.abrupt("return");case 9:if(!n.flag){r.next=14;break}return r.next=12,i.changePassword({oldPassword:s.encode(n.form.oldPassword),newPassword:s.encode(n.form.newPassword)});case 12:t=r.sent,"成功"===t&&(uni.showToast({title:"修改成功, 请重新登录",icon:"none"}),setTimeout((function(){n.$store.dispatch("LoginOut")}),500));case 14:case"end":return r.stop()}}),r)})))()},toTest:function(n){var r=/^([0-9]|[a-zA-Z]){6,16}$/,t=this.form[n];if(!r.test(t))return uni.showToast({title:"请输入6-16位数字或字母",icon:"none"}),void(this.flag=!1);if(this.form.oldPassword){if(this.form.oldPassword===t)return uni.showToast({title:"新密码不能与旧密码相同，请重新输入",icon:"none"}),void(this.flag=!1);this.flag=!0}var o="newPassword1"===n?"newPassword":"newPassword1";this.form[o]&&(this.form[o]!==t?(uni.showToast({title:"密码不一致",icon:"none"}),this.flag=!1):this.flag=!0)}}};r.default=u}}]);