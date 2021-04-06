<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <title>订单-成渝城市群综合科技服务平台</title>
  <link href="/common/css/main.css" rel="stylesheet" type="text/css">
  <link href="css/service.css" rel="stylesheet" type="text/css">
    <style>
        .info .juan-tit {
            font-size: 14px;
            font-weight: 400;
            color: #515151;
            line-height: 24px;
            margin-left: 25px;
        }
        .juan-container {
            margin: 10px 30px 20px 30px;
        }
        .juan-container > img {
            margin-right: 20px;
        }
        .juan-container > span {
            display: inline-block;
            position: relative;
            margin-right: 20px;
        }
        .juan-container > span > i {
            background: #37c95c;
            width: 25px;
            height: 25px;
            position: absolute;
            left: 0;
            top: -12px;
            display: none;
            border-radius: 50%;
        }
        .juan-container > span i:after {
            content: '';
            display: inline-block;
            position: absolute;
            width: 12px;
            height: 8px;
            border-left: 3px solid #fff;
            border-bottom: 3px solid #fff;
            transform: rotate(-45deg);
            top: 5px;
            left: 5px;
        }
        .juan-container > span.active i {
            display: inline-block;
        }
    </style>
</head>

<body>
  <div class="box" id="index_box">
    <div class="header">
      <ly-toper></ly-toper>
      <ly-header pagename="服务订单" :http="httpCom"></ly-header>
      <div class="navigation">
        <div class="mdiv">
          <span class="nowdz">
            <i class="iconfont icon-shouye mr10"></i>你现在的位置：服务订单 </span>
        </div>
      </div>
    </div>
    <div class="storecontent">
      <div class="mdiv">
        <div class="tit mb25">
          <span>委托人信息</span>
          <button class="addinfo" type="button" @click="isOpenAddress = true">增加信息+</button>
        </div>
        <div class="consignorbox" :class="{active:isFullAddress}">
          <ul class="consignorlist">
            <li v-for="(address, i) in addressList" :class="{active: address.activated}" @click="selectAddress(i)">
              <div class="name" v-text="address.contactsName"></div>
              <div class="address"
                v-text="address.provinceDisplay + address.cityDisplay + address.districtDisplay + address.location">
              </div>
              <div class="tnumber" v-text="address.mobile"></div>
              <div v-show="address.defaultFlag === '1'" class="dftaddress"> 默认地址 </div>
              <div class="fr pr30 rightbtn">
                <button type="button" @click.stop.prevent="addressDel(address)" class="delete">删除</button>
                <button type="button" @click.stop.prevent="addressSetInfo(address.id)" class="edit">修改信息</button>
                <button type="button" @click.stop.prevent="addressSetDefault(address)"
                  class="setdefault">设为默认地址</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="closeconsignorbox clear" :class="{active:!isFullAddress}">
          <span @click="changeFullAddress">
            <em>收起地址</em><em>展开地址</em>
            <i class="iconfont icon-xiala2"></i>
          </span>
        </div>
      </div>
      <div class="mdiv orderValiform">
        <div class="tit mb25">
          <span>确认订单信息</span>
        </div>
        <div class="commodityinfotit">
          <span>商品详情</span>
          <span>单价</span>
          <span>数量</span>
          <span>小计</span>
        </div>
        <template v-for="(shop, i) in shopList">
          <div class="storename">
            <span class="shopLogo"><img :src="shop.shopLogo.url" alt=""></span><span>店铺：</span><strong
              v-text="shop.shopName"></strong>
            <span class="sellerName" v-text="'卖家：' + shop.sellerName"></span>
            <button class="btn plan">联系TA</button>
          </div>
          <table class="storetable">
            <tbody>
              <tr v-for="(sku, si) in shop.details" :key="sku.id">
                <td>
                  <div class="storeinfo">
                    <div class="imgtit clear">
                      <span class="storeimg"
                        :style="'background-image: url(' + (sku.goodsImg.url || 'http://dummyimage.com/94x82') + ')'"></span>
                      <span class="storetext">{{sku.goodsName}}</span>
                    </div>
                    <div class="mb15 iptline">
                      <span><i>*</i>服务需求描述：</span>
                      <div class="inputContent">
                        <input type="text" v-model="sku.requirement" class="storeipt w480 required"
                          data-valid="isNonEmpty||maxLength:500" data-error='服务需求描述不能为空||最大长度为500个字符'>
                        <span class="vlt form_msg"></span>
                      </div>
                    </div>
                    <div class="mb15 iptline">
                      <span><i v-show="sku.price === undefined || sku.negotiableFlag === '1'">*</i>协议单价：</span>
                      <div class="inputContent">
                        <input type="text" v-model="sku.protocolPrice" :disabled="sku.price !== undefined && sku.negotiableFlag === '0'"
                          class="storeipt w210 required" data-valid="custom:protocolPriceValid" :data-shopIndex="i"
                          :data-skuIndex="si">
                        <span class="vlt form_msg"></span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="commoditycost">￥{{sku.negotiableFlag | formatPrice(sku.price, sku.minPrice, sku.maxPrice)}}</div>
                </td>
                <td>
                  <div class="commoditynumber">
                    <button class="addbtn fl" :disabled="sku.number === 1" :class="{low: sku.number === 1}"
                      @click="subtractNumber(i, si)">-</button>
                    <input type="number" class="addnum fl"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="sku.number"
                      value="1">
                    <button class="addbtn fl" :disabled="sku.number === sku.stock"
                      :class="{low: sku.number === sku.stock}" @click="addNumber(i, si)">+</button>
                  </div>
                </td>
                <td>
                  <div class="commoditycost orange">￥{{sku.subtotal|formatingPrice}}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="liuyan">
              <div class="info" v-if="shop.innovationVouchersList1 && shop.innovationVouchersList1.length">
                  <span class="juan-tit">用券选择：您可以选择一种优惠券使用</span>
                  <div class="juan-container">
                      <span @click="selectJuan(shop, k)" :class="{active:shop.innovationVouchersList[0] === k}" v-for="k in shop.innovationVouchersList1">
                        <img :src="k.tagValueLogo">
                          <i></i>
                      </span>
                  </div>
              </div>
            <div class="info clear">
              <div class="iptline fl">
                <span>给卖家留言：</span>
                <div class="inputContent">
                  <input type="text" v-model="shop.comment" class="storeipt w480 required" data-valid="maxLength:500"
                    data-error='最大长度为500个字符'>
                  <span class="vlt form_msg"></span>
                </div>
              </div>
              <div class="iptline fr">
                <span><i>*</i>支付方式：</span>
                <label class="labelbox w240">
                  <select class="storeipt w240" v-model="shop.payMode" disabled>
                    <option :value="opt.value" v-for="opt in payOptions" :key="opt.id">{{opt.display}}</option>
                  </select>
                  <div class="down iconfont icon-xiala"></div>
                </label>
              </div>
            </div>
            <div class="price">店铺合计：<span class="orange">￥{{shop|shopSubtotal}}</span></div>
          </div>
        </template>
        <div class="pay">
          <span class="money">总金额（含运费）：</span>
          <i class="howmoney" v-text="'￥' + shopTotal"></i>
          <button class="paybtn" :disabled="isSubmitDisabled" type="button" @click="addOrder">提交订单</button>
        </div>
      </div>
    </div>
    <ly-footer></ly-footer>
    <div class="cover close" :class="{open:isOpenAddress}">
      <div class="ctr">
        <div class="editalert">
          <div class="tit2">
            <strong>修改信息</strong>
          </div>
          <div class="listbox valiform">
            <div class="mb20 clear">
              <div class="iptline fl">
                <span class="fl mt5"><i>*</i>联系人：</span>
                <div class="inputContent" style="min-width: 250px">
                  <input type="text" v-model="addressForm.contactsName" class="storeipt w240 required"
                    data-valid="isNonEmpty||maxLength:20" data-error='联系人不能为空||最大长度为20个字符'>
                  <span class="vlt form_msg"></span>
                </div>
              </div>
              <div class="iptline fr">
                <span class="fl mt5"><i>*</i>联系电话：</span>
                <div class="inputContent" style="min-width: 250px">
                  <input type="text" v-model="addressForm.mobile" class="storeipt w240 required" maxlength="11"
                    data-valid="isNonEmpty||isMobile" data-error='联系电话不能为空||联系人电话格式错误'>
                  <span class="vlt form_msg"></span>
                </div>
              </div>
            </div>
            <div class="iptline">
              <span class="fl mt5"><i>*</i>联系地址：</span>
              <div class="ovflh">
                <label class="labelbox w130">
                  <div class="inputContent select">
                    <select class="storeipt w130 required" v-model="addressForm.province" data-valid="isNonEmpty"
                      data-error='请选择省'>
                      <option value="">请选择</option>
                      <option :value="opt.value" v-for="opt in provinceOptions" :key="opt.id">{{opt.display}}</option>
                    </select>
                    <span class="vlt form_msg"></span>
                    <div class="down iconfont icon-xiala"></div>
                  </div>
                </label>
                <label class="labelbox w130">
                  <div class="inputContent select">
                    <select class="storeipt w130 required" v-model="addressForm.city" data-valid="isNonEmpty"
                      data-error='请选择市'>
                      <option value="">请选择</option>
                      <option :value="opt.value" v-for="opt in cityOptions" :key="opt.id">{{opt.display}}</option>
                    </select>
                    <span class="vlt form_msg"></span>
                    <div class="down iconfont icon-xiala"></div>
                  </div>
                </label>
                <label class="labelbox w130">
                  <div class="inputContent select">
                    <select class="storeipt w130 required" v-model="addressForm.district" data-valid="isNonEmpty"
                      data-error='请选择区域'>
                      <option value="">请选择</option>
                      <option :value="opt.value" v-for="opt in districtpayOptions" :key="opt.id">{{opt.display}}
                      </option>
                    </select>
                    <span class="vlt form_msg"></span>
                    <div class="down iconfont icon-xiala"></div>
                  </div>
                </label>
                <div class="mt20">
                  <div class="inputContent"><input type="text" v-model="addressForm.location" placeholder="详细地址"
                      class="storeipt w533 required" data-valid="isNonEmpty" data-error='详细地址不能为空'>
                    <span class="vlt form_msg"></span></div>
                </div>
              </div>
            </div>
            <div class="mt20 clear">
              <div class="iptline fl">
                <span class="fl mt5">固定电话：</span>
                <div class="inputContent" style="min-width: 250px">
                  <input type="text" data-valid="custom:phoneValid" v-model="addressForm.phone"
                    class="storeipt w240 required"><span class="vlt form_msg"></span>
                </div>
              </div>
              <div class="iptline fr">
                <span class="fl mt5">Email：</span>
                <div class="inputContent" style="min-width: 250px">
                  <input type="text" data-valid="custom:emailValid" v-model="addressForm.email"
                    class="storeipt w240 required"><span class="vlt form_msg"></span>
                </div>
              </div>
            </div>
            <div class="mt40 textcenter">
              <button class="alertbtn" type="button" @click="addressSave">保存</button>
              <button class="alertbtn" type="button" @click="addressSetInfo">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script type="text/javascript" src="/common/js/libs/require.js"></script>
  <script src="js/order.js"></script>
</body>

</html>
