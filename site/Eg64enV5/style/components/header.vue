<template>
    <div class="headerBox" :class="{fixed: isfixed}">
        <div class="">
            <div class="headers" >
              <div style="background:url(./style/images/bg.png) no-repeat;width: 100%;padding-top: 37px;background-size: cover;margin-bottom: 10px">
                <div class="headers-top mmdiv">
                  <div class="header-logo">
                    <a href="">
                      <img :src="webInfo.logoUrl?webInfo.logoUrl:'./style/images/lg.png'" alt="">
                    </a>
                    <div class="logo-right">
                      <div class="title">{{webInfo.saasName || ''}}</div>
                      <!--                            <div class="sub-title">科技创新综合服务平台</div>-->
                    </div>
                  </div>
                  <div class="search-box">
                    <div class="select-box-mark">
                      <div class="select-mark" @click="openValue">
                        {{keyType}}
                      </div>
                      <div class="list" v-show="optionShow">
                        <ul>
                          <li @click="handleSelect(index,item)" v-for="(item,index) in keyOptions" :key="index">{{item.name}}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="ipt-box">
                      <input type="text" placeholder="输入关键字" v-model="searchKey">
                      <span class="iconfont iconfont-template icon-fangdajing" @click="handleSearch"></span>
                    </div>
                  </div>
                </div>
              </div>

                <div class="headers-bottom mmdiv">
                    <a :href="nav.url" :class="{active: nav.active}" v-for="(nav,index) in navs" :key="index">{{nav.label}}</a>
                    <!--  <div class="search">
                       <input type="text" class="input" placeholder="请输入关键词搜索" v-model="searchKey">
                       <span class="iconfont icon-fangdajing" @click="searchFull"></span>
                      </div>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        props: {
            isfixed: {
                type: Boolean
            },
            navIndex: {
                type: [String, Number],
                default: 0
            },
            searchTypes: {
                type: String,
                default: ''
            },
            locationNames:{
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                searchKey: '',
                navs: [
                    {
                        label: '首页',
                        url: this.$pathPrefix+'/index.html'
                    },
                    {
                        label: '政策资讯',
                        url: this.$pathPrefix+'/policyList.html'
                    },
                    {
                        label: '活动中心',
                        url: this.$pathPrefix+'/activityList.html'
                    },
                    {
                        label: '科技成果',
                        url: this.$pathPrefix+'/scienceResult.html'
                    },
                    {
                        label: '科技服务',
                        url: this.$pathPrefix+'/scienceService.html'
                    },
                    {
                        label: "平台动态",
                        url: this.$pathPrefix+'/platNews.html'
                    },
                    {
                        label: '关于我们',
                        url: this.$pathPrefix+'/about.html'
                    }
                ],
                optionShow:false,
             keyType:'政策',
             keyOptions:[
              {
                name:'政策',
                  url: this.$pathPrefix+'/policyList.html'
              },
              {
               name:'活动',
                  url: this.$pathPrefix+'/activityList.html'
              },
              {
               name:'成果',
                  url: this.$pathPrefix+'/scienceResult.html'
              },
              {
               name:'服务',
                  url: this.$pathPrefix+'/scienceService.html'
              }
             ],
                webInfo:'',
                searchUrl:this.$pathPrefix+'/policyList.html',
                locationName:'policyList.html'
            }
        },
        created: function () {
            this.keyType=this.searchTypes;
            this.locationName=this.locationNames;
            this.navs[this.navIndex].active = 1;
            window.addEventListener("setItem", (e) => {
                if(e.key==='webInfo'){
                    let info=JSON.parse(e.newValue)
                    this.webInfo=info?info:'';
                }
            });
        },
        watch: {
            navIndex: function (v) {
                this.navs.forEach(function (item, i) {
                    item.active = v === i;
                });
            },
        },
        methods: {
            handleSearch: function () {
                let list=location.pathname.split('/');
                if(list[list.length-1] === this.locationName) {
                    this.$emit('search', this.searchKey)
                } else {
                    location.href = this.searchUrl+'?title=' + this.searchKey
                }
            },
            openValue(){
                this.optionShow=!this.optionShow;
            },
            handleSelect(index,item){
             this.keyType=item.name;
             this.searchUrl=item.url;
             this.locationName=item.url.split('/')[1];
             this.optionShow=false
            },
        }
    }
