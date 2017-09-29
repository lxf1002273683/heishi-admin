<!-- spu列表nav模板 -->
<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="select">
      <el-menu-item index="1">SPU列表</el-menu-item>
      <el-menu-item index="2">创建SPU</el-menu-item>
      <el-menu-item index="3">创建店铺</el-menu-item>
      <el-menu-item index="4">创建分类</el-menu-item>
    </el-menu>
    <div class="spu_content">
      <template v-if="activeIndex == 1"><Spus></Spus></template>
      <template v-if="activeIndex == 2"><AddSpus></AddSpus></template>
      <template v-if="activeIndex == 3"><AddShops></AddShops></template>
      <template v-if="activeIndex == 4"><AddCategories></AddCategories></template>
    </div>
  </div>
</template>

<script>
  import Spus from './spus/spus';
  import AddSpus from './spus/add_spus';
  import AddShops from './spus/add_shops';
  import AddCategories from './spus/add_categories';

  export default {
    components: {
      Spus,
      AddSpus,
      AddShops,
      AddCategories
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
  .spu_content{
    padding: 20px;
  }
</style>

