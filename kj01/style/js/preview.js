// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'fileSaver','httpUrl', 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js',], function ($, Vue, fileSaver, httpUrl, wxApi) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/style/js/libs/pdfjs-dist/build/pdf.worker.js';
        document.title = '附件预览';
        new Vue({
            el: '#index_box',
            data: {
                // id: '236511234315256718',
                id:'',
                canvasCTX:'',
                pdfDocument: '',
                currentPage: 1,
                countPage: 0,
                scalePage: 1.0,
                isError: '',
            },
            filters: {},
            mounted: function () {},
            created: function () {
                this.id = this.$utils.getReqStr('id');
                this.loadingPDF();
                this.$nextTick(function () {
                    !this.canvasCTX && (this.canvasCTX = this.$refs.theCanvas.getContext("2d"));
                })
            },
            methods: {
                loadingPDF: function () {
                    var vm = this;
                    vm.loading=true;
                    var loadingTask = pdfjsLib.getDocument(httpUrl.imgUploadUrl + '/file/preview?fileId=' + this.id);
                    loadingTask.promise.then(function(pdfDocument) {
                        vm.pdfDocument = pdfDocument;
                        vm.countPage = pdfDocument.numPages;
                        vm.pageViewPort()
                    }).catch(function(reason) {
                           vm.isError=reason;
                            console.log("Error: " + reason);
                        });
                },
                pageViewPort: function() {
                    let vm = this;
                    this.pdfDocument.getPage(this.currentPage).then(function(pdfPage) {
                        var viewport = pdfPage.getViewport({ scale: vm.scalePage });
                        vm.$refs.theCanvas.width = viewport.width;
                        vm.$refs.theCanvas.height = viewport.height;
                        var renderTask = pdfPage.render({
                            canvasContext: vm.canvasCTX,
                            viewport: viewport,
                        });
                        return renderTask.promise;
                    });
                    //解决canvas移动端糊的问题
                    let dpr = window.devicePixelRatio; // 假设dpr为2
                    // 获取css的宽高
                    let { width: cssWidth, height: cssHeight } = vm.$refs.theCanvas.getBoundingClientRect();
                    // 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
                    vm.$refs.theCanvas.style.width = window.innerWidth + 'px';
                    vm.$refs.theCanvas.style.height = window.innerHeight + 'px';
                    vm.$refs.theCanvas.width = dpr * cssWidth;
                    vm.$refs.theCanvas.height = dpr * cssHeight;
                    // 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小
                    // 所以需要将绘制比例放大
                    this.canvasCTX.scale(dpr,dpr);
                },
                handleSetPrevPage: function (e) {
                    if (this.currentPage > 1) {
                        this.currentPage--
                        this.pageViewPort()
                    } else {
                        this.$dialog.showToast("已经是第一页了！")
                    }
                },
                handleSetNextPage: function (e) {
                    if (this.currentPage < this.countPage) {
                        this.currentPage++
                        this.pageViewPort()
                    } else {
                        // this.$dialog.showToast("没有有更多页面了！")
                    }
                },
            }
        });
    })
});
