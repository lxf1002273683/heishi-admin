<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">仓库列表</el-menu-item>
      <router-link to="/warehouse/add_warehouse">
        <el-menu-item index="2">创建仓库</el-menu-item>
      </router-link>
    </el-menu>
    <div class="skus_list">
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="name" label="仓库名称">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.name}}</span>
            <el-input v-model="scope.row.name" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.memo}}</span>
            <el-input v-model="scope.row.memo" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="仓库类型">
          <template scope="scope">
            <span v-if="inputstatus != scope.$index">{{scope.row.type}}</span>
            <el-input v-model="scope.row.type" v-if="inputstatus == scope.$index"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
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
  import { warehouse_list, update_warehouse } from '@/api/warehouse';

  export default {
    data() {
      return {
        activeIndex: '1',
        tableData: [],
        inputstatus: null
      }
    },
    created() {
      // 获取现有的分类
      this.getWarehouse();
    },
    methods: {
      getWarehouse() {
        const that = this;
        warehouse_list().then((res) => {
          that.tableData = res.data;
        })
      },
      compileModule(index) {
        var that = this;
        if(that.inputstatus !== null){
          const inputstatus = that.inputstatus;
          const id = that.tableData[inputstatus]['id'];
          const obj = {
            name: that.tableData[inputstatus]['name'],
            memo: that.tableData[inputstatus]['memo'],
            type: that.tableData[inputstatus]['type']
          }
          update_warehouse(id, obj).then(()=>{
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
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .skus_list{
    padding: 20px;
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
    .hiddenbox{
      display: none;
    }
  }
</style>

