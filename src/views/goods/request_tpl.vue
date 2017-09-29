<!-- 入库申请列表 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"  @select="select">
      <el-menu-item index="1">入库申请</el-menu-item>
      <el-menu-item index="2">申请入库</el-menu-item>
    </el-menu>
    <div class="request_content">
      <template v-if="activeIndex == 1"><Request></Request></template>
      <template v-if="activeIndex == 2"><AddRequest></AddRequest></template>
    </div>
  </div>
</template>

<script>
  import Request from './requests/requests';
  import AddRequest from './requests/add_request';

  export default {
    components: {
      Request,
      AddRequest
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
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .request_content{
    padding: 20px;
  }
</style>

