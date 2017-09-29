<!-- 用户首页 -->
<template>
  <div class="home">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="修改密码" name="1">
        <el-form ref="form" :model="form"  autoComplete="on"  label-width="80px" :rules="loginRules">

          <el-form-item label="当前密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password_new">
            <el-input v-model="form.password_new"></el-input>
          </el-form-item>
          <el-form-item label="再次输入" prop="password_confirmed">
            <el-input v-model="form.password_confirmed"></el-input>
          </el-form-item>
        <el-form-item>
    <el-button type="primary" @click="onSubmit">确认修改</el-button>
  </el-form-item>
</el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import { update_password } from '@/api/admin';
  export default {
    data() {
      const validatePass = (rule, value, callback) =>{
        if(this.form.password_new != this.form.password_confirmed){
          callback(new Error('两次输入的密码不正确'));
        }else{
          callback();
        }
      }
      return {
        activeNames: ['1'],
        form:{
          password: null,
          password_new: null,
          password_confirmed: null
        },
        loginRules: {
          password: { required: true, message: '请输入当前密码', trigger: 'blur' },
          password_new: { required: true, message: '请输入新密码', trigger: 'blur' },
          password_confirmed: { required: true, message: '请再次输入新密码', trigger: 'blur' }
        }
      }
    },
    methods: {
      onSubmit() {
        var that = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            update_password(that.form).then(() => {
              this.$store.dispatch('FedLogOut').then(() => {
                location.reload();
              });
            },(error) => {
              that.$message({
                message: '修改失败，请密码确认是否正确',
                type: 'error'
              })
            })
          }
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .home{
    padding: 20px;
    .el-form{
      width: 50%;
      min-width: 300px;
    }
  }
</style>
