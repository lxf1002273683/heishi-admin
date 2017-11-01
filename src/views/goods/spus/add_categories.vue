<!-- 创建分类 -->
<template>
  <div class="app-container">
    <div class="goodsAddForm">
      <el-form label-width="80px">
        <el-form-item label="一级分类">
            <el-input v-model="goodsName" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="createNode">立即创建</el-button>
        </el-form-item>
      </el-form>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree :data="data" :props="defaultProps" :filter-node-method="filterNode" ref="tree" :render-content="renderContent" node-key="id" :expand-on-click-node="false" default-expand-all v-loading.body="listLoading" element-loading-text="拼命加载中"></el-tree>
    </div>
  </div>
</template>

<script>
  import { add_categories, categories_list, update_categories, classify, delete_categories } from "@/api/goods";
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        filterText: '',
        goodsName: '',
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
      createNode() {
        var obj = {
          name: this.goodsName
        }
        this.createData(obj);
      },
      renderContent:function(createElement, { node, data, store }) {
          var that = this;
          return createElement('span', [
              createElement('span', data.id),
              createElement('span', ' | '),
              createElement('span', node.label),
              // createElement('i', data.id),
              createElement('span', {attrs:{
                  style:"float: right; margin-right: 20px"
              }},[
                  createElement('el-button',{attrs:{
                      size:"mini"
                  },on:{
                      click:function() {
                        that.$prompt('请输入分类', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                        }).then(({ value }) => {
                          if(value){
                            const length = data.code.split('-').length;
                            if(length >= 3){
                              that.$message({
                                message: '请不要在三级分类中添加',
                                type: 'error'
                              });
                            } else {
                              let obj = {
                                parent_id: data.id,
                                name: value
                              }
                              that.createData(obj);
                            }
                          }
                        }).catch(()=>{})
                      }
                  }},"添加"),
                  createElement('el-button',{attrs:{
                      size:"mini"
                  },on:{
                      click:function() {
                        that.$prompt('请输入分类', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                        }).then(({ value }) => {
                          if(value){
                            update_categories(data.id, {name: value}).then(() => {
                              that.updateData();
                            },(error) => {
                              that.$message({
                                message: '请检测当前分类是否存在',
                                type: 'error'
                              });
                            })
                          }
                        }).catch(()=>{})
                      }
                  }},"修改"),
                  // createElement('el-button',{attrs:{
                  //     size: "mini",
                  //     type: "danger"
                  // },on:{
                  //     click:function() {
                  //       that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  //         confirmButtonText: '确定',
                  //         cancelButtonText: '取消',
                  //         type: 'warning'
                  //       }).then(() => {
                  //         const arr = [];
                  //         arr.push(data.id);
                  //         delete_categories(arr).then(() => {
                  //           that.$message({
                  //             message: '删除成功',
                  //             type: 'success'
                  //           });
                  //           that.updateData();
                  //         },(error) => {
                  //           that.$message({
                  //             message: error.message,
                  //             type: 'error'
                  //           });
                  //         })
                  //       }).catch(()=>{})
                  //     }
                  // }},"删除"),
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
        categories_list().then((res) => {
          that.data = classify(res);
          that.listLoading = false;
        })
      },
      createData(obj) {
        let that = this;
        add_categories(obj).then(() => {
          that.updateData();
        },() => {
          that.$message({
            message: '请检测当前分类是否存在',
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
    .el-tree{
      .el-tree-node__content i{
        background-color: #8391a5;
        display: inline-block;
        padding: 0 5px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        color: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid transparent;
        white-space: nowrap;
        margin-left: 18px;
      }
      /*火狐兼容问题*/
      span{
        white-space: normal;
      }
    }
  }
</style>
