<template>
    <div class="app-container">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <router-link to="/admin/modules">
          <el-menu-item index="1">模块列表</el-menu-item>
        </router-link>
        <el-menu-item index="2">创建模块</el-menu-item>
      </el-menu>
      <el-form autoComplete="on" ref="addForm" :model="addForm" label-width="80px" :rules="loginRules" class="addform">
          <el-form-item label="模块名称" prop="name">
              <el-input v-model="addForm.name" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item label="权限值" prop="privilege" v-show="addForm.role != 2 && addForm.role != 3">
              <el-input v-model="addForm.privilege" autoComplete="on"></el-input>
              <span class="examine">2的n次方(n最小为1)</span>
          </el-form-item>
          <el-form-item label="商家ID" prop="user_id" v-if="addForm.role == 2 || addForm.role == 3">
              <el-input v-model="addForm.user_id" autoComplete="on"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { add_module } from '@/api/admin';
  export default {
    name: 'add_module',
    data() {
      const validatePrivilege = (rule, value, callback) =>{
        if ((value & (value - 1)) != 0) {
          callback(new Error('请输入2的n次方'));
        } else {
          callback();
        }
      }
      return {
        activeIndex: '2',
        addForm: {
          name: '',
          privilege: ''
        },
        loginRules: {
          name: [{ required: true, trigger: 'blur' }],
          privilege: [{ required: true, validator: validatePrivilege, trigger: 'blur' }]
        },
        type: 'password'
      }
    },
    methods: {
      onSubmit() {
        var that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            add_module(that.addForm).then((res)=>{
              this.$message({
                message: '创建成功',
                type: 'success'
              });
              // 重置
              this.$refs.addForm.resetFields();
            }).catch(function(err){
              that.$message({
                message: '创建失败，请查看模块是否已存在',
                type: 'error'
              });
            })
          }
        });
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
