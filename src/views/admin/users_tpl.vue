<!-- 用户列表nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">用户列表</el-menu-item>
      <el-menu-item index="2">创建用户</el-menu-item>
      <el-menu-item index="3">修改用户</el-menu-item>
      <el-menu-item index="4">权限配置</el-menu-item>
    </el-menu>
    <div class="user_content">
      <template v-if="activeIndex == 1"><Users></Users></template>
      <template v-if="activeIndex == 2"><AddUser></AddUser></template>
      <template v-if="activeIndex == 3"><UpdateUser></UpdateUser></template>
      <template v-if="activeIndex == 4"><ModulePrivilege></ModulePrivilege></template>
    </div>
  </div>
</template>

<script>
  import Users from './users/users';
  import AddUser from './users/add_user';
  import UpdateUser from './users/update_user';
  import ModulePrivilege from './users/module_privilege';
  import { addNav } from '@/utils/index';

  export default {
    components: {
      Users,
      AddUser,
      UpdateUser,
      ModulePrivilege
    },
    data() {
      return {
        activeIndex: '1'
      }
    },
    created() {
      addNav(this, this.$route);
    },
    methods: {
      // 切换nav
      select(key) {
        this.activeIndex = key;
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user_content{
    padding: 20px;
  }
</style>
