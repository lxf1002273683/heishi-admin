<!-- 大帐号帐号管理nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">用户列表</el-menu-item>
      <el-menu-item index="2">创建业务帐号</el-menu-item>
    </el-menu>
    <div class="user_content">
      <template v-if="activeIndex == 1"><Users></Users></template>
      <template v-if="activeIndex == 2"><AddUsers></AddUsers></template>
    </div>
  </div>
</template>

<script>
  import Users from './users/users';
  import AddUsers from './users/add_user';

  export default {
    components: {
      Users,
      AddUsers
    },
    data() {
      return {
        activeIndex: '1'
      }
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
