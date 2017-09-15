<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">用户列表</el-menu-item>
      <router-link to="/admin/add_user">
        <el-menu-item index="2">创建用户</el-menu-item>
      </router-link>
      <router-link to="/admin/update_user">
        <el-menu-item index="3">修改用户</el-menu-item>
      </router-link>
      <router-link to="/admin/module_privilege">
        <el-menu-item index="4">权限配置</el-menu-item>
      </router-link>
    </el-menu>
    <div class="tableData">
      <el-table :data="tableData" style="width: 100%" stripe border >
        <el-table-column prop="account" label="用户名">
        </el-table-column>
        <el-table-column prop="avatar" label="头像">
        </el-table-column>
        <el-table-column prop="role" label="角色">
          <template scope="scope">
            <span>{{roles[scope.row.role]}}</span>  
          </template>
        </el-table-column>
        <el-table-column prop="module_privilege" label="权限值">
        </el-table-column>
        <el-table-column prop="parent_id" label="管理者">
        </el-table-column>
      </el-table>
      <!-- 已做分页 -->
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { users_list } from '@/api/business';
  export default {
    name: 'users',
    data() {
      return {
        activeIndex: '1',
        tableData: [],
        roles: ['管理员', '大帐号', '假帐号', '大卖家', '业务帐号', '其他卖家'],
        totalPages: 0
      }
    },
    created () {
      const that = this
      that.getUsersList().then((res)=>{
        that.tableData = res.results;
        that.totalPages = res.totalPages*10;
      })
    },
    methods: {
      handleCurrentChange(val) {
        const that = this
        const obj = {
          page: val
        }
        that.getUsersList(obj).then((res)=>{
          that.tableData = res.results;
        })
      },
      getUsersList(obj) {
        const params = obj ? obj : {};
        return users_list(params);
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
