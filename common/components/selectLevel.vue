<template>
  <div
    class="select_box"
    @click.stop="boxClick"
  >
    <div
      class="select_content"
      v-for="(item,index) in selectList"
      :key="index"
    >
      <span v-text="item.name"></span>
      <i
        class="iconfont icon-cuowu"
        aria-hidden="true"
        @click.stop="removeSeleced(item.tagId)"
      ></i>
    </div>
    <div
      class="content"
      v-if="isShowDialog"
    >
      <ul class="item">
        <li
          :class="{active: index == activeIndex}"
          v-for="(item, index) in oneLevelList"
          @click="itemClick(item,index)"
          :key="index"
        >
          <span
            class="text hand"
            v-text="item.display"
          ></span>
        </li>
      </ul>
      <ul class="item">
        <li
          v-for="(item, itemIndex) in itemList"
          :key="itemIndex"
        >
          <span
            class="text hand"
            :class="{active: selectedIds[item.id]}"
          ><strong
              v-text="item.name"
              @click="valueClick(item, secondType)"
            ></strong></span>
          <span class="level">
            <span
              class="level_text hand"
              :class="{active: selectedIds[level3.tagId], disabel: disabelList[level3.tagId]}"
              @click="valueClick(level3)"
              v-for="(level3,index) in item.tagList"
              v-text="level3.name"
              :key="index"
            ></span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: ['value', 'type'],
  data: function () {
    return {
      isShowDialog: false,
      oneLevelList: [],
      itemList: [],
      disabelList: {}, // 不可选中状态集合
      selectedIds: {},
      selectList: [], // 当前选中数据数组
      activeIndex: 0,
      code: '',
      serviceCode: '',
      secondType: 'second'
    }
  },
  watch: {
    value: function (val) {
      this.initValue(val)
    },
    selectList: function (val) {
      this.$emit('input', val);
    }
  },
  created: function () {
    this.initValue(this.value.length ? this.value : [])
    this.code = this.type === 'service' ? 'services_level1_type' : 'industry_level1_type';
    this.initDic();
  },
  mounted: function () {
    document.getElementsByTagName('body')[0].addEventListener('click', this.bodyClick, false);
  },
  beforeDestroy: function () {
    document.getElementsByTagName('body')[0].removeEventListener('click', this.bodyClick, false);
  },
  methods: {
    // 初始化选项数据
    initDic: function () {
      var vm = this;
      this.$httpCom.dict({
        code: this.code
      }).then(function (res) {
        vm.oneLevelList = res.result;
        vm.initData();
      })
    },
    initData: function () {
      this.getItemListSelect(this.oneLevelList[this.activeIndex].value)
    },
    // 初始化值
    initValue: function (val) {
      var vm = this
      if (Array.isArray(val)) {
        var ids = {}
        if (val.length) {
          this.selectList = val;
          val.forEach(function (item) {
            if (item.tagId) {
              ids[item.tagId] = 1
            }
          })
          // 初始化已经选择的项目
          this.selectedIds = ids
          this.filterBackDisabel(this.itemList);
        } else {
          this.selectList.forEach(function (tag) {
            vm.removeSeleced(tag.tagId)
          })
          // 初始化已经选择的项目
          this.selectedIds = ids
          this.disabelList = {}
          this.selectList = val;
        }
      } else {
        this.selectList = []
      }
    },
    bodyClick: function (e) {
      this.isShowDialog = false;
    },
    boxClick: function () {
      // console.log(this.$el.getClientRects())
      this.isShowDialog = true
      this.type === 'service' && this.code !== 'services_level1_type' && (this.code = 'services_level1_type', this.initDic());
      this.type === undefined && this.code !== 'industry_level1_type' && (this.code = 'industry_level1_type', this.initDic());
    },
    // 服务领域数据获取
    getItemListSelect: function (val) {
      var vm = this;
      this.type === 'service' ? this.$httpCom.servicesSelect({
        servicesLevel1Type: val
      }).then(function (res) {
        vm.filterBackDisabel(res.result);
        vm.itemList = res.result;
      }) :
        // 行业数据获取
        this.$httpCom.industrySelect({
          industryLevel1Type: val
        }).then(function (res) {
          vm.filterBackDisabel(res.result);
          vm.itemList = res.result;
        })
    },
    // 点击分类
    itemClick: function (item, index) {
      this.activeIndex = index;
      this.initData();
      let exist=false;
      this.selectList.forEach(o => {if(o.name==item.display) exist=true})
      if(!exist){ this.selectList.push({
        name: item.display,
        tagId: item.id
      })}
    },
    // 选择值
    valueClick: function (item, type) {
      var that = this
      var key = type === this.secondType ? 'id' : 'tagId'
      var tagType
      // 删除一级标签的内容
      let templist = []
      let parent = this.oneLevelList[this.activeIndex]
      for (let o of this.selectList) {
        if(o.name != parent.display) templist.push(o)
      }
      this.selectList = templist
      // 可选中
      if (!this.disabelList[item[key]]) {
        // 存在选中
        if (this.selectedIds[item[key]]) {
          // 删除选中
          this.removeSeleced(item[key]);
          // 二级分类 去除不可点击
          type === this.secondType && this.removeDisabel(item.tagList)
        } else {
          // 判断类型
          if (type === this.secondType) {
            tagType = this.type === 'service' ? '04' : '03'
          } else {
            tagType = this.type === 'service' ? '02' : '01'
          }
          this.setSelected(item[key], tagType, item.name);
          // 二级分类 加入不可点击
          type === this.secondType && this.setDisabel(item.tagList)
          this.$nextTick(function () {
            this.$set(this, 'selectList', this.selectList);
          })
        }
      }
    },
    setSelected: function (tagId, tagType, tagName) {
      this.selectedIds[tagId] = 1
      this.selectList.push({
        tagId: tagId,
        tagType: tagType,
        name: tagName
      });
    },
    // 输入框标签删除
    removeSeleced: function (tagId) {
      var i = this.isSelected(tagId)
      var tagType = this.selectList[i].tagType
      var that = this
      delete this.selectedIds[tagId]
      if (tagType === '04' || tagType === '03') {
        this.itemList.some(function (item) {
          if (item.id === tagId) {
            that.removeDisabel(item.tagList)
            return true
          }
        })
      }
      this.selectList.splice(i, 1);
      this.activeIndex=0;
    },
    setDisabel: function (arr) {
      var that = this
      arr.forEach(function (sitem) {
        that.disabelList[sitem.tagId] = 1;
        // 清理选中的三级数据
        that.selectedIds[sitem.tagId] && that.removeSeleced(sitem.tagId);
      })
    },
    filterBackDisabel: function (arr) {
      var that = this
      arr.forEach(function (item) {
        that.selectedIds[item.id] && that.setDisabel(item.tagList)
      })
    },
    removeDisabel: function (arr) {
      var that = this
      arr.forEach(function (sitem) {
        delete that.disabelList[sitem.tagId]
      })
    },
    // 判断是否存在 需要返回下标进行删除
    isSelected: function (id) {
      var index = -1
      this.selectList.some(function (sitem, i) {
        if (sitem.tagId === id) {
          index = i
          return true
        }
      })
      return index
    }
  },
}
  </script>
  <style scoped>
