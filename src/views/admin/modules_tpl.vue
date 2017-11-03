<!-- 模块列表nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">模块列表</el-menu-item>
      <el-menu-item index="2">创建模块</el-menu-item>
    </el-menu>
    <div class="module_content">
      <template v-if="activeIndex == 1"><Modules></Modules></template>
      <template v-if="activeIndex == 2"><AddModules></AddModules></template>
    </div>
  </div>
</template>

<script>
  import Modules from './modules/modules';
  import AddModules from './modules/add_module';
  import { addNav } from '@/utils/index';

  export default {
    components: {
      Modules,
      AddModules
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
  .module_content{
    padding: 20px;
  }
</style>
