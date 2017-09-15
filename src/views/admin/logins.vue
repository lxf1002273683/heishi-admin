<template>
  <div class="app-container">
    <div class="tableData">
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="account" label="用户名">
        </el-table-column>
        <el-table-column prop="ip" label="IP">
        </el-table-column>
        <el-table-column prop="login_time" label="时间">
        </el-table-column>
      </el-table>
      <!-- 已做分页 -->
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { logins } from '@/api/admin';
  export default {
    name: 'users',
    data() {
      return {
        tableData: [],
        totalPages: 0
      }
    },
    created () {
      const that = this;
      // 登录列表初始化
      that.getLoginsList().then((res)=>{
        that.tableData = res.results;
        that.totalPages = res.totalPages*10;
      })
    },
    methods: {
      handleCurrentChange(val) {
        const that = this
        that.getLoginsList(val).then((res)=>{
          that.tableData = res.results;
        })
      },
      getLoginsList(page) {
        const pages = page ? page : 1;
        return logins(pages);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tableData{
    padding: 20px;
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
</style>
