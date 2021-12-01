<template>
    <div class="footer-box">
       <div class="foot-top mmdiv">
           <div class="title">友情链接:</div>
           <div class="link-box" v-if="webInfo.extDetailViewList&&webInfo.extDetailViewList.length>0">
               <div v-for="item in webInfo.extDetailViewList"><a :href="item.siteUrl" target="_blank">{{item.siteName}}</a></div>
           </div>
       </div>
        <div class="foot-middle">
            <div class="mmdiv">
                <div class="middle-left">
                    <div class="img-box"><img :src="webInfo.logoUrl?webInfo.logoUrl:'./style/images/default-logo.png'" alt=""></div>
                    <div class="contact-box">
                        <div class="">{{webInfo.servicePhone||''}}</div>
                        <div class="">全国免费服务热线({{webInfo.workingDay||''}})</div>
                    </div>
                    <div class="contact-box">
                        <div class="">邮箱：{{webInfo.email||''}}</div>
                        <div class=""><span>地址：</span>{{webInfo.address||''}}</div>
                    </div>
                </div>
                <div class="kefu-btn" onclick="window.open('http://www.5c1.53kf.com/webCompany.php?arg=10113491&style=1&language=zh-cn&lytype=0&charset=utf-8&kflist=off&zdkf_type=1&referer=http%3A%2F%2Fwww.53kf.com%2Findex.php&keyword=http%3A//www.53kf.com&timeStamp=1604995029140&ucust_id=')"
                >在线客服</div>
            </div>
        </div>
        <div class="foot-bottom">
            <div class="mmdiv">
                <div class="foot-content-box" >
                    <a :href="'about.html#'+item.label" v-for="item in List" style="margin-right: 10px">{{item.label}}</a>
                </div>
                <div class="foot-content-box">Copyright © 2019 易智网 版权所有 <a href="">渝ICP备09050127号-36</a></div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports= {
        name: "com-footer",
        data(){
            return{
                webInfo:'',
              List:[
                {
                  label:'关于易智网',
                },{
                  label:'免责声明',

                },{
                  label:'隐私政策',

                },{
                  label:'平台协议',

                },{
                  label:'联系客服',
                }
              ]
            }
        },
        watch:{

        },
        mounted(){
            window.addEventListener("setItem", (e) => {
                if(e.key==='webInfo'){
                    let info=JSON.parse(e.newValue)
                    this.webInfo=info?info:'';
                }
            });
        },
      handleTabs(index,item){
        this.activeIndex=index;
        this.activeName=item.label;
        this.detail='';
        if(item.type){
          this.getInfo(item.type);
        }
      }
    }
</script>

<style scoped>
    .footer-box{
        background-color: #64605f;
    }
    .footer-box .foot-top{
        padding:33px 0 7px;
        display:flex;
        font-size: 14px;
        color: #e5e5e5;
    }

    .footer-box .foot-top .link-box{
        flex:1;
        display:flex;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .footer-box .foot-top .link-box div{
        padding:0 0 17px 35px;
        cursor: pointer;
    }
    .footer-box .foot-top .link-box a{
        color: #e5e5e5;
    }
    .footer-box .foot-top .link-box a:hover{
        color: #fc7749;
    }
    .footer-box .foot-middle{
        background:#ffffff;
      display: none;
    }
    .footer-box .foot-middle .mmdiv{
        display:flex;
       justify-content: space-between;
        align-items: center;
        padding:39px 0 44px;
    }
    .footer-box .foot-middle .middle-left{
        display:flex;
    }
    .footer-box .middle-left .img-box{
        padding:2px 48px 2px 0;
        border-right:1px solid #e5e5e5;
        margin-right:41px;
    }
    .footer-box .middle-left .img-box img{
        width: 156px;
        height: 54px;
    }
    .footer-box .middle-left .contact-box{
        font-size: 16px;
        color: #323232;
        width:283px;
    }
    .footer-box .middle-left .contact-box:nth-child(2){
        margin-right:66px;
    }
    .footer-box .middle-left .contact-box:last-child{
        margin-left:20px;
    }
    .footer-box .middle-left .contact-box div:first-child{
        padding:10px 0;
    }
    .footer-box .kefu-btn{
        width: 163px;
        height: 40px;
        border: solid 1px #ee661c;
        font-size: 18px;
        line-height: 40px;
        color: #fc7749;
        text-align: center;
        cursor: pointer;
    }
    .foot-bottom{
        padding:30px 0;
        text-align: center;
        background:#efefef;
    }
    .foot-bottom .foot-content-box{
        font-size: 14px;
        color: #6f6f6f;
    }
    .foot-bottom .foot-content-box:first-child{
        padding-bottom:7px;
    }
    .foot-bottom .foot-content-box a{
        font-size: 14px;
        color: #6f6f6f;
    }
    .foot-bottom .foot-content-box a:hover{
        color: #fc7749;
    }
</style>
