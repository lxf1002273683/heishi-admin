<!-- 仓库列表nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">仓库列表</el-menu-item>
      <el-menu-item index="2">创建仓库</el-menu-item>
    </el-menu>
    <div class="warehouses_content">
      <template v-if="activeIndex == 1"><Warehouses></Warehouses></template>
      <template v-if="activeIndex == 2"><AddWarehouses></AddWarehouses></template>
    </div>
  </div>
</template>

<script>
  import Warehouses from './warehouses/warehouses';
  import AddWarehouses from './warehouses/add_warehouse';

  export default {
    components: {
      Warehouses,
      AddWarehouses
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
  .warehouses_content{
    padding: 20px;
  }
</style>