<template>
  <ul class="pager mt60 tcenter">
    <li @click="toPage('first')" :class="{disabled:prev_disabled}">[首页]</li>
    <li @click="toPage('prev')" :class="{disabled:prev_disabled}">[上一页]</li>
    <li v-for="k in pages" v-html="k" @click="toPage(k)" :class="{active:k===page}"></li>
    <li @click="toPage('next')" :class="{disabled:next_disabled}">[下一页]</li>
    <li @click="toPage('last')" :class="{disabled:next_disabled}">[末页]</li>
    <li>[共<span v-html="totalPage"></span>页]</li>
  </ul>
</template>
<script>
module.exports = {
  props: ['totalPage', 'currentPage'],
  data: function () {
    return {
      pages: [1],
      page: 1,
      prev_disabled: true,
      next_disabled: true,
    }
  },
  created: function() {
      this.page = this.currentPage || 1;
      this.updatePage();
  },
  watch: {
      'totalPage': function() {
          this.updatePage();
      }
  },
  methods: {
      genListPage: function(b, m, c) {
          var a = [];
          if(c[0] && b >= 2) {
              a.push(c[0]);
              b > 2 && a.push('...');
          }
          for(var i = b; i < m + 1; i++) {
              a.push(i);
          }
          if(c[1] && m <= c[1] - 1) {
              m < c[1] - 1 && a.push('...');
              a.push(c[1]);
          }
          this.pages = a;
      },
      updatePage: function() {
          this.next_disabled = this.page >= this.totalPage;
          this.prev_disabled = this.page <= 1;
          if(this.totalPage <= 7) {
              this.genListPage(1, this.totalPage, [0, 0]);
          } else {
              if(this.page - 3 >= 1 && this.page + 3 <= this.totalPage) {
                  this.genListPage(this.page - 3, this.page + 3, [1, this.totalPage]);
              } else if(this.page - 3 < 1) {
                  this.genListPage(1, 7, [0, this.totalPage]);
              } else {
                  this.genListPage(this.totalPage - 6, this.totalPage, [1, 0]);
              }
          }
      },
      toPage: function(m) {
          switch(m) {
              case 'last':
                  if(this.next_disabled) return;
                  this.page = this.totalPage;
                  break;
              case 'prev':
                  if(this.prev_disabled) return;
                  this.page--;
                  break;
              case 'next':
                  if(this.next_disabled) return;
                  this.page++;
                  break;
              case 'first':
                  if(this.prev_disabled) return;
                  this.page = 1;
                  break;
              case '...':
                  return;
              default:
                  if(this.page === m) return;
                  this.page = m;
                  break;
          }
          this.updatePage();
          this.$emit('handle', this.page);
      }
  }
}
</script>

<style scoped>
    .pager {
        margin: 20px 0;
    }
    .pager li {
       cursor: pointer;
       display: inline-block;
       color: #666;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none; 
    }
    .pager li:hover {
        color: #0a469a;
    }
    .pager li:last-child {
        color: #666;
        cursor: default;
    }
    .pager li.disabled {
        color: #aaa;
        cursor: not-allowed;
    }
    .pager li.active {
        background: #0a469a;
        color: #fff;
    }
</style>
