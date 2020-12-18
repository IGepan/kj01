<template>
  <div class="upload_box">
    <input
      type="file"
      @change="fileChange"
      :accept="accept"
      class="imgipt"
    />
    <div
      class="pro"
      v-if="isUploading"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
module.exports = {
  props: ['url', 'header', 'data', 'exp', 'nopro', 'type', 'accept'],
  data: function () {
    return {
      option: {},
      pro: undefined,
      isUploading: false,
      file: undefined
    }
  },
  mounted: function () {
  },
  methods: {
    /**
     * 初始化进度条
     */
    initPro: function () {
      var vm = this;
      if (!this.nopro) {
        this.pro = new progress({
          width: '100%', //进度条宽度
          height: '20px', //进度条高度
          bgColor: "#3E4E5E", //背景颜色
          proColor: "#009988", //前景颜色
          fontColor: "#FFFFFF", //显示字体颜色
          val: 0, //默认值
          text: "#*val*#%", //显示文字信息
          showPresent: true,
          completeCallback: function (val) {
            vm.isUploading = false;
          },
          changeCallback: function (val) {
          }
        });
        document.getElementsByClassName('pro')[0].appendChild(this.pro.getBody());
      }

    },
    checkType: function (file) {
      if (file.size > 10485760) {
        this.$dialog.showToast('上传文件不能超过10M');
        $('input.imgipt').val('');
        return false;
      }
      return true;
    },
    /**
     * 获取文件
     * @param {Object} event
     */
    fileChange: function (event) {
      var vm = this;
      var file = event.target.files[0];
      if (!file) {
        return;
      }
      if (!this.checkType(file)) return;
      vm.isUploading = true;
      vm.$nextTick(function () {
        vm.initPro();
      })
      var imgName = file.name;
      var lastModified = file.lastModified;
      var type = file.type;
      vm.fd = new FormData();
      if (this.data) {
        for (var itemKey in this.data) {
          if (this.data.hasOwnProperty(itemKey)) {
            vm.fd.append(itemKey, this.data[itemKey]);
          }
        }
      }
      var option = {
        maxSize: 1024 // 默认最大1M
      };
      if (this.type === 'file') {
        vm.fd.append("file", file);
        vm.upload(vm.fd);
      } else {
        if (file.size / 1024 / 1024 > 10) {
          option.quality = 0.4;
        } else {
          option.quality = 0.7;
        }
        vm.file = file;
        // 大于1M就压缩
        if (file.size / 1024 > 1024) {
          vm.photoCompress(file, option, function (base64Codes) {
            var blob = vm.convertBase64UrlToBlob(base64Codes);
            var newfile = new File([blob], imgName, {
              type: type,
              lastModified: lastModified
            })
            vm.fd.append("file", newfile);
            vm.upload(vm.fd);
          })
        } else {
          vm.fd.append("file", file);
          vm.upload(vm.fd);
        }
      }
    },
    /**
     * 读取文件数据流
     * @param {Object} file
     * @param {Object} option
     * @param {Object} callback
     */
    photoCompress: function (file, option, callback) {
      var vm = this;
      var ready = new FileReader();
      /* 开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
      ready.readAsDataURL(file) // 调用reader.readAsDataURL()方法，把图片转成base64
      ready.onload = function () {
        var path = this.result
        vm.canvasDataURL(path, option, callback)
      }
    },
    /**
     * 压缩
     */
    canvasDataURL: function (path, option, callback) {
      var vm = this;
      var img = new Image();
      img.src = path;
      img.onload = function () {
        var that = this;
        var w = that.width;
        var h = that.height;
        var scale = w / h
        w = option.width || w
        h = option.height || (w / scale)
        var quality = 0.6 // 默认图片质量为0.7
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        // 创建属性节点
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if (option.quality && option.quality <= 1 && option.quality > 0) {
          quality = option.quality
        }
        // quality值越小，所绘制出的图像越模糊
        var base64Codes = canvas.toDataURL('image/jpeg', quality);
        var blob = vm.convertBase64UrlToBlob(base64Codes);
        // 递归压缩到指定大小
        if (option.maxSize && blob.size / 1024 > option.maxSize) {
          option.quality = option.quality - 0.1;
          vm.canvasDataURL(path, option, callback)
        } else {
          callback(base64Codes);
        }
      }
    },
    /**
     * 将以base64的图片url数据转换为Blob
     */
    convertBase64UrlToBlob: function (base64) {
      var arr = base64.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {
        type: mime
      })
    },
    /**
     * 上传
     * @param {Object} fd
     */
    upload: function (fd) {
      this.$emit('upstart', true)
      var vm = this;
      var header = this.header || {}
      $.ajax({
        url: this.url,
        type: 'POST',
        data: fd,
        header: header,
        processData: false, //用来回避jquery对formdata的默认序列化，XMLHttpRequest会对其进行正确处理
        contentType: false, //设为false才会获得正确的conten-Type
        xhr: function (fun) { //用以显示上传进度
          var xhr = $.ajaxSettings.xhr();
          if (xhr.upload) {
            xhr.upload.onprogress = function (event) {
              var percent = Math.round(event.loaded / event.total * 100)
              vm.$emit('progress', percent);
              vm.pro && vm.pro.update(percent);
            }
          }
          return xhr
        },
        success: function (data) {
          if (data.code == 'rest.success') {
            data.result.name = data.result.fileName;
            $('input.imgipt').val('');
            vm.$emit('success', {
              exp: vm.exp,
              data: data.result
            });
          } else {
            vm.$dialog.showToast(data.desc)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.pro {
  width: 100%;
  position: absolute;
  bottom: 0px;
}

.upload_box {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
