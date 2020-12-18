// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'fileSaver','httpUrl'], function ($, Vue, fileSaver, httpUrl) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/common/js/libs/pdfjs-dist/build/pdf.worker.js';
        new Vue({
            el: '#index_box',
            data: {
                id:'',
                pdfDocument: '',
                currentPage: 1,
                countPage: 0,
                scalePage: 1.0,
                canvasCTX: '',
            },
            filters: {},
            mounted: function () {},
            created: function () {
                this.id = this.$utils.getReqStr('id');
                this.id && this.init();
            },
            methods: {
                init(){
                    let vm=this;
                    vm.loadingPDF()
                    vm.$nextTick(function () {
                        !this.canvasCTX && (this.canvasCTX = this.$refs.theCanvas.getContext("2d"));
                    })
                },
                loadingPDF: function () {
                    var vm = this
                    var loadingTask = pdfjsLib.getDocument(httpUrl.imgUploadUrl + '/file/preview?fileId=' + this.id);
                    loadingTask.promise.then(function(pdfDocument) {
                        vm.pdfDocument = pdfDocument;
                        vm.countPage = pdfDocument.numPages
                        vm.pageViewPort()
                    })
                        .catch(function(reason) {
                            // indexApi.preview({ fileId: vm.id}).then(function (res) {
                            //     this.$dialog.showToast(res.desc);
                            // })
                            console.error("Error: " + reason);
                        });
                },
                pageViewPort: function() {
                    var vm = this;
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
                        this.$dialog.showToast("没有有更多页面了！")
                    }
                },
            }
        });
    })
});
