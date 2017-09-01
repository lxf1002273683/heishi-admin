<template>
    <div class="app-container">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <router-link to="/business/users">
          <el-menu-item index="1">用户列表</el-menu-item>
        </router-link>
        <el-menu-item index="2">创建用户</el-menu-item>
      </el-menu>
      <el-form autoComplete="on" ref="addForm" :model="addForm" label-width="80px" :rules="loginRules" class="addform">
          <el-form-item label="用户名" prop="account">
              <el-input v-model="addForm.account" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" :type="type" autoComplete="on"></el-input>
              <span class="examine" @mousedown="onPasswordDown"  @mouseup="onPasswordUp">查看密码</span>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { add_users } from '@/api/admin';
  export default {
    name: 'add_users',
    data() {
      const validatePass = (rule, value, callback) =>{
        if (value.length < 6 && this.addForm.role != 2 && this.addForm.role != 3) {
          callback(new Error('密码不能小于6位'));
        } else {
          callback();
        }
      }
      const validateRes = (rule, value, callback) =>{
        if(value){
          callback();
        }else{
          callback(new Error('请选择角色'));
        }
      }
      return {
        activeIndex: '2',
        addForm: {
          account: '',
          password: '',
          role: '4',
          parent_id: this.$store.getters.id
        },
        loginRules: {
          account: [{ required: true, message: "请输入用户名", trigger: 'blur' }],
          password: [{ required: true, message: "请输入密码", validator: validatePass, trigger: 'blur' }]
        },
        type: 'password'
      }
    },
    methods: {
      onSubmit() {
        var that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_users(that.addForm).then((res)=>{
              that.$message({
                message: '创建成功',
                type: 'success'
              });
              // 重置
              that.$refs.addForm.resetFields();
            }).catch(function(err){
              that.$message({
                message: '创建失败，请查看帐号是否已存在',
                type: 'error'
              });
            })
          }
        });
      },
      onPasswordDown() {
        this.type = 'text';
      },
      onPasswordUp() {
        this.type = 'password';
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .addform{
    padding: 20px;
    .el-input{
      width: 240px;
    }
    .examine{
      cursor: pointer;
      color: #20a0ff;
      margin-left: 20px;
    }
  }
</style>
