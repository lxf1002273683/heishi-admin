<template>
  <div class="app-container">
    <div class="tableData" v-if="activeIndex == '/admin/users'">
      <el-table :data="tableData" style="width: 100%" stripe border v-loading.body="listLoading" element-loading-text="拼命加载中">
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
        <el-table-column prop="parent_id" label="管理者"></el-table-column>
      </el-table>
      <!-- 已做分页 -->
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <div class="add_user" v-if="activeIndex == '/admin/add_user'">
      <AddUser></AddUser>
    </div>
    <div class="update_user" v-if="activeIndex == '/admin/update_user'">
      <UpdateUser></UpdateUser>
    </div>
    <div class="module_privilege" v-if="activeIndex == '/admin/module_privilege'">
      <ModulePrivilege></ModulePrivilege>
    </div>
  </div>
</template>

<script>
  import { users_list } from '@/api/business';
  import AddUser from './add_user';
  import UpdateUser from './update_user';
  import ModulePrivilege from './module_privilege';
  export default {
    components: {
      AddUser,
      UpdateUser,
      ModulePrivilege
    },
    data() {
      return {
        activeIndex: '/admin/users',
        tableData: [],
        roles: ['管理员', '大帐号', '假帐号', '大卖家', '业务帐号', '其他卖家'],
        totalPages: 0,
        listLoading: true
      }
    },
    created () {
      this.getUsersList();
    },
    methods: {
      handleCurrentChange(val) {
        const obj = {
          page: val
        }
        this.getUsersList(obj);
      },
      getUsersList(obj) {
        const params = obj ? obj : {};
        const that = this;
        this.listLoading = true;
        users_list(params).then((res) => {
          that.tableData = res.results;
          that.totalPages = res.totalPages*10;
          that.listLoading = false;
        })
      },
      // 切换nav
      select(key) {
        this.activeIndex = key;
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tableData{
    .pagination{
      text-align: center;
      padding: 20px 0;
    }
  }
</style>
