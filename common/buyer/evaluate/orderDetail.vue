<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>订单评价详情</title>
  <link href="/common/css/main.css" rel="stylesheet" type="text/css">
  <link href="/common/servicetrade/css/service.css" rel="stylesheet" type="text/css">
  <link href="/common/css/evaluate.css" rel="stylesheet" type="text/css">
</head>

<body>
  <div class="box" id="index_box">
    <div class="header">
      <ly-toper></ly-toper>
      <ly-header pagename="订单评价"></ly-header>
      <div class="crumbs">
        <div class="mdiv"><strong>你现在的位置：</strong>
          <a href="/common/seller/index.html">
            卖家中心
          </a>
          <span>订单评价</span></div>
      </div>
    </div>
    <div class="storecontent">
      <div class="mdiv evtitle" v-cloak>
        <span v-text="'订单编号：' + (detailInfo.orderId || '')"></span>
        <span v-text="'下单时间：' + (detailInfo.orderCreateTime|| '')"></span>
      </div>
      <div class="mdiv">
        <div class="evaluateBox" v-cloak>
          <div class="evaluate">
            <div class="orderinfos">
              <img :src="detailInfo.shopLogo || '/images/ad.jpg'" alt="" style="float:left; width: 45px; height: 45px;">
              <p style="overflow: hidden; margin: 0;padding-left: 20px;">
                <span class="infotitle" v-text="detailInfo.shopName"></span><br>
                <span>综合评分：<span class="orange" v-text="detailInfo.shopGeneralScore"></span></span>
              </p>
            </div>
            <div class="evaluateForm" v-if="evaluateData.evaluateList.length">
              <div class="form-item" v-for="(d, di) in evaluateData.evaluateList[0].resultVoList">
                <label class="form-item__title" v-text="d.display + '：'"></label>
                <div class="form-item__contents">
                  <ly-star v-model="d.evaluateResult"></ly-star>
                </div>
              </div>
              <div class="form-item">
                <label class="form-item__title"></label>
                <div class="form-item__contents">
                  <span class="tags"><span v-for="(tag, i) in evaluateData.evaluateList[0].tagVoList"
                      :class="{active:tag.selected}" v-text="tag.display" @click="handleTagUpdate(i)"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="evaluate" v-for="(sku, si) in detailInfo.orderDetailList">
            <div class="orderinfos">
              <img :src="sku.goodsImgFst || '/images/ad.jpg'" alt=""
                style="display: block; width: 116px; height: 116px; margin: 0 auto">
              <p class="infotitle" style="max-width: 162px;" v-text="sku.goodsName || ''"></p>
              <p v-text="'数量：' + sku.num"></p>
              <p v-text="'价格：￥' + sku.protocolPrice"></p>
            </div>
            <div class="evaluateForm">
              <div class="form-item" v-for="(d, di) in evaluateData.evaluateList[si+1].resultVoList">
                <label class="form-item__title" v-text="d.display + '：'"></label>
                <div class="form-item__contents">
                  <ly-star v-model="d.evaluateResult"></ly-star>
                </div>
              </div>
              <div class="form-item">
                <label class="form-item__title">评价内容：</label>
                <div class="form-item__contents">
                  <textarea v-model="evaluateData.evaluateList[si+1].comment" class="etextarea" maxlength="500"
                    cols="60" rows="4"></textarea>
                </div>
              </div>
              <div class="form-item">
                <label class="form-item__title"></label>
                <div class="form-item__contents" style="font-size: 0">
                  <ul class="list horizontal imglist" v-if="evaluateData.evaluateList[si+1].fileIds.length" v-viewer>
                    <li class="item" v-for="(file, i) in evaluateData.evaluateList[si+1].fileIds">
                      <img :src="file.url" width="69" height="69" :alt="file.name">
                      <span class="iconfont icon-cuowu" @click="handleRemoveImg(si+1 ,i)"></span>
                    </li>
                  </ul>
                  <label class="upload-btn" v-show="5 > evaluateData.evaluateList[si+1].fileIds.length">
                    <ly-upload :exp="{type: 'secrecy', index: si}" @success='handleUploadSuccess'
                      style="position: absolute;right: 10000px;" type='file' accept="image/*" :header='{}'
                      :url='fileUploadUrl' :data='uploadData'>
                    </ly-upload>
                    <i class="iconfont icon-tupian upload-btn__icon"></i>
                    <br>
                    <span class="upload-btn__text">添加图片</span>
                  </label>
                  <label class="upload-btn" v-show="false">
                    <i class="iconfont icon-shipin upload-btn__icon"></i>
                    <br>
                    <span class="upload-btn__text">添加视频</span>
                  </label>
                  <ly-checkbox v-model="evaluateData.evaluateList[si+1].anonymityFlag" class="fr" label="匿名评价"
                    :true-value="1" :false-value="0"></ly-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="textcenter ptb45">
          <button class="paybtn" :disabled="isSubmitDisabled" @click="submitUpdate" style="width: 156px;">提交</button>
          <button class="paybtn plain" @click="routerBack" style="width: 156px;">取消</button>
        </div>
      </div>
    </div>
    <ly-footer></ly-footer>
  </div>
  <script type="text/javascript" src="/common/js/libs/require.js"></script>
  <script type="text/javascript" src="/common/js/libs/progress.js"></script>
  <script src="/common/js/buyer/evaluate/bevaluate.js"></script>
</body>

</html>
