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
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button @click="userInfo(scope.row.id)" size="small" v-if="scope.row.role == 4">查看详情</el-button>
            <el-button @click="userInfo(scope.row.id)" size="small" v-else :disabled="true">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已做分页 -->
      <el-pagination v-if="totalPages > 10" layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentChange" class='pagination'>
      </el-pagination>
    </div>
    <el-dialog title="关联详情" :visible.sync="dialogStatus" top="10%" class="dialog">
      <el-table :data="privilegeData" style="width: 100%" stripe border>
        <el-table-column prop="name" label="关联模块"></el-table-column>
        <el-table-column prop="owners" label="关联帐号">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.owners">{{item.account}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owners" label="关联帐号ID">
          <template scope="scope">
            <div class="content-rowspan">
              <div v-for="item in scope.row.owners">{{item.id}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { users_list } from '@/api/business';
  import { get_user_info } from '@/api/admin';
  import { getPrivileges } from '@/api/login';

  export default {
    data() {
      return {
        tableData: [],
        roles: ['管理员', '大帐号', '假帐号', '大卖家', '业务帐号', '其他卖家'],
        totalPages: 0,
        dialogStatus: false,
        privilegeData: []
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
        const that = this;
        getPrivileges(id).then((res) => {
          that.dialogStatus = true;
          that.privilegeData = res;
        },(error) => {
          that.$message({
            message: error.message,
            type: 'error'
          });
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
  .dialog{
    .content-rowspan div {
      padding: 0 18px;
      line-height: 28px;
      min-height: 28px;
      border-bottom: 1px solid #ECEDEE;
      right: -18px;
      margin-left: -36px;
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .content-rowspan div:last-child {
      border-bottom: 0;
    }
  }
</style>