</script>

<style>
    .headerBox {
        background-color: #ffffff;
    }
    .headerBox .mmdiv{
        width:1200px;
        margin:0 auto;
    }
    .headers {
        width: 100%;
        /*padding-top:30px;*/
    }

    .headers-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
     padding-bottom:37px;
    }

    .header-logo {
        display: flex;
        align-items: center;
    }

    .header-logo a {
        /*width: 124px;*/
        /*height: 50px;*/
        margin-right: 17px;
    }

    .header-logo a img {
        /*width: 124px;*/
        /*height: 50px;*/
    }
    .logo-right{
        /*border-left:2px solid #c3c3c3;*/
        /*padding-left:16px;*/
    }
    .logo-right .title{
        font-family: GBK;
       font-size: 26px;
       line-height: 30px;
       color: #fff;
        letter-spacing: 2px;
    }
    .logo-right .sub-title{
        font-family: JQiTi;
     font-size: 11px;
     line-height: 11px;
     color: #686868;
     padding-top:7px;
    }
    .search-box{
     width: 485px;
     height: 45px;
     background-color: #ffffff;
     border-radius: 2px;
     border: solid 2px #ee661c;
     display: flex;
        z-index: 100;
    }
    .search-box .ipt-box{
     flex:1;
     display:flex;
     justify-content: space-between;
     align-items: center;
     padding-right:30px;
     background:#ffffff;
     position: relative;
    }
    .ipt-box:before{
     content:'';
     display:inline-block;
     position:absolute;
     left:0;
     top:10px;
     width: 1px;
     height: 20px;
     background-color: #cbcbcb;
    }
    .search-box .ipt-box input{
     flex:1;
     background:#ffffff;
     height:100%;
     padding-left:18px;
    }
    .search-box .ipt-box input::-webkit-input-placeholder {
     font-size: 16px;
     color: #bebdbd;
    }
    .search-box .ipt-box .iconfont-template{
     color:#ee661c;
     font-size:21px;
    }

    /*select*/
    .select-box-mark {
     width:100px;
     background:rgba(255,255,255,0.3);
     box-shadow: 0px 0px 40px 0px
     rgba(27, 58, 52, 0.21);
     color:#343536;
     font-size: 16px;
        cursor: pointer;
    }
    .select-mark{
     width: 100px;
     height: 40px;
     line-height: 40px;
     padding-left: 26px;
     position: relative;
    }
    .select-mark:after{
     position: absolute;
     right: 16px;
     top: 17px;
     width: 0;
     height: 0;
     content: "";
     border-width: 6px 6px 0 6px;     /*border-width: 6px 6px 6px 6px;*/
     border-style: solid;
     border-color: #ee661c transparent;    /*red transparent transparent transparent;*/
    }
    .select-box-mark .list{
     width: 100px;
     overflow: hidden;
     border-top:1px solid #ffffff;
     background:#ffffff;
        margin-top:4px;
        box-shadow: 0px 0px 40px 0px
        rgba(27, 58, 52, 0.21);
    }
    .select-box-mark .list ul li{
     width: 100%;
     height: 30px;
     cursor: pointer;
     line-height: 30px;
     padding-left: 30px;
    }
    .select-box-mark .list ul li:hover{
     color:#ee661c;
    }

    .headers-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
         padding:0 37px 10px;
    }

    .headers-bottom a {
        font-size: 18px;
        color: #3d3d3d;
        font-weight: bolder;
        position: relative;
    }

    .headers-bottom .active {
        color: #ee661c;
    }

    .headers-bottom .active::after {
        position: absolute;
        content: "";
        display: block;
        margin-top: 7px;
        width: 100%;
        height: 3px;
        border-radius: 1px;
        background-color: #ee661c;
    }

    .headers-bottom a:hover {
        color: #ee661c;
    }

    .headers-bottom a:hover::after {
        position: absolute;
        content: "";
        display: block;
        margin-top: 7px;
        width: 100%;
        height: 3px;
        border-radius: 1px;
        background-color: #ee661c;
    }
</style>
