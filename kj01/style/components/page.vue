<template>
  <div class="pageBox">
    <ul>
      <li
        v-if="this.condition.pageNo > 1 && this.pages.length > 4"
        class="sides"
      ><a @click="prePage()"><s class="font_main"></s></a></li>
      <li
        v-for="(item, index) in pages"
        :class="{'curtPage': condition.pageNo == item}"
      >
        <a
          v-if="item"
          @click="goPage(item)"
        >
          <s>{{item}}</s>
        </a>
        <a
          href="javascript:;"
          rel="external nofollow"
          v-else
        >...</a>
      </li>
      <li
        class="sides"
        v-if="condition.pageNo < pageCount && this.pageCount > 4"
      ><a @click="nextPage()"><s class="font_main"></s></a></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    page: Object,
    condition: Object
  },
  data () {
    return {
      pageSize: this.condition.pageSize
    }
  },
  computed: {
    pageCount: function () {
      return this.page.totalCount / this.condition.pageSize > 0 ? this.page.totalCount % this.condition.pageSize === 0 ? this.page.totalCount / this.condition.pageSize : Math.ceil(this.page.totalCount / this.condition.pageSize) : 1
    },
    pages () {
      let c = this.condition.pageNo
      let t = this.pageCount
      let arr = []
      if (t === 1) {
        return arr
      }
      if (t <= 4) {
        for (let i = 1;i <= t;i++) {
          arr.push(i)
        }
        return arr
      }
      if (c <= 3) return [1, 2, 3, 0, t]
      if (c >= t - 1) return [1, 0, t - 2, t - 1, t]
      //    if (c === 4) return [1, 2, 3, 4, 5, 0, t]
      //    if (c === (t - 2)) return [1, 0, t - 3, t - 2, t - 1, t]
      return [1, 0, c - 1, c, c + 1, 0, t]
    }
  },
  methods: {
    goPage (indexPage) {
      if (this.indexPage !== this.condition.pageNo) {
        this.condition.pageNo = indexPage
        this.$emit('search')
      }
    },
    prePage () {
      if (this.condition.pageNo !== 1) {
        this.condition.pageNo--
        this.goPage(this.condition.pageNo)
      }
    },
    nextPage () {
      if (this.condition.pageNo !== this.pageCount) {
        this.condition.pageNo++
        this.goPage(this.condition.pageNo)
      }
    }
  }
}
</script>
