<!-- 大帐号关联帐号（业务帐号，大卖家，假帐号） -->
<template>
  <div class="app-container">
    <div class="tableData">
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="id" label="ID" width="60">
        </el-table-column>
        <el-table-column prop="account" label="用户名">
        </el-table-column>
        <el-table-column prop="nickname" label="昵称">
        </el-table-column>
        <el-table-column prop="email" label="email">
        </el-table-column>
        <el-table-column prop="role" label="角色">
          <template scope="scope">
            <span>{{roles[scope.row.role]}}</span>  
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button @click="userInfo(scope.row.id)" size="small">查看详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 已做分页 -->
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { users_list } from '@/api/business';
  import { get_user_info } from '@/api/admin';
  export default {
    data() {
      return {
        tableData: [],
        roles: ['管理员', '大帐号', '假帐号', '大卖家', '业务帐号', '其他卖家'],
        totalPages: 0
      }
    },
    created() {
      const that = this
      const obj = {
        parent_id: that.$store.getters.id
      }
      that.getUsersList(obj).then((res)=> {
        that.tableData = res.results;
        that.totalPages = res.totalPages * 10;
      })
    },
    methods: {
      handleCurrentChange(val) {
        const that = this
        const obj = {
          page: val
        }
        that.getUsersList(obj).then((res)=> {
          that.tableData = res.results;
        })
      },
      getUsersList(obj) {
        const params = obj ? obj : {};
        return users_list(params);
      },
      userInfo(id) {
        console.log(id);
        get_user_info(id).then((res) => {
          console.log(res);
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tableData{
    .pagination{
      position: relative;
      top: 20px;
    }
  }
</style>
