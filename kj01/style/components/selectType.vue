<template>
  <div class="select-column" id="select-column">
    <div class="select-column-result" @click.stop="handleOpenSelectList"><span class="select-column-result-value">{{result.name?result.name:result.objName}}</span></div>
    <div ref="selectColumnList" class="select-column-list" :class="{'select-column-list-open': openSelectList}">
      <template v-for="(codes, ci) in tSelectData">
        <div class="select-column-row" :key="ci">
          <label class="select-column-label"  :class="{active: codes.selected}" @click.stop="handleSelected" :data-ci="ci">
            {{codes.objName?codes.objName:codes.name}}</label>
          <div class="select-column-items" :style="columnItems">
            <template v-for="(code, index) in codes.children">
              <span @click.stop="handleSelected" :data-ci="ci" :data-index="index" :data-value="code.type" :key="index" class="select-column-item"
              :class="{active: code.selected}" >{{code.objName?code.objName:code.name}}</span>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    selectData: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data: function () {
    return {
      result: {
        name: '',
        objName:''
      },
      selected: [],
      tSelectData: [],
      columnItems: {
        width: 0
      },
      openSelectList: 0,
      initValue: false,
      classs:['select-column', 'select-column-list', 'select-column-row']
    }
  },
  watch: {
    value: function(v) {
      if (v) {
        if (!this.initValue) {
          this.initValue = true
          this.initOptions()
        }
      }
    },
    selectData: function (v) {
      v && this.initOptions();
    }
  },
  created: function () {
    document.addEventListener('click', this.handleOtherClick.bind(this))
    this.selectData && this.value && this.initOptions();
  },
  destroyed: function () {
    document.removeEventListener('click', this.handleOtherClick.bind(this))
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
    initOptions: function () {
      var vm, value, v, ci, index;
      if (this.selectData.length) {
        value = this.value;
        v = JSON.parse(JSON.stringify(this.selectData));
        v.forEach(function(item, i){
          if (value) {
            item.selected = item.id === value;
            item.id === value && (ci = '' + i);
          } else {
            item.selected = false;
          }
          item.children && item.children.forEach(function(sitem, si){
            if (value) {
              sitem.selected = sitem.id === value;
              sitem.id === value && (ci = '' + i, index = '' + si);
            } else {
              sitem.selected = false;
            }
          })
        });
        index && ci && (this.result = v[ci].children[index], this.selected = [ci, index]);
        !index && ci && (this.result = v[ci], this.selected = [ci]);
        this.tSelectData = v;
      }
    },
    handleOpenSelectList: function () {
      this.openSelectList = 1
      this.$nextTick(function(){
        this.columnItems.width = this.$refs.selectColumnList.clientWidth - 100;
      });
    },
    handleSelected: function (e) {
      var dataset = this.getAttributeData(e.target, ['ci', 'index', 'value']);
      var t;
      // 处理之前选择
      if (this.selected.length) {
        if (this.selected.length > 1) {
          this.tSelectData[this.selected[0]].children[this.selected[1]].selected = false
        } else {
          this.tSelectData[this.selected[0]].selected = false
        }
      }
      // 处理选中值
      if (dataset.index) {
        this.tSelectData[dataset.ci].children[dataset.index].selected = true
        this.selected[dataset.ci, dataset.index]
        t = this.tSelectData[dataset.ci].children[dataset.index]
        this.result = t
        this.$emit('input', t.id)
        this.openSelectList = 0
      } else {
        t = this.tSelectData[dataset.ci]
        if (!t.children) {
          this.selected[dataset.ci]
          this.tSelectData[dataset.ci].selected = true
          this.result = t
          this.$emit('input', t.id)
          this.openSelectList = 0
        }
      }
      !this.initValue && (this.initValue = true)
    },
    handleOtherClick: function(e) {
      var classs = e.target.className
      var conatins = Node.contains && document.getElementById('select-list').conatins
      if (classs) {
        if (conatins) {
          this.openSelectList = conatins(e.target)
        } else {
          this.openSelectList = this.classs.some(function(class_name){
            return classs.indexOf(class_name) !== -1
          })
        }
      } else {
        this.openSelectList = 0
      }
    }
  }
}
</script>

<style>
.template {
  display: none;
}
.select-column {
  width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-block;
  background-color: #fff;
  vertical-align: middle;
}
.select-column .select-column-result {
  width: 100%;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  min-height: 40px;
  font-size: 14px;
  border: 1px solid #c9c9c9;
}
.select-column .select-column-result::after{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-25%);
  content: '';
  border-style: solid;
  border-width: 8px;
  border-color: #d2d2d2 transparent transparent transparent;
}

.select-column .select-column-result .select-column-result-value {
  display: inline-block;
  vertical-align: middle;
  line-height: 37px;
  padding: 0 10px;
}
.select-column .select-column-list {
  position: absolute;
  width: 100%;
  left: 0;
  line-height: 25px;
  background: #fff;
  z-index: -1;
  opacity: 0;
  bottom: 0;
  height: 0;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #c9c9c9;
}
.select-column .select-column-list::-webkit-scrollbar {
  width: 5px;
}
.select-column .select-column-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  background-color: skyblue;
}
.select-column .select-column-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
}
.select-column .select-column-list-open {
  z-index: 999;
  height: 150px;
  bottom: -152px;
  opacity: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.select-column-row .select-column-label, .select-column-row .select-column-items {
  padding: 10px;
  display: inline-block;
  vertical-align: top;
}
.select-column-row .select-column-label {
  width: 88px;
  font-size: 1em;
  text-align: center;
}
.select-column-row .select-column-items {
  max-width: 83%;
}
.select-column-row .select-column-item {
  display: inline-block;
  vertical-align: top;
  border: 1px solid #c9c9c9;
  padding: 0 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
/* .select-column-item.active, .select-column-item:hover {
  border-color: aqua;
  background-color: aqua;
  color: #fff;
} */
</style>
