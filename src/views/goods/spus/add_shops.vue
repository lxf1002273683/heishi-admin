<!-- 创建店铺 -->
<template>
  <div class="app-container">
    <div class="goodsAddForm">
      <el-form label-width="80px">
        <el-form-item label="店铺名">
            <el-input v-model="shopName" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="createShops">立即创建</el-button>
        </el-form-item>
      </el-form>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree :data="data" :props="defaultProps" :filter-node-method="filterNode" ref="tree" :render-content="renderContent" node-key="id" :expand-on-click-node="false" v-loading.body="listLoading" element-loading-text="拼命加载中"></el-tree>
    </div>
  </div>
</template>

<script>
  import { add_shops, shops_list, update_shops } from "@/api/goods";
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        filterText: '',
        shopName: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        listLoading: true
      }
    },
    created() {
      // 获取现有的分类
      this.updateData();
    },
    methods: {
      createShops() {
        var obj = {
          name: this.shopName
        }
        this.createData(obj);
      },
      renderContent:function(createElement, { node, data, store }) {
          var that = this;
          return createElement('span', [
              createElement('span', node.label),
              // createElement('i', data.id),
              createElement('span', {attrs:{
                  style:"float: right; margin-right: 20px"
              }},[
                  createElement('el-button',{attrs:{
                      size:"mini"
                  },on:{
                      click:function() {
                        that.$prompt('请输入店铺名', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                        }).then(({ value }) => {
                          if(value){
                            update_shops(data.id, {name: value}).then((res) => {
                              that.updateData();
                            },(error) => {
                              that.$message({
                                message: '请检测当前店铺是否存在',
                                type: 'error'
                              });
                            })
                          }
                        }).catch(() => {});
                      }
                  }},"修改"),
              ]),
          ]);
      },
      // 过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      updateData() {
        let that = this;
        that.data = [];
        that.listLoading = true;
        shops_list().then((res) => {
          for(let i in res.result){
            let obj = {}
            obj['id'] = res.result[i]['id'];
            obj['label'] = res.result[i]['name'];
            that.data.push(obj);
          }
          that.listLoading = false;
        })
      },
      createData(obj) {
        let that = this;
        add_shops(obj).then(() => {
          that.updateData();
        },() => {
          that.$message({
            message: '请检测当前店铺是否存在',
            type: 'error'
          });
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .goodsAddForm{
    .el-form-item__label{
      width: 120px;
    }
  }
</style>
