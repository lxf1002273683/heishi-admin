<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <router-link :to="{ path: '/comments/comments/'+query.id, query: { id: query.id, name: query.name }}">
        <el-menu-item index="1">评论列表</el-menu-item>
      </router-link>
      <el-menu-item index="2">短语列表</el-menu-item>
    </el-menu>
    <div class="quickphrases_list">
      <el-form autoComplete="on" ref="addForm" :model="addForm" label-width="80px" class="addform" :rules="loginRules">
        <el-form-item label="短语" prop="content">
            <el-input v-model="addForm.content" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
      <div class="content">
        <el-table :data="quickphrases_list" style="width: 100%" border>
          <el-table-column prop="content" label="短语列表"></el-table-column>
          <el-table-column label="操作" width="70">
            <template scope="scope">
              <el-button type="text" @click="deleteQuickphrases(scope.row.id,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { add_quickphrases, quickphrases_query, delete_quickphrases } from '@/api/comment';

  export default {
    data() {
      return {
        activeIndex: '2',
        query: {
          name: this.$route.query.name,
          id: this.$route.query.id,
        },
        addForm: {
          content: ''
        },
        loginRules: {
          content: [{ required: true, message: "请输入短语", trigger: 'blur' }],
        },
        quickphrases_list: [],
      }
    },
    created() {
      this.quickphrases_query();
    },
    methods: {
      // 创建
      onSubmit() {
        var that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_quickphrases(that.addForm).then((res)=>{
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              // 重置
              that.$refs.addForm.resetFields();
              // 刷新短语列表
              that.quickphrases_query();
            }).catch(function(err){
              that.$message({
                message: '创建失败，请查看帐号是否已存在',
                type: 'error'
              });
            })
          }
        });
      },
      // 查询
      quickphrases_query() {
        const that = this;
        quickphrases_query().then((res) => {
          that.quickphrases_list = res;
        })
      },
      deleteQuickphrases(id, index) {
        const that = this;
        const obj = {
          ids: [id]
        }
        delete_quickphrases(obj).then((res) => {
          that.$message({
            message: '删除成功',
            type: 'success'
          });
          that.quickphrases_list.splice(index, 1);
        },(error) => {
          that.$message({
            message: '删除失败',
            type: 'error'
          });
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .quickphrases_list{
    padding: 20px;
    .el-input{
      width: 240px;
    }
  }
</style>