.hand {
  cursor: hand;
}
.select_box {
  position: relative;
  padding-right: 25px;
  min-height: 38px;
}
.select_box::after {
  clear: both;
  content: '';
  overflow: hidden;
  width: 100%;
  height: 0;
  zoom: 1;
  display: block;
}
.select_content {
  font-size: 14px;
  float: left;
  margin: 4px 6px;
  margin-top: 7px;
  background: #eaeaea;
  padding: 2px 4px;
  border-radius: 4px;
}
.content {
  position: absolute;
  bottom: -432px;
  left: 0px;
  padding: 2px 0px 0px 0px;
  z-index: 1001;
  font-size: 14px;
  display: inline-block;
  height: 430px;
  white-space: nowrap;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(7, 0, 2, 0.14);
  border: solid 1px #c9c9c9;
  font-size: 0;
}
.content .item {
  height: 100%;
  overflow-y: scroll;
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}
.content .item:first-child {
  border-right: #cccccc 1px solid;
}
.content .item li {
  padding: 10px;
  text-align: right;
}
.content .item:last-child {
  width: 458px;
}
.content .item:last-child li {
  text-align: left;
}
.content .item .level {
  display: block;
  white-space: initial;
  width: 100%;
  margin-top: 5px;
}
.item .level .level_text {
  display: inline-block;
  margin: 3px 4px;
  padding: 2px 4px;
  box-sizing: border-box;
}
.content li.active {
  border-right-width: 0px;
}
.content li .text {
  display: inline-block;
  padding: 4px;
}
.content li.active .text,
.content li .active {
  background: #1154b0;
  color: #ffffff;
}
.hand {
  cursor: pointer;
}
.content .level .disabel {
  background: #eaeaea;
  color: #aba4a4;
  cursor: no-drop;
}
.icon-cuowu {
  position: relative;
  top: 1px;
}
</style>
