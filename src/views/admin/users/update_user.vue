<template>
    <div class="app-container">
      <el-form autoComplete="on" ref="addForm" :model="addForm" label-width="120px" class="addform">
          <el-form-item label="用户名">
            <el-select class="select" v-model="userid" filterable remote placeholder="请输入修改用户" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in users" :key="item.value" :label="item.account" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
              <el-input v-model="addForm.nickname" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
              <el-input v-model="addForm.email" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addForm.phone" autoComplete="on"></el-input>
          </el-form-item>
          <!-- <el-form-item label="上级用户ID" prop="parent_id">
              <el-input v-model="addForm.parent_id" autoComplete="on"></el-input>
          </el-form-item> -->
          <el-form-item label="黑市用户ID" prop="hs_user_id">
              <el-input v-model="addForm.hs_user_id" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmit">立即修改</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { add_users, users_list, update_user } from '@/api/admin';
  export default {
    data() {
      return {
        activeIndex: '3',
        userid: '',
        loading: false,
        users: [],
        addForm: {
          nickname: '',
          email: '',
          phone: '',
          parent_id: '',
          hs_user_id: ''
          // password: ''
        }
      }
    },
    methods: {
      onSubmit() {
        const that = this;
        update_user(this.userid, this.addForm).then((res) => {
          that.$message({
            message: '修改成功',
            type: 'success'
          });
          that.$refs.addForm.resetFields();
        }, (error) => {
          that.$message({
            message: '修改失败',
            type: 'error'
          });
        })
      },
      // 远程搜索
      remoteMethod(query) {
        const that = this;
        const obj = {
          account: query
        }
        users_list(obj).then((res) => {
          that.users = res.results;
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .addform{
    .el-input{
      width: 240px;
    }
    .select{
      width: 240px;
    }
  }
</style>
