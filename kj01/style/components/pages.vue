<template>
  <ul class="pages" @click.stop="handlePageChange">
    <li class="page-item" v-if="pages.hasPreviousPage"><span class="link" :data-num="pages.prePage">上一页</span></li>
    <template v-for="(page, pi) in pages.navigatepageNums">
      <li v-if="page === pages.pageNum" :key="pi" class="page-item current-item"><span class="link" :data-num="0">{{page}}</span></li>
      <li v-else :key="pi" class="page-item" ><span class="link" :data-num="page">{{page}}</span></li>
    </template>
    <li class="page-item" v-if="pages.isview && !pages.isLastPage && pages.navigatePages < pages.pages"><span class="link" data-num="0">...</span></li>
    <li class="page-item" v-if="pages.isview && !pages.isLastPage && pages.navigatePages < pages.pages"><span class="link" :data-num="pages.pages">{{pages.pages}}</span></li>
    <li class="page-item" v-if="pages.hasNextPage"><span class="link" :data-num="pages.nextPage" >下一页</span></li>
  </ul>
</template>
<script>
module.exports = {
  props: {
    pages: {
      type: Object,
      default: function () {
        return {
          hasPreviousPage: false,
          hasNextPage: false,
          navigatepageNums: [],
          prePage: 0,
          nextPage: 0,
          pageNum: 0,
          isLastPage: false,
          navigatePages: 5,
          pages: 0,
          isview: false
        }
      }
    }
  },
  data: function () {
    return {
    }
  },
  created: function() {
  },
  methods: {
    getAttributeData: function (el, keys) {
      var dataset = {}
      if (el.dataset) {
        dataset = el.dataset
      } else {
        keys.forEach(function (tkey) {
          dataset[tkey] = el.getAttribute('data-' + tkey);
        })
      }
      return dataset
    },
    handlePageChange: function (e) {
      var pageNum = this.getAttributeData(e.target, ['num']).num;
      pageNum = parseInt(pageNum)
      if (pageNum) {
        this.$emit('changepage', pageNum)
      }
    }
  }
}
</script>

<style>
/* 分页 */
.pages {
  font-size: 0;
  text-align: center;
  user-select: none;
  padding: 30px 0 35px;
}

.page-item {
  position: relative;
  display: inline-block;
  margin-left: -1px;
}
.page-item .link {
  cursor: pointer;
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
  color: #999999;
  border: solid 1px #e3eaf1;
}
.page-item.current-item .link, .page-item:hover .link {
  color: #fff;
  border-color: #018fff;
	background-color: #018fff;
}
.page-item:first-child {
  margin-left: 0;
}
</style>
