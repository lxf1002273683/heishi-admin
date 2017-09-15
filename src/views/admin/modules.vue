<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">模块列表</el-menu-item>
      <router-link to="/admin/add_module">
        <el-menu-item index="2">创建模块</el-menu-item>
      </router-link>
    </el-menu>
    <div class="tableData">
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" element-loading-text="拼命加载中" fit highlight-current-row>
        <el-table-column prop="name" label="模块" width="180">
          <template scope="scope">
              <span v-if="inputstatus != scope.$index">{{scope.row.name}}</span>
              <el-input v-model="scope.row.name" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="privilege" label="权限值">
        </el-table-column>
        <el-table-column width="70" label="操作">
          <template scope="scope">
            <el-input v-model="scope.row.id" type="hidden" class="hiddenbox"></el-input>
            <el-button size="small" @click="compileModule(scope.$index)">
              <span v-if="inputstatus != scope.$index">编辑</span>
              <span v-else="inputstatus != scope.$index">确认</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { modules_list, update_module } from '@/api/admin';
  export default {
    name: 'modules',
    data() {
      return {
        activeIndex: '1',
        listLoading: true,
        inputstatus: null,
        tableData: []
      }
    },
    created () {
      this.get_modules_list();
    },
    methods: {
      get_modules_list() {
        const that = this
        this.listLoading = true;
        modules_list().then((res)=>{
          that.tableData = res;
          this.listLoading = false;
        })
      },
      compileModule(index) {
        var that = this;
        if(that.inputstatus !== null){
          const inputstatus = that.inputstatus;
          const id = that.tableData[inputstatus]['id'];
          const name = that.tableData[inputstatus]['name'];
          update_module(id, name).then((res)=>{
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            that.inputstatus = null;
          }).catch(function(err){
            that.$message({
              message: '修改失败',
              type: 'error'
            });
            that.inputstatus = null;
          })
        }else{
          that.inputstatus = index;
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tableData{
    padding: 20px;
    .hiddenbox{
      display: block;
    }
  }
  .el-message-box{
    display: block;
    margin: 200px auto;
  }
</style>
